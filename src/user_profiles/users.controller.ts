import bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import * as userModel from './users.model';

// registerNewUser first checks whether a username, password, and email are provided. It then encrypts the password with bcrypt using a salt round of ten. Before adding a new user to the database it first checks that a user with the same email address does not already exist.

export const registerNewUser = async (req: Request, res: Response) => {
  const { username, pwd, email } = req.body;
  if (!username || !pwd || !email)
    return res
      .status(400)
      .json({ message: 'Username, password, and email are required.' });
  try {
    // encrypt with bCrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(pwd, salt);
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

export const handleLogin = async (req: Request, res: Response) => {
  const { username, pwd, email } = req.body;
  if (!username || !pwd || !email)
    return res
      .status(400)
      .json({ message: 'Username, password, and email are required.' });
  try {
    const loginInfo = {
      username: username,
      email: email,
      password: pwd,
    };
    const existingUserInfo = await userModel.loginUser(loginInfo);
    if (existingUserInfo !== null && existingUserInfo !== undefined) {
      const hashedPassword = existingUserInfo.password;
      const match = await bcrypt.compare(loginInfo.password, hashedPassword);
      if (match) {
        // create a JWT
        res.json({ success: `User ${existingUserInfo.username} is logged in` });
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
