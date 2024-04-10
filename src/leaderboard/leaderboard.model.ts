import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTopTenScores = async () => {
  const topTenScores = await prisma.score.findMany({
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
  const result = topTenScores.map((score) => {
    return {
      username: score.user.username,
      score: score.value,
    };
  });
};
