import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { AuthError, RateExceededError } from '@/src/shared/exceptions/root';
import { rateLimitByIp } from '@/src/shared/services/auth/ratelimit.service';
import { isAuthFormValid } from '@/src/(root)/schemas';
import { compareHash } from '@/src/shared/services/auth/hash.service';
import { createSession } from '@/src/shared/services/auth/session.service';

export const POST = async (request: NextRequest) => {
  const ip = request.headers.get('x-forwarded-for');
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  try {
    await rateLimitByIp(ip);
  } catch (err) {
    if (err instanceof RateExceededError) {
      return NextResponse.json(
        { success: false, message: 'Rate limit exceeded.' },
        { status: 429 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request.',
      },
      { status: 500 },
    );
  }

  const { email, password } = await request.json();

  if (!isAuthFormValid({ email, password })) {
    return NextResponse.json(
      {
        success: false,
        message:
          'Invalid email or password. Make sure your email and password meet the required format.',
      },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { password: true, id: true },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Invalid credentials.' },
      { status: 401 },
    );
  }

  try {
    await compareHash(password, user.password);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' },
        { status: 401 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request.',
      },
      { status: 500 },
    );
  }

  await createSession({ ipAddress: ip, userAgent, userId: user.id });

  return NextResponse.json(
    { success: true, message: 'Login successful.' },
    { status: 200 },
  );
};
