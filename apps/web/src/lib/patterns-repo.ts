import { desc, eq, lt, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { type Pattern, patterns } from "@/db/schema";

export function findPatternByDomain(domain: string): Promise<Pattern[]> {
  return db
    .select()
    .from(patterns)
    .where(eq(patterns.domain, domain))
    .orderBy(desc(patterns.confidence));
}

export async function savePattern(
  domain: string,
  matchRegex: string,
  transform: string
): Promise<Pattern> {
  const [pattern] = await db
    .insert(patterns)
    .values({ domain, matchRegex, transform })
    .onConflictDoUpdate({
      target: [patterns.domain, patterns.matchRegex],
      set: {
        successes: sql`${patterns.successes} + 1`,
        lastUsedAt: new Date(),
      },
    })
    .returning();

  if (!pattern) {
    throw new Error("Failed to save pattern");
  }
  return pattern;
}

export async function incrementSuccess(patternId: number): Promise<void> {
  await db
    .update(patterns)
    .set({
      successes: sql`${patterns.successes} + 1`,
      confidence: sql`LEAST(${patterns.confidence} + 0.1, 0.99)`,
      lastUsedAt: new Date(),
    })
    .where(eq(patterns.id, patternId));
}

export async function incrementFailure(patternId: number): Promise<void> {
  await db
    .update(patterns)
    .set({
      failures: sql`${patterns.failures} + 1`,
      confidence: sql`GREATEST(${patterns.confidence} - 0.2, 0)`,
    })
    .where(eq(patterns.id, patternId));

  // Delete low-confidence patterns
  await db.delete(patterns).where(lt(patterns.confidence, 0.2));
}
