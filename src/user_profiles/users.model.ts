import { PrismaClient } from '@prisma/client';
import { handleRefreshToken } from './users.controller';

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
export const createUserRefreshToken = async (
  userdata: any,
  refreshToken: any
) => {
  try {
    const createRefreshToken = await prisma.user.update({
      where: {
        username: userdata.username,
      },
      data: {
        refreshToken: refreshToken,
      },
    });
    return createRefreshToken;
  } catch (error: any) {
    console.error(
      'Error when attemping to create refresh token',
      error.message
    );
  }
};
export const checkRefreshToken = async (data: any) => {
  try {
    const refreshChecker = await prisma.user.findFirst({
      where: {
        refreshToken: data.refreshToken,
        username: data.username,
      },
    });
    return refreshChecker;
  } catch (error: any) {
    console.error('Error checking for refresh token:', error.message);
    throw error;
  }
};
