import { NextRequest, NextResponse } from 'next/server';
import { isEmailValid } from '@/app/schemas';
import { rateLimitByIp } from '@/service/ratelimit.service';
import { RateExceededError } from '@/exceptions/root';
import prisma from '@/lib/prisma';

export const POST = async (request: NextRequest) => {
  const ip = request.headers.get('x-forwarded-for'); //TODO: research x-forwarded-for header

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

  const { email } = await request.json();

  if (!isEmailValid(email)) {
    return NextResponse.json(
      { success: false, message: 'Invalid email format.' },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { email: true },
  });

  if (user) {
    return NextResponse.json(
      {
        success: false,
        message: 'Email is already taken.',
      },
      { status: 409 },
    );
  }

  return NextResponse.json(
    { success: true, message: 'Email is available.' },
    { status: 200 },
  );
};
