import express, { NextFunction } from 'express';
import { Request, Response, Router } from 'express';
import cors from 'cors';
const { logger } = require('./logEvents');
import errorHandler from './middleware/errorHandler';
import * as UsersController from './user_profiles/users.controller';
import * as GamesScoresController from './game_scores/gameScores.controller';
import { verifyJWT } from './middleware/verifyJWT';
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 8000;
const app = express();

// custom middleware logger
app.use(logger);

// middle-ware for handling encoded data, such as form data

app.use(express.urlencoded({ extended: false }));

//middle-ware for cookies
app.use(cookieParser());

// middle-ware for JSON

app.use(express.json());

// Cross Origin Resource Sharing - remove the !origin when you want cors to start running properly
const whitelist = [
  'http://listenuplevelup.com',
  'http://localhost:8000',
  'http://localhost:5173',
];
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (whitelist.indexOf(origin || '') !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get('/', async (req, res) => {
  res.json({ message: 'Success!' });
});

// JWT authorization test route

app.get('/test', verifyJWT, async (req, res) => {
  res.json({ message: 'Success!' });
});

// User Routes

app.post('/user', UsersController.registerNewUser);
app.post('/login', UsersController.handleLogin);
app.get('/refresh', UsersController.handleRefreshToken);
app.get('/logout', UsersController.handleLogOut);
app.post('/scores', GamesScoresController.handleScores);

app.use(verifyJWT); // everything after this will require a JWT
app.use(errorHandler);

app.listen(8000, () => {
  console.log(`Server running on localhost:${PORT}`);
});
