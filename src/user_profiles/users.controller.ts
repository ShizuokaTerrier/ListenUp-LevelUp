import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response, Request } from 'express';
import * as userModel from './users.model';

dotenv.config();

// registerNewUser first checks whether a username, password, and email are provided. It then encrypts the password with bcrypt using a salt round of ten. Before adding a new user to the database it first checks that a user with the same email address does not already exist.

export const registerNewUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email)
    return res
      .status(400)
      .json({ message: 'Username, password, and email are required.' });
  try {
    // encrypt with bCrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);
    // store the new user
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPwd,
    };
    const checkForExistingUser = await userModel.duplicateUser(userData);
    if (checkForExistingUser) {
      return res
        .status(409)
        .send(
          `When checking to see whether a user with this email already exists in the database the result was ${checkForExistingUser}`
        );
    }

    const newUser = await userModel.createNewUser(userData);
    res.status(200).send(newUser);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
// this function uses bcrypts compare method to check whether the input password matches the one we have in the database.

export const handleLogin = async (req: Request, res: Response) => {
  const { password, email } = req.body;
  if (!password || !email)
    return res
      .status(400)
      .json({ message: 'Username, password, and email are required.' });
  try {
    const loginInfo = {
      email: email,
      password: password,
    };
    const existingUserInfo = await userModel.loginUser(loginInfo);
    // if you don't have this if statement TS gets annoyed. Basically, it allows typescript to rule out the possibility that existingUserInfo is null or undefined.
    if (existingUserInfo !== null && existingUserInfo !== undefined) {
      const hashedPassword = existingUserInfo.password;
      const match = await bcrypt.compare(loginInfo.password, hashedPassword);
      if (
        match &&
        process.env.ACCESS_TOKEN_SECRET &&
        process.env.REFRESH_TOKEN_SECRET
      ) {
        // create a JWT
        const accessToken = jwt.sign(
          { username: existingUserInfo.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '300s' }
        );
        const refreshToken = jwt.sign(
          { username: existingUserInfo.username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '1d' }
        );
        const saveRefreshToken = await userModel.createUserRefreshToken(
          existingUserInfo,
          refreshToken
        );
        // HTTP only cookie because that is not avaialable to JS
        if (saveRefreshToken) {
          res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          res.json({ accessToken });
        }
      } else {
        res.status(401).send('Password Incorrect: please try again');
      }
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Username, password, and email are required.' });
  }
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  const loginInfo = {
    username: username,
    email: email,
    password: password,
    refreshToken: refreshToken,
  };
  const checkRefreshToken = await userModel.checkRefreshToken(loginInfo);
  if (!checkRefreshToken) return res.status(403); // forbidden
  if (checkRefreshToken && process.env.REFRESH_TOKEN_SECRET) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err: any, decoded: any) => {
        if (err || checkRefreshToken.username !== decoded.username)
          return res.status(403);
        if (process.env.ACCESS_TOKEN_SECRET) {
          const accessToken = jwt.sign(
            { username: decoded.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1D' }
          );

          res.json({ accessToken });
        }
      }
    );
  }
};

export const handleLogOut = async (req: Request, res: Response) => {
  // On client also delete the access token
  const { username, password, email } = req.body;
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204); // no content to send
  const refreshToken = cookies.jwt;
  const loginInfo = {
    username: username,
    email: email,
    password: password,
    refreshToken: refreshToken,
  };
  const checkRefreshToken = await userModel.checkRefreshToken(loginInfo);
  if (!checkRefreshToken) {
    res.clearCookie('jwt', { httpOnly: true });
    return res.status(204); // successful with no content
  }
  // Delete the refresh token
  const replaceToken = 'User logged out';
  const saveRefreshToken = await userModel.createUserRefreshToken(
    loginInfo,
    replaceToken
  );
  if (saveRefreshToken)
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
  return res.status(200).send('User logged out');
};
