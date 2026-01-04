import { eq, sql, and, gte } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { apiKeys, usageLogs } from '@/db/schema';
import { requireSession } from '@/lib/session';

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

    const keyIds = keys.map(k => k.id);
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total requests
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(usageLogs)
      .where(sql`${usageLogs.apiKeyId} = ANY(${keyIds})`);

    // Get last 24 hours
    const [last24Result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(usageLogs)
      .where(
        and(
          sql`${usageLogs.apiKeyId} = ANY(${keyIds})`,
          gte(usageLogs.createdAt, oneDayAgo)
        )
      );

    // Get last 7 days
    const [last7Result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(usageLogs)
      .where(
        and(
          sql`${usageLogs.apiKeyId} = ANY(${keyIds})`,
          gte(usageLogs.createdAt, sevenDaysAgo)
        )
      );

    // Get by endpoint
    const byEndpoint = await db
      .select({
        endpoint: usageLogs.endpoint,
        count: sql<number>`count(*)`,
      })
      .from(usageLogs)
      .where(sql`${usageLogs.apiKeyId} = ANY(${keyIds})`)
      .groupBy(usageLogs.endpoint);

    return NextResponse.json({
      totalRequests: Number(totalResult?.count ?? 0),
      last24Hours: Number(last24Result?.count ?? 0),
      last7Days: Number(last7Result?.count ?? 0),
      byEndpoint: Object.fromEntries(
        byEndpoint.map(e => [e.endpoint, Number(e.count)])
      ),
    });
  } catch {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }
}
