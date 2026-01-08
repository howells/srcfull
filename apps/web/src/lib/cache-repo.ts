import { and, eq, gt, lt, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { cache } from "@/db/schema";

export async function getCached(originalUrl: string): Promise<string | null> {
  const [entry] = await db
    .select({ resolvedUrl: cache.resolvedUrl })
    .from(cache)
    .where(
      and(eq(cache.originalUrl, originalUrl), gt(cache.expiresAt, new Date()))
    );

  return entry?.resolvedUrl ?? null;
}

export async function setCache(
  originalUrl: string,
  resolvedUrl: string,
  patternId?: number
): Promise<void> {
  await db
    .insert(cache)
    .values({
      originalUrl,
      resolvedUrl,
      patternId: patternId ?? null,
    })
    .onConflictDoUpdate({
      target: cache.originalUrl,
      set: {
        resolvedUrl,
        patternId: patternId ?? null,
        resolvedAt: new Date(),
        expiresAt: sql`NOW() + INTERVAL '7 days'`,
      },
    });
}

export async function clearExpiredCache(): Promise<number> {
  const result = await db.delete(cache).where(lt(cache.expiresAt, new Date()));
  return result.rowCount ?? 0;
}
