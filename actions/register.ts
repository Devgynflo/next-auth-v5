"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { RegisterSchema } from "@/schemas";
import prisma from "@/lib/db/prisma";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  console.log("🚀 ~ register ~ validatedFields:", validatedFields);

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

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedpassword,
    },
  });

  //TODO: Send verification token email

  return {
    success: true,
    message: "Email sent!",
  };
};
