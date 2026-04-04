'use server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { emailSchema, passwordSchema } from '@/lib/zodschemas';
import bcrypt from 'bcryptjs';
import { Prisma } from '@/prisma/generated/prisma/client';
import { redirect } from 'next/navigation';

export const createUser = async (form: { email: string; password: string }) => {
  const userSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

  const validationResult = userSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      success: false,
      message: 'Failed to validate request. Error: ' + validationResult.error,
    };
  }

  const hash = await bcrypt.hash(validationResult.data.password, 10);
  const displayName = validationResult.data.email.split('@')[0];

  try {
    await prisma.user.create({
      data: {
        email: validationResult.data.email,
        password: hash,
        displayName: displayName,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return {
          success: false,
          message: `User with email "${validationResult.data.email}" already exists.`,
        };
      }
    }
    return { success: false, message: e.message };
  }

  redirect('/onboarding');
};

export const checkEmailAvailability = async (email: string) => {
  return prisma.user.findUnique({
    where: { email: email },
    select: { email: true },
  });
};
