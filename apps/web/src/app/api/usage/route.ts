import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { apiKeys, usageLogs } from "@/db/schema";
import { requireSession } from "@/lib/session";

export async function GET() {
  try {
    const user = await requireSession();

    // Get user's API keys
    const keys = await db
      .select({ id: apiKeys.id })
      .from(apiKeys)
      .where(eq(apiKeys.userId, user.id));

    if (keys.length === 0) {
      return NextResponse.json({
        totalRequests: 0,
        last24Hours: 0,
        last7Days: 0,
        byEndpoint: {},
      });
    }

    const keyIds = keys.map((k) => k.id);

    // Single query with conditional aggregation for all counts
    const [stats] = await db
      .select({
        total: sql<number>`count(*)`,
        last24Hours: sql<number>`count(*) filter (where ${usageLogs.createdAt} >= now() - interval '24 hours')`,
        last7Days: sql<number>`count(*) filter (where ${usageLogs.createdAt} >= now() - interval '7 days')`,
      })
      .from(usageLogs)
      .where(sql`${usageLogs.apiKeyId} = ANY(${keyIds})`);

    // Get by endpoint in single grouped query
    const byEndpoint = await db
      .select({
        endpoint: usageLogs.endpoint,
        count: sql<number>`count(*)`,
      })
      .from(usageLogs)
      .where(sql`${usageLogs.apiKeyId} = ANY(${keyIds})`)
      .groupBy(usageLogs.endpoint);

    return NextResponse.json({
      totalRequests: Number(stats?.total ?? 0),
      last24Hours: Number(stats?.last24Hours ?? 0),
      last7Days: Number(stats?.last7Days ?? 0),
      byEndpoint: Object.fromEntries(
        byEndpoint.map((e) => [e.endpoint, Number(e.count)])
      ),
    });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }
}
