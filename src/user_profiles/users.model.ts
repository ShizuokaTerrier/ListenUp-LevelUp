import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const duplicateUser = async (data: any) => {
  try {
    const checkForDuplicate = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    return !!checkForDuplicate;
  } catch (error) {
    console.error('Error checking for duplicate:', error);
    throw error;
  }
};

export const createNewUser = async (data: any) => {
  return await prisma.user.create({
    data,
  });
};
