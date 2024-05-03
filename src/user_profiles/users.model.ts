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
  } catch (error: any) {
    console.error('Error checking for duplicate:', error.message);
    throw error;
  }
};

export const createNewUser = async (data: any) => {
  return await prisma.user.create({
    data,
  });
};
export const loginUser = async (data: any) => {
  try {
    const loginInfo = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    return loginInfo;
  } catch (error: any) {
    console.error('Error when attemping to login user', error.message);
  }
};
