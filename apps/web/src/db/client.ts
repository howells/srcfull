import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { apiKeys, cache, patterns, usageLogs, users } from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(connectionString);
const schema = { apiKeys, cache, patterns, usageLogs, users };
export const db = drizzle(sql, { schema });
