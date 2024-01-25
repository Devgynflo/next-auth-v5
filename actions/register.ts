"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { getUserByEmail } from "@/data/user";
import prisma from "@/lib/db/prisma";
import { sendVerificationEmail } from "@/lib/resend/mail";
import { generateVerificationToken } from "@/lib/token";
import { RegisterSchema } from "@/schemas";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid fields",
    };
  }

  const { email, password, name } = validatedFields.data;
  const hashedpassword = await bcrypt.hash(password, 12);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      success: false,
      message: "User already exists",
    };
  }

  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedpassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  // Send verification token email
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return {
    success: true,
    message: "Confirmation email sent",
  };
};
