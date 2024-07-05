import * as gameScoresModel from './gameScores.model';
import { Response, Request } from 'express';

export const handleScores = async (req: Request, res: Response) => {
  const { value, gameId, userId } = req.body;
  console.log(req.body);
  if (!value || !gameId || !userId)
    return res
      .status(400)
      .json({ message: 'value, gameId and userId required' });
  try {
    const newScore = {
      value: value,
      gameId: gameId,
      userId: userId,
    };

    const addNewScore = await gameScoresModel.addScore(newScore);
    if (!addNewScore) {
      // Handle case where addScore returns undefined or null
      return res.status(500).json({ message: 'Failed to add score' });
    }
    res.status(200).send(addNewScore);
  } catch (error) {
    console.error('Error adding scores:', error);
    return res.status(500).json({ message: 'Failed to add score' });
  }
};

export const getAllScores = async (req: Request, res: Response) => {
  try {
    const getTheScores = await gameScoresModel.getAllScores();

    res.status(200).send(getTheScores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    return res.status(500).json({ message: 'Failed to fetch scores' });
  }
};
