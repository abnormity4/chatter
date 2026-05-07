import { AuthError, ErrorCodes } from '../../exceptions/root';
import { getCookie, setCookie } from './cookies.service';
import redis from '@/lib/redis';


export type SessionData = {
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
};

export const SESSION_NAME = 'session';
export const SESSION_TTL = 60 * 60 * 24 * 7;

const redisController = {
  createSession: async ({
    ipAddress,
    userAgent,
    userId,
    generatedToken,
  }: SessionData & { generatedToken: string }): Promise<void> => {
    await redis
      .multi()
      .hSet(`${SESSION_NAME}:${generatedToken}`, {
        ip: ipAddress ?? '',
        userAgent: userAgent ?? '',
        userId: userId,
        createdAt: Date.now().toString(),
      })
      .sAdd(`user_sessions:${userId}`, `${SESSION_NAME}:${generatedToken}`)
      .expire(`${SESSION_NAME}:${generatedToken}`, SESSION_TTL)
      .exec();
  },
  deleteSession: async (sessionCookie: string, userId: string): Promise<void> => {
    await redis
      .multi()
      .del(`${SESSION_NAME}:${sessionCookie}`)
      .sRem(`user_sessions:${userId}`, `${SESSION_NAME}:${sessionCookie}`)
      .exec();
  },
};

export const createSession = async ({
  ipAddress,
  userAgent,
  userId,
}: SessionData): Promise<void> => {
  const generatedToken = crypto.randomUUID();

  const sessionCookie = await getCookie(SESSION_NAME);

  if (sessionCookie) {
    await redisController.deleteSession(sessionCookie, userId);
  }

  await setCookie(SESSION_NAME, generatedToken, SESSION_TTL);

  await redisController.createSession({
    ipAddress,
    userAgent,
    userId,
    generatedToken,
  });
};

export const validateSession = async (): Promise<string> => {
  
  const sessionCookie = await getCookie(SESSION_NAME);

  if (!sessionCookie) throw new AuthError(ErrorCodes.SESSION_NOT_FOUND, 'Session not found');

  const userId = await redis.hGet(`session:${sessionCookie}`, 'userId');

  if (!userId) throw new AuthError(ErrorCodes.SESSION_NOT_FOUND, 'Session not found');

  return userId
}

