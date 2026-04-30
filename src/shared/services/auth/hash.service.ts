import { AuthError, ErrorCodes } from '@/src/shared/exceptions/root';
import bcrypt from 'bcryptjs';

export const compareHash = async (
  providedPassword: string,
  storedHash: string,
) => {
  const isMatch = await bcrypt.compare(providedPassword, storedHash);

  if (!isMatch) {
    throw new AuthError(
      ErrorCodes.INVALID_CREDENTIALS,
      'Invalid email or password.',
    );
  }
};

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};
