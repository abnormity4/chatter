import { cookies } from 'next/headers';
import redis from '../redis';

const SESSION_NAME = 'session';
const SESSION_TTL = 60 * 60 * 24 * 7;

export const createSessionCookie = async () => {
  const cookieStore = await cookies();

  const sessionToken = crypto.randomUUID();

  cookieStore.set({
    name: SESSION_NAME,
    value: sessionToken,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_TTL,
  });

  await redis.setEx(`session:${sessionToken}`, SESSION_TTL, '1');
};

export const validateSession = async () => {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(SESSION_NAME);

  if (!sessionToken) {
    return false;
  }

  const sessionRedisKey = await redis.get(`session:${sessionToken.value}`);

  if (sessionRedisKey !== '1') {
    return false;
  }

  await redis.expire(`session:${sessionToken.value}`, SESSION_TTL);

  return true;
};
