import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db/client";
import { type User, users } from "@/db/schema";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateSessionFormat(sessionValue: string): string | null {
  if (sessionValue.startsWith("eyJ")) {
    return null;
  }

  if (!UUID_REGEX.test(sessionValue)) {
    return null;
  }

  return sessionValue;
}

export async function getApiSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session?.value) {
    return null;
  }

  const validSession = validateSessionFormat(session.value);
  if (!validSession) {
    cookieStore.delete("session");
    return null;
  }

  return validSession;
}

export async function getSession(): Promise<User | null> {
  const sessionId = await getApiSession();
  if (!sessionId) {
    return null;
  }

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
    throw new Error("Unauthorized");
  }
  return user;
}
