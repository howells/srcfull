import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const patterns = pgTable(
  "patterns",
  {
    id: serial("id").primaryKey(),
    domain: text("domain").notNull(),
    matchRegex: text("match_regex").notNull(),
    transform: text("transform").notNull(),
    confidence: real("confidence").default(0.5).notNull(),
    successes: integer("successes").default(1).notNull(),
    failures: integer("failures").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique().on(table.domain, table.matchRegex)]
);

export const cache = pgTable("cache", {
  originalUrl: text("original_url").primaryKey(),
  resolvedUrl: text("resolved_url").notNull(),
  patternId: integer("pattern_id").references(() => patterns.id, {
    onDelete: "set null",
  }),
  resolvedAt: timestamp("resolved_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true })
    .$defaultFn(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    .notNull(),
});

export type Pattern = InferSelectModel<typeof patterns>;
export type NewPattern = InferInsertModel<typeof patterns>;
export type CacheEntry = InferSelectModel<typeof cache>;
export type NewCacheEntry = InferInsertModel<typeof cache>;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  polarCustomerId: text("polar_customer_id").unique(),
  polarSubscriptionId: text("polar_subscription_id").unique(),
  plan: text("plan", { enum: ["free", "pro"] })
    .notNull()
    .default("free"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  keyHash: text("key_hash").notNull(),
  keyPrefix: text("key_prefix").notNull(),
  name: text("name").notNull().default("Default"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
});

export const usageLogs = pgTable("usage_logs", {
  id: serial("id").primaryKey(),
  apiKeyId: uuid("api_key_id")
    .notNull()
    .references(() => apiKeys.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  statusCode: integer("status_code").notNull(),
  responseTimeMs: integer("response_time_ms").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type ApiKey = InferSelectModel<typeof apiKeys>;
export type NewApiKey = InferInsertModel<typeof apiKeys>;
export type UsageLog = InferSelectModel<typeof usageLogs>;
export type NewUsageLog = InferInsertModel<typeof usageLogs>;
