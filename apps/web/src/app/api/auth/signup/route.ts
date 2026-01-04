import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { polar } from '@/lib/polar';

const SignupSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = SignupSchema.parse(body);

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      // User exists - set session and return
      const cookieStore = await cookies();
      cookieStore.set('session', existingUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return NextResponse.json({ success: true });
    }

    // Create Polar customer
    const customer = await polar.customers.create({ email, name });

    // Create user in database
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name,
        polarCustomerId: customer.id,
      })
      .returning();

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Signup failed', code: 'SIGNUP_FAILED' },
      { status: 500 }
    );
  }
}
