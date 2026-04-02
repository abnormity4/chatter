import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '@/lib/constants';
import { z } from 'zod';

export const usernameSchema = z
  .string()
  .min(USERNAME_MIN_LENGTH, 'too_short')
  .max(USERNAME_MAX_LENGTH, 'too_long');

export const emailSchema = z
  .string()
  .transform((s) => s.trim().toLowerCase().normalize('NFKC'))
  .pipe(z.email('not_an_valid_email'));

export const passwordSchema = z
  .string()
  .transform((s) => s.normalize('NFKC'))
  .pipe(
    z
      .string()
      .min(8, 'too_short')
      .max(64, 'too_long')
      .refine((s) => new Set(s).size > 1, { message: 'more_unique_symbols' }),
  );
