import prisma from "@/lib/db/prisma";

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const verificationEmail = await prisma.twoFactorToken.findFirst({
      where: {
        email,
      },
    });

    return verificationEmail;
  } catch (error) {
    console.log(error);
  }
};

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findUnique({
      where: {
        token,
      },
    });

    return twoFactorToken;
  } catch (error) {
    console.log(error);
  }
};
