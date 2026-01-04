// apps/web/src/lib/patterns-repo.ts
import { sql, type Pattern } from './db';

export async function findPatternByDomain(domain: string): Promise<Pattern[]> {
  return sql<Pattern[]>`
    SELECT * FROM patterns
    WHERE domain = ${domain}
    ORDER BY confidence DESC
  `;
}

export async function savePattern(
  domain: string,
  matchRegex: string,
  transform: string
): Promise<Pattern> {
  const [pattern] = await sql<Pattern[]>`
    INSERT INTO patterns (domain, match_regex, transform)
    VALUES (${domain}, ${matchRegex}, ${transform})
    ON CONFLICT (domain, match_regex)
    DO UPDATE SET successes = patterns.successes + 1, last_used_at = NOW()
    RETURNING *
  `;
  return pattern;
}

export async function incrementSuccess(patternId: number): Promise<void> {
  await sql`
    UPDATE patterns
    SET
      successes = successes + 1,
      confidence = LEAST(confidence + 0.1, 0.99),
      last_used_at = NOW()
    WHERE id = ${patternId}
  `;
}

export async function incrementFailure(patternId: number): Promise<void> {
  await sql`
    UPDATE patterns
    SET
      failures = failures + 1,
      confidence = confidence - 0.2
    WHERE id = ${patternId}
  `;

  // Delete low-confidence patterns
  await sql`DELETE FROM patterns WHERE confidence < 0.2`;
}
