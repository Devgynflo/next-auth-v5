"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/resend/mail";
import { generatePasswordResetToken } from "@/lib/token";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validateFields = ResetSchema.safeParse(values);

  if (!validateFields.success) {
    return { success: false, message: "Invalid Email !" };
  }

  const { email } = validateFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { success: false, message: "Invalid Email" };
  }

  //Generate token & Send Email
  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: true, message: "Email sent !" };
};
