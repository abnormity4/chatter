import { form } from 'motion/react-client';
import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;

export const emailSchema = z
  .string()
  .transform((s) => s.trim().toLowerCase().normalize('NFKC'))
  .pipe(z.email());

export const passwordSchema = z
  .string()
  .transform((s) => s.normalize('NFKC'))
  .pipe(
    z
      .string()
      .min(PASSWORD_MIN_LENGTH, 'invalid_length')
      .max(PASSWORD_MAX_LENGTH, 'invalid_length')
      .refine((s) => new Set(s).size > 1, {
        message: 'not_enough_unique_characters',
      }),
  );

export const isEmailValid = (email: string) => {
  const result = emailSchema.safeParse(email);
  if (!result.success) {
    return false;
  }
  return true;
};

export const isAuthFormValid = (form: { email: string; password: string }) => {
  const userSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

  const result = userSchema.safeParse(form);
  if (!result.success) {
    return false;
  }
  return true;
};
