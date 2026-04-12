import type { SessionData } from './session';
import { redisController, setCookie, getCookie } from './session';

export const createSession = async ({
  ipAddress,
  userAgent,
  userId,
}: SessionData) => {
  const generatedToken = crypto.randomUUID();

  const browserSessionToken = await getCookie();

  if (browserSessionToken) {
    await redisController.deleteSession(browserSessionToken, userId);
  }

  await setCookie(generatedToken);

  await redisController.createSession({
    ipAddress,
    userAgent,
    userId,
    generatedToken,
  });
};