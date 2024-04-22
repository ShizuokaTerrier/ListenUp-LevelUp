import bcrypt from 'bcrypt';
import { Response, Request } from 'express';

const registerNewUser = async (req: Request, res: Response) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  try {
    // encrypt with bCrypt
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // store the new user
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
