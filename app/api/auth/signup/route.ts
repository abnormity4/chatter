import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { RateExceededError } from '@/exceptions/root';
import { rateLimitByIp } from '@/service/ratelimit.service';
import { isAuthFormValid } from '@/app/schemas';
import { createSession } from '@/service/session.service';
import { hashPassword } from '@/service/hash.service';
import { Prisma } from '@/prisma/generated/prisma/client';

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

  const hashedPassword = await hashPassword(password);
  const displayName = email.split('@')[0];

  let newUserId;

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        displayName,
      },
    });
    newUserId = newUser.id;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return NextResponse.json(
        { success: false, message: 'Email already in use.' },
        { status: 409 },
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

  await createSession({ ipAddress: ip, userAgent, userId: newUserId });

  return NextResponse.json(
    { success: true, message: `Signup successful.` },
    { status: 201 },
  );
};
