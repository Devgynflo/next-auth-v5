import prisma from "@/lib/db/prisma";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique(
      {
        where: {
          userId,
        },
      }
    );

    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};
