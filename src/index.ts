import express from 'express';
import { Request, Response, Router } from 'express';
import cors from 'cors';

const app = express();
const router = Router();

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
  res.json({ message: 'Success!' });
});

app.listen(8000, () => {
  console.log('Server running on localhost:8000');
});
