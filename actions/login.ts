"use server";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import * as z from "zod";

import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/resend/mail";
import { generateVerificationToken } from "@/lib/token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // Check some entries
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid fields",
    };
  }
  // Check if user exists with email
  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      success: false,
      message: "Email does not exist",
    };
  }

  // Generate new token if user has not verified email
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    // Send email for verification
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: true,
      message: "Confirmation email sent",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid Credentials" };
        case "AuthorizedCallbackError":
          return { success: false, message: "Check your email" };
        default:
          return { success: false, message: "An error has occurred" };
      }
    }

    throw error;
  }
};
