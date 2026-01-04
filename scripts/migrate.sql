-- scripts/migrate.sql

-- Learned URL patterns
CREATE TABLE IF NOT EXISTS patterns (
  id SERIAL PRIMARY KEY,
  domain TEXT NOT NULL,
  match_regex TEXT NOT NULL,
  transform TEXT NOT NULL,
  confidence REAL DEFAULT 0.5,
  successes INT DEFAULT 1,
  failures INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(domain, match_regex)
);

-- URL resolution cache
CREATE TABLE IF NOT EXISTS cache (
  original_url TEXT PRIMARY KEY,
  resolved_url TEXT NOT NULL,
  pattern_id INT REFERENCES patterns(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patterns_domain ON patterns(domain);
CREATE INDEX IF NOT EXISTS idx_patterns_confidence ON patterns(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON cache(expires_at);
