import bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import * as userModel from './users.model';

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
