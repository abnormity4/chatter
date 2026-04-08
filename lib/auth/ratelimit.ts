import redis from '../redis';
import { AUTH_RATELIMIT_MAX_REQUESTS, AUTH_RATELIMIT_TTL } from '../constants';
import { RateExceededError, ErrorCodes } from '@/exceptions/root';

export const rateLimitByIp = async (ip: string | null) => {
  if (!ip) return;

  const rateLimitKey = `ratelimit:ip:${ip}`;
  const blockKey = `ratelimit:block:${ip}`;

  const isBlocked = await redis.get(blockKey);

  if (isBlocked === '1') {
    console.log('You are blocked from making requests for 15 minutes');
    throw new RateExceededError(
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      'Too many requests. Please try again later.',
    );
  }

  const currentCount = await redis.incr(rateLimitKey);

  if (currentCount >= AUTH_RATELIMIT_MAX_REQUESTS) {
    console.log('We will block you from now on for 15 minutes');
    await redis.setEx(blockKey, AUTH_RATELIMIT_TTL, '1');
    await redis.expire(rateLimitKey, AUTH_RATELIMIT_TTL);
  }
};
