import { cookies } from 'next/headers';
import redis from '../lib/redis';

export type SessionData = {
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
};

const SESSION_NAME = 'session';
const SESSION_TTL = 60 * 60 * 24 * 7;

export const redisController = {
  createSession: async ({
    ipAddress,
    userAgent,
    userId,
    generatedToken,
  }: SessionData & { generatedToken: string }) => {
    await redis
      .multi()
      .hSet(`session:${generatedToken}`, {
        ip: ipAddress ?? '',
        userAgent: userAgent ?? '',
        userId: userId,
        createdAt: Date.now().toString(),
      })
      .sAdd(`user_sessions:${userId}`, `session:${generatedToken}`)
      .expire(`session:${generatedToken}`, SESSION_TTL)
      .exec();
  },
  deleteSession: async (browserSessionToken: string, userId: string) => {
    await redis
      .multi()
      .del(`session:${browserSessionToken}`)
      .sRem(`user_sessions:${userId}`, `session:${browserSessionToken}`)
      .exec();
  },
};

export const setCookie = async (sessionToken: string) => {
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_NAME,
    value: sessionToken,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_TTL,
  });
};

export const getCookie = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_NAME);

  return sessionToken?.value;
};
