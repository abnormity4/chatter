'use server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { emailSchema, passwordSchema } from '@/lib/zodschemas';
import bcrypt from 'bcryptjs';
import { Prisma } from '@/prisma/generated/prisma/client';
import { AuthError, ErrorCodes } from '@/exceptions/root';

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
  console.log(validationResult);

  if (!validationResult.success) {
    throw new AuthError(
      ErrorCodes.REGISTRATION_INVALID_CREDENTIALS,
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
  try {
    const user = await attemptCreateUser(form);
    if (user) return { success: true, message: 'User created successfully.' };
  } catch (e) {
    if (e instanceof AuthError) return { success: false, message: e.message };

    return {
      success: false,
      message: 'An unexpected error occurred during registration.',
    };
  }
};

export const checkEmailAvailability = async (email: string) => {
  return prisma.user.findUnique({
    where: { email: email },
    select: { email: true },
  });
};
