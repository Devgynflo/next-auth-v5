import prisma from "@/lib/db/prisma";

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const verificationEmail = await prisma.passwordResetToken.findFirst({
      where: {
        email,
      },
    });

    return verificationEmail;
  } catch (error) {
    console.log(error);
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordToken = await prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    return passwordToken;
  } catch (error) {
    console.log(error);
  }
};
