"use server";
import bcrypt from "bcryptjs";
import * as z from "zod";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";

import prisma from "@/lib/db/prisma";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string
) => {
  if (!token) {
    return { success: false, message: "Missing token" };
  }
  // Validate fields
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: "Invalid fields" };
  }
  // Get password field
  const { password } = validatedFields.data;
  // Get token
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { success: false, message: "Invalid token" };
  }
  // Check if token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { success: false, message: "Token has expired" };
  }
  // Get user
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { success: false, message: "Invalid user" };
  }
  // Update password user with new password hashed
  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma?.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  // Delete token in password reset token table
  await prisma.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });
  // Return success
  return { success: true, message: "Password updated" };
};
