"use server";

import { LoginSchema } from "@/schemas";
import * as z from "zod";
LoginSchema;

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.parse(values);

  if (!validatedFields) {
    return {
      success: false,
      message: "Invalid fields",
    };
  }

  return {
    success: true,
    message: "Email sent!",
  };
};
