import express from 'express';
import { Request, Response, Router } from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 8000;
const app = express();
const router = Router();

// custom middleware logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// middle-ware for handling encoded data, such as form data

app.use(express.urlencoded({ extended: false }));

// middle-ware for JSON

app.use(express.json());

// Cross Origin Resource Sharing - remove the !origin when you want cors to start running properly
const whitelist = ['http://listenuplevelup.com', 'http://localhost:8000'];
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

app.listen(8000, () => {
  console.log(`Server running on localhost:${PORT}`);
});
