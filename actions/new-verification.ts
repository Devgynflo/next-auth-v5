"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import prisma from "@/lib/db/prisma";

export const newVerification = async (token: string) => {
  const exitingToken = await getVerificationTokenByToken(token);
  if (!exitingToken) {
    return {
      success: false,
      message: "Invalid token",
    };
  }

  const hasExpired = new Date(exitingToken.expires) < new Date();
  if (hasExpired) {
    return {
      success: false,
      message: "Token has expired",
    };
  }

  const existingUser = await getUserByEmail(exitingToken.email);
  if (!existingUser) {
    return {
      success: false,
      message: "User not found",
    };
  }

  // Mise à jour de l'utilisateur (emailVerified)
  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      // ? users can update email if they have access settings page
      email: exitingToken.email,
    },
  });

  // Suppression du token
  await prisma.verificationToken.delete({
    where: {
      id: exitingToken.id,
    },
  });

  // Message de succès
  return {
    success: true,
    message: "Your account has been verified. You can now login.",
  };
};
