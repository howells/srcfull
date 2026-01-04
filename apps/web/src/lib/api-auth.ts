import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { apiKeys, usageLogs, type ApiKey } from '@/db/schema';
import { verifyApiKey } from './api-keys';

export async function validateApiKey(request: Request): Promise<ApiKey | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const key = authHeader.slice(7);
  if (!key.startsWith('sk_live_')) {
    return null;
  }

  // Find all keys with matching prefix
  const prefix = key.substring(0, 12);
  const candidates = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.keyPrefix, prefix));

  // Verify against each candidate
  for (const candidate of candidates) {
    if (await verifyApiKey(key, candidate.keyHash)) {
      // Update last used timestamp
      await db
        .update(apiKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKeys.id, candidate.id));

      return candidate;
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
    await db.insert(usageLogs).values({
      apiKeyId,
      endpoint,
      statusCode,
      responseTimeMs,
    });
  } catch {
    // Logging failure shouldn't break the request
  }
}
