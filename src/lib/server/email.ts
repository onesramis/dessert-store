import { RESEND_API_KEY, RESEND_EMAIL_FROM } from "$env/static/private";
import { Resend } from "resend";
import type { User } from "better-auth";

const resend = new Resend(RESEND_API_KEY);

export const sendResetPassword = async ({
  user,
  url,
}: {
  user: User;
  token: string;
  url: string;
}) => {
  await resend.emails.send({
    from: RESEND_EMAIL_FROM,
    to: user.email,
    subject: "Reset your password",
    text: `Click the link to reset your password: ${url}`,
  });
};

export const sendVerificationEmail = async ({
  user,
  url,
}: {
  user: User;
  token: string;
  url: string;
}) => {
  await resend.emails.send({
    from: RESEND_EMAIL_FROM,
    to: user.email,
    subject: "Verify your email",
    text: `Click the link to verify your email: ${url}`,
  });
};
