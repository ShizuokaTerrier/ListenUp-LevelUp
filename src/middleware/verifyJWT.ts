import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../interfaces';
dotenv.config();

export const verifyJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader); // bearer token
  if (!authHeader) return res.status(401).send('Unauthorized');
  const token = authHeader.split(' ')[1];
  console.log(token);
  if (process.env.ACCESS_TOKEN_SECRET) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).send('Forbidden'); // invalid token
      req.user = (decoded as { username: string }).username;
      next();
    });
  } else {
    return res
      .status(500)
      .send('Internal Server Error: Access token does not exist');
  }
};
