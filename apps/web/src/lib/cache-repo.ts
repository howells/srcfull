// apps/web/src/lib/cache-repo.ts
import { sql, type CacheEntry } from './db';

export async function getCached(originalUrl: string): Promise<string | null> {
  const [entry] = await sql<CacheEntry[]>`
    SELECT resolved_url FROM cache
    WHERE original_url = ${originalUrl}
    AND expires_at > NOW()
  `;
  return entry?.resolved_url ?? null;
}

export async function setCache(
  originalUrl: string,
  resolvedUrl: string,
  patternId?: number
): Promise<void> {
  await sql`
    INSERT INTO cache (original_url, resolved_url, pattern_id)
    VALUES (${originalUrl}, ${resolvedUrl}, ${patternId ?? null})
    ON CONFLICT (original_url)
    DO UPDATE SET
      resolved_url = ${resolvedUrl},
      pattern_id = ${patternId ?? null},
      resolved_at = NOW(),
      expires_at = NOW() + INTERVAL '7 days'
  `;
}

export async function clearExpiredCache(): Promise<number> {
  const result = await sql`
    DELETE FROM cache WHERE expires_at < NOW()
  `;
  return result.count;
}
