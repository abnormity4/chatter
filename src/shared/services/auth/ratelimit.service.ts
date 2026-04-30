import redis from '@/lib/redis';
import { RateExceededError, ErrorCodes } from '@/src/shared/exceptions/root';

export const AUTH_RATELIMIT_TTL = 60;
export const AUTH_RATELIMIT_MAX_REQUESTS = 10;

export const rateLimitByIp = async (
  ip: string | null,
  maxRequests: number = AUTH_RATELIMIT_MAX_REQUESTS,
) => {
  if (!ip) return;

  const rateLimitKey = `ratelimit:ip:${ip}`;
  const blockKey = `ratelimit:block:${ip}`;

  const isBlocked = await redis.get(blockKey);

  if (isBlocked === '1') {
    throw new RateExceededError(
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      'Too many requests. Please try again later.',
    );
  }

  const currentCount = await redis.incr(rateLimitKey);

  if (currentCount === 1) {
    await redis.expire(rateLimitKey, AUTH_RATELIMIT_TTL);
  }

  if (currentCount >= maxRequests) {
    await redis.setEx(blockKey, AUTH_RATELIMIT_TTL, '1');
    await redis.expire(rateLimitKey, AUTH_RATELIMIT_TTL);
  }
};

//TODO: change to sliding window algorithm
