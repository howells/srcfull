import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { type ApiKey, apiKeys, usageLogs, users } from "@/db/schema";
import { verifyApiKey } from "./api-keys";
import { getPolarClient } from "./polar";

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

  // Verify against each candidate
  for (const candidate of candidates) {
    if (await verifyApiKey(key, candidate.api_keys.keyHash)) {
      if (candidate.users.plan !== "pro") {
        return null;
      }

      // Update last used timestamp
      await db
        .update(apiKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKeys.id, candidate.api_keys.id));

      return candidate.api_keys as ApiKey;
    }
  }

  return null;
}

export async function logUsage(
  apiKeyId: string,
  endpoint: string,
  statusCode: number,
  responseTimeMs: number
): Promise<void> {
  try {
    // Log to local database
    await db.insert(usageLogs).values({
      apiKeyId,
      endpoint,
      statusCode,
      responseTimeMs,
    });

    // Send meter event to Polar for successful requests
    if (statusCode === 200) {
      const [keyWithUser] = await db
        .select({ polarCustomerId: users.polarCustomerId })
        .from(apiKeys)
        .innerJoin(users, eq(apiKeys.userId, users.id))
        .where(eq(apiKeys.id, apiKeyId))
        .limit(1);

      if (keyWithUser?.polarCustomerId) {
        const eventName =
          endpoint === "/v1/scrape" ? "api_scrape" : "api_transform";
        await getPolarClient().events.ingest({
          events: [
            {
              name: eventName,
              externalCustomerId: keyWithUser.polarCustomerId,
              metadata: {
                endpoint,
                responseTimeMs,
              },
            },
          ],
        });
      }
    }
  } catch {
    // Logging failure shouldn't break the request
  }
}
