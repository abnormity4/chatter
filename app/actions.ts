'use server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { emailSchema, passwordSchema } from '@/lib/zodschemas';
import bcrypt from 'bcryptjs';
import { Prisma } from '@/prisma/generated/prisma/client';
import { AuthError, ErrorCodes, RateExceededError } from '@/exceptions/root';
import { headers } from 'next/headers';
import { rateLimitByIp } from '@/lib/auth/ratelimit';
import { createSessionCookie } from '@/lib/auth/sessions';
import { redirect } from 'next/navigation';

type AuthForm = {
  email: string;
  password: string;
};

const validateCreateUserForm = (form: AuthForm) => {
  const userSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

  const validationResult = userSchema.safeParse(form);

  if (!validationResult.success) {
    throw new AuthError(
      ErrorCodes.VALIDATION_ERROR,
      'Failed to validate user credentials. Please ensure the email and password are correct.',
    );
  }

  return validationResult;
};

const attemptCreateUser = async (form: AuthForm) => {
  const userCredentials = validateCreateUserForm(form);

  const hash = await bcrypt.hash(userCredentials.data.password, 10);
  const displayName = userCredentials.data.email.split('@')[0];

  try {
    await prisma.user.create({
      data: {
        email: userCredentials.data.email,
        password: hash,
        displayName: displayName,
      },
    });
    return true;
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      throw new AuthError(
        ErrorCodes.USER_ALREADY_EXISTS,
        'A user with this email already exists.',
      );
    }
    throw e;
  }
};

export const createUser = async (form: AuthForm) => {
  const ipAddress = (await headers()).get('x-forwarded-for');

  try {
    await rateLimitByIp(ipAddress);
    await attemptCreateUser(form);
    await createSessionCookie();

    return { success: true, message: 'User created successfully.' };
  } catch (e) {
    if (e instanceof AuthError) return { success: false, message: e.message };
    if (e instanceof RateExceededError)
      return { success: false, message: e.message };
    return {
      success: false,
      message: 'An unexpected error occurred during registration.',
    };
  }
};

export const checkEmailAvailability = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: { email: true },
  });
};

const attemptLogIn = async (form: AuthForm) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: form.email },
      select: { password: true },
    });

    if (!user) {
      throw new AuthError(
        ErrorCodes.INVALID_CREDENTIALS,
        'Invalid email or password.',
      );
    }

    const passwordMatch = await bcrypt.compare(form.password, user.password);

    if (!passwordMatch) {
      throw new AuthError(
        ErrorCodes.INVALID_CREDENTIALS,
        'Invalid email or password.',
      );
    }
    return true;
  } catch (e) {
    throw e;
  }
};

export const logIn = async (form: AuthForm) => {
  try {
    await attemptLogIn(form);

    return { success: true, message: 'Logged in succesfully' };
  } catch (e) {
    if (e instanceof AuthError) {
      return { success: false, message: e.message };
    }

    return {
      success: false,
      message: 'An unexpected error occurred during login.',
    };
  }
};
