import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { type User, users } from "@/db/schema";

export async function getSession(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  // Look up by clerkUserId first
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, userId))
    .limit(1);

  if (existing) {
    return existing;
  }

  // Auto-link existing user by email on first Clerk sign-in
  const clerkUser = await currentUser();
  if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
    return null;
  }

  const email = clerkUser.emailAddresses[0].emailAddress;
  const [byEmail] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (byEmail) {
    // Link Clerk ID to existing user
    const [updated] = await db
      .update(users)
      .set({ clerkUserId: userId })
      .where(eq(users.id, byEmail.id))
      .returning();
    return updated ?? null;
  }

  // Create new user
  const [created] = await db
    .insert(users)
    .values({
      clerkUserId: userId,
      email,
      name: clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
        : undefined,
    })
    .returning();

  return created ?? null;
}

export async function requireSession(): Promise<User> {
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
