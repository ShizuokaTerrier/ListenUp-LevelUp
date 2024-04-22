import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const duplicateUser = async (fieldName: string, value: any) => {
  try {
    const checkForDuplicate = await prisma.user.findFirst({
      where: {
        [fieldName]: value,
      },
    });
    return !!checkForDuplicate;
  } catch (error) {
    console.error('Error checking for duplicate:', error);
    throw error;
  }
};
