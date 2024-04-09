import { Request, Response } from 'express';
import * as leaderboardModel from './leaderboard.model';

export const getLeaderBoard = async (req: Request, res: Response) => {
  try {
    const getLeaderBoardScores = await leaderboardModel.getTopTenScores();
    res.status(200).json(getLeaderBoardScores);
  } catch (error: any) {
    console.error('An error occurred:', error.message);
  }
};
