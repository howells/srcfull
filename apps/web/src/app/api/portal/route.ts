import { CustomerPortal } from "@polar-sh/nextjs";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { requireEnv } from "@/lib/env";
import { getApiSession } from "@/lib/session";

async function getCustomerId(_req: NextRequest): Promise<string> {
  const userId = await getApiSession();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user?.polarCustomerId) {
    throw new Error("No Polar customer ID");
  }

  return user.polarCustomerId;
}

export const GET = CustomerPortal({
  accessToken: requireEnv("POLAR_ACCESS_TOKEN"),
  getCustomerId,
  returnUrl: "/dashboard",
  server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});
