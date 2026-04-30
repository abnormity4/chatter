import { cookies } from 'next/headers';
import redis from '@/lib/redis';
import prisma from '@/lib/prisma';
import { USERAVATAR_DEFAULT_URL } from '@/src/onboarding/components/onboarding';
import { AuthError, ErrorCodes } from '@/src/shared/exceptions/root';

const getAuthenticatedUser = async () => {
  const cookieStore = await cookies();
  const sessionCookieValue = cookieStore.get('session')?.value;

  if (!sessionCookieValue) {
    throw new AuthError(
      ErrorCodes.SESSION_NOT_FOUND,
      'Session not found. Please log in',
    );
  }

  const redisUserId = await redis.hGet(
    `session:${sessionCookieValue}`,
    'userId',
  );

  if (!redisUserId) {
    throw new AuthError(
      ErrorCodes.SESSION_NOT_FOUND,
      'Session not found. Please log in',
    );
  }

  const prismaUser = await prisma.user.findUnique({
    where: { id: redisUserId },
    select: {
      id: true,
      displayName: true,
      avatar: true,
    },
  });

  if (!prismaUser) {
    throw new AuthError(
      ErrorCodes.USER_NOT_FOUND,
      'User not found. Please register',
    );
  }

  return {
    ...prismaUser,
    avatar: prismaUser?.avatar ? prismaUser.avatar : USERAVATAR_DEFAULT_URL,
  };
};

export default getAuthenticatedUser;
