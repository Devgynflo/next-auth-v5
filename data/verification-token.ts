import prisma from "@/lib/db/prisma";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationEmail = await prisma.verificationToken.findFirst({
      where: {
        email,
      },
    });

    return verificationEmail;
  } catch (error) {
    console.log(error);
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });

    return verificationToken;
  } catch (error) {
    console.log(error);
  }
};
