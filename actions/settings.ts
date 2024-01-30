"use server";
import bcrypt from "bcryptjs";
import * as z from "zod";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { SettingsSchema } from "@/schemas";

import prisma from "@/lib/db/prisma";
import { sendVerificationEmail } from "@/lib/resend/mail";
import { generateVerificationToken } from "@/lib/token";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      message: "Unauthorized User",
    };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return {
      success: false,
      message: "Unauthorized User",
    };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // si un email est fourni et qu'il est différent de l'email de l'utilisateur actuel
  if (values.email && values.email !== user.email) {
    // on vérifie si un utilisateur avec cet email existe déjà
    const existingUser = await getUserByEmail(values.email);
    // si un utilisateur existe déjà avec cet email et que ce n'est pas l'utilisateur actuel
    if (existingUser && existingUser.id !== user.id) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: true,
      message:
        "Email updated successfully. Please check your email for verification",
    };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordMatch) {
      return {
        success: false,
        message: "Incorrect password",
      };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 12);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await prisma.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      ...values,
    },
  });

  return {
    success: true,
    message: "Settings updated successfully",
  };
};
