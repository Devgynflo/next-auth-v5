import { Resend } from "resend";

// Template
import { ResetPasswordEmail } from "@/components/mail/reset-password";
import { VerifyEmailAddress } from "@/components/mail/verify-email-address";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    react: VerifyEmailAddress({ confirmLink }),
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.BASE_URL}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    react: ResetPasswordEmail({
      resetPasswordLink: confirmLink,
      userEmail: email,
    }),
  });
};