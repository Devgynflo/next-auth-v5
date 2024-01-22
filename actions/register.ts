"use server";

import { RegisterSchema } from "@/schemas";
import * as z from "zod";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.parse(values);

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
