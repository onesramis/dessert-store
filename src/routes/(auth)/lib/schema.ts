import { z } from "zod";

import { m } from "$lib/paraglide/messages";

export const registerSchema = z.object({
  email: z.string().email({ message: m["forms.errors.email.invalid"]() }).trim(),
  password: z
    .string()
    .min(8, { message: m["forms.errors.password.min-8"]() })
    .regex(/[a-zA-Z]/, { message: m["forms.errors.password.contains-letter"]() })
    .regex(/[0-9]/, { message: m["forms.errors.password.contains-number"]() })
    .regex(/[^a-zA-Z0-9]/, {
      message: m["forms.errors.password.contains-special"](),
    }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: m["forms.errors.password.min-8"]() }).trim(),
  password: z.string().min(1, { message: m["forms.errors.password.required"]() }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: m["forms.errors.email.invalid"]() }).trim(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().nullable(),
    password: z
      .string()
      .min(8, { message: m["forms.errors.password.min-8"]() })
      .regex(/[a-zA-Z]/, { message: m["forms.errors.password.contains-letter"]() })
      .regex(/[0-9]/, { message: m["forms.errors.password.contains-number"]() })
      .regex(/[^a-zA-Z0-9]/, {
        message: m["forms.errors.password.contains-special"](),
      }),
    passwordConfirm: z.string(),
  })
  .refine((arg) => arg.password === arg.passwordConfirm, {
    message: m["forms.errors.password-mismatch"](),
    path: ["passwordConfirm"],
  });

export type RegisterSchema = typeof registerSchema;
export type LoginSchema = typeof loginSchema;
export type ForgotPasswordSchema = typeof forgotPasswordSchema;
export type ResetPasswordSchema = typeof resetPasswordSchema;
