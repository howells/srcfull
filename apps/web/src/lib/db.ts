// apps/web/src/lib/db.ts
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export type Pattern = {
  id: number;
  domain: string;
  match_regex: string;
  transform: string;
  confidence: number;
  successes: number;
  failures: number;
  created_at: Date;
  last_used_at: Date;
};

export type CacheEntry = {
  original_url: string;
  resolved_url: string;
  pattern_id: number | null;
  resolved_at: Date;
  expires_at: Date;
};
