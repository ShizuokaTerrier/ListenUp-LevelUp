import express, { NextFunction } from 'express';
import cors from 'cors';
const { logger } = require('./logEvents');
// import errorHandler from './middleware/errorHandler';
// import * as UsersController from './user_profiles/users.controller';
import * as GamesScoresController from './game_scores/gameScores.controller';
// import { verifyJWT } from './middleware/verifyJWT';
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 8000;
const app = express();
import { auth } from 'express-oauth2-jwt-bearer';

// custom middleware logger
app.use(logger);

// middle-ware for handling encoded data, such as form data

app.use(express.urlencoded({ extended: false }));

//middle-ware for cookies
app.use(cookieParser());

// middle-ware for JSON

app.use(express.json());

const jwtCheck = auth({
  audience: 'localhost:8000/api',
  issuerBaseURL: 'https://dev-ub84xie5mxyi2g4z.us.auth0.com/',
  tokenSigningAlg: 'RS256',
});

// Cross Origin Resource Sharing - remove the !origin when you want cors to start running properly
const whitelist = [
  'http://listenuplevelup.com',
  'http://localhost:8000',
  'http://localhost:8000/',
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

// app.get('/', async (req, res) => {
//   res.json({ message: 'Success!' });
// });

// JWT authorization test route

// app.get('/test', verifyJWT, async (req, res) => {
//   res.json({ message: 'Success!' });
// });

// User Routes

// app.post('/user', UsersController.registerNewUser);
// app.post('/login', UsersController.handleLogin);
// app.get('/refresh', UsersController.handleRefreshToken);
// app.get('/logout', UsersController.handleLogOut);
// app.use(verifyJWT); // everything after this will require a JWT
// app.use(errorHandler);

// be sure to use Bearer Token not JWT Token when testing this on PostMan.
app.use(jwtCheck);
app.get('/', async (req, res) => {
  res.json({ message: 'The authO is working' });
});
app.get('/scores', GamesScoresController.getAllScores);
app.post('/scores', GamesScoresController.handleScores);

app.listen(PORT);

console.log('Running on port', PORT);
