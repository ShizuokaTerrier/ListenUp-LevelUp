import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addScore = async (data: any) => {
  try {
    const newScore = await prisma.score.create({
      data: {
        id: data.id,
        gameId: data.gameId,
        userId: data.userId,
        value: data.value,
      },
    });
    return newScore;
  } catch (error: any) {
    console.error(
      'Error when attempting to add score to the database',
      error.message
    );
    throw new Error('Failed to add score');
  }
};

export const getAllScores = async () => {
  try {
    return await prisma.score.findMany();
  } catch (error: any) {
    throw new Error('Failed to fetch any scores');
  }
};
