import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { users, type User } from '@/db/schema';

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (!sessionId) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, sessionId))
    .limit(1);

  return user ?? null;
}

export async function requireSession(): Promise<User> {
  const user = await getSession();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
