import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { type ApiKey, apiKeys, usageLogs, users } from "@/db/schema";
import { verifyApiKey } from "./api-keys";

// Dummy hash for constant-time comparison when no candidates found
// This prevents timing attacks that could reveal valid key prefixes
const DUMMY_HASH =
  "$2b$10$abcdefghijklmnopqrstuuxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

export async function validateApiKey(request: Request): Promise<ApiKey | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const key = authHeader.slice(7);
  if (!key.startsWith("sk_live_")) {
    return null;
  }

  // Find all keys with matching prefix
  const prefix = key.substring(0, 12);
  const candidates = await db
    .select()
    .from(apiKeys)
    .innerJoin(users, eq(apiKeys.userId, users.id))
    .where(eq(apiKeys.keyPrefix, prefix));

  // Always perform at least one hash comparison to prevent timing attacks
  // This ensures consistent response time regardless of whether prefix exists
  if (candidates.length === 0) {
    await verifyApiKey(key, DUMMY_HASH);
    return null;
  }

  // Verify against each candidate
  let validCandidate: (typeof candidates)[0] | null = null;

  for (const candidate of candidates) {
    const isValid = await verifyApiKey(key, candidate.api_keys.keyHash);
    if (isValid && !validCandidate) {
      validCandidate = candidate;
      // Don't break early - continue to maintain constant time for all candidates
    }
  }

  if (!validCandidate) {
    return null;
  }

  if (validCandidate.users.plan !== "pro") {
    return null;
  }

  // Update last used timestamp
  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, validCandidate.api_keys.id));

  return validCandidate.api_keys as ApiKey;
}

export async function logUsage(
  apiKeyId: string,
  endpoint: string,
  statusCode: number,
  responseTimeMs: number,
  options?: { usedStealthProxy?: boolean; targetDomain?: string; usedFirecrawl?: boolean }
): Promise<void> {
  try {
    await db.insert(usageLogs).values({
      apiKeyId,
      endpoint,
      statusCode,
      responseTimeMs,
      usedStealthProxy: options?.usedStealthProxy ?? false,
      targetDomain: options?.targetDomain,
      usedFirecrawl: options?.usedFirecrawl ?? false,
    });
  } catch {
    // Logging failure shouldn't break the request
  }
}
