"use server";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import bcryptjs from "bcryptjs";
import * as z from "zod";

import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import {
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from "@/lib/resend/mail";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import prisma from "@/lib/db/prisma";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  // Check some entries
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid fields",
      twoFactor: null,
    };
  }
  // Check if user exists with email
  const { email, password, code } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      success: false,
      message: "Email does not exist",
      twoFactor: null,
    };
  }

  const comparePassword = await bcryptjs.compare(
    password,
    existingUser.password
  );

  if (!comparePassword) {
    return {
      success: false,
      message: "Invalid password",
      twoFactor: null,
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
      twoFactor: null,
    };
  }

  // Generate new token if user has not verified 2FA
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    console.log(code);
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      console.log("🚀 ~ twoFactorToken:", twoFactorToken);
      if (!twoFactorToken) {
        return {
          success: false,
          message: "Invalid code",
          twoFactor: null,
        };
      }

      if (twoFactorToken.token !== code) {
        return {
          success: false,
          message: "Invalid code",
          twoFactor: null,
        };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return {
          success: false,
          message: "Code has expired",
          twoFactor: null,
        };
      }

      await prisma.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactoToken = await generateTwoFactorToken(existingUser.email);
      // Send two-factor email  for verification
      await sendTwoFactorTokenEmail(twoFactoToken.email, twoFactoToken.token);

      return {
        success: null,
        message: null,
        twoFactor: true,
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid Credentials",
            twoFactor: null,
          };
        case "AuthorizedCallbackError":
          return {
            success: false,
            message: "Check your email",
            twoFactor: null,
          };
        default:
          return {
            success: false,
            message: "An error has occurred",
            twoFactor: null,
          };
      }
    }

    throw error;
  }
};
