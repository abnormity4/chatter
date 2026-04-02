import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '@/lib/constants';
import { z } from 'zod';

export const usernameSchema = z
  .string()
  .min(USERNAME_MIN_LENGTH, 'invalid_length')
  .max(USERNAME_MAX_LENGTH, 'invalid_length');

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
