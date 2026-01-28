import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();

  try {
    // Check database connectivity
    await db.execute(sql`SELECT 1`);
    const dbLatency = Date.now() - start;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          status: "up",
          latencyMs: dbLatency,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        checks: {
          database: {
            status: "down",
            error: error instanceof Error ? error.message : "Unknown error",
          },
        },
      },
      { status: 503 }
    );
  }
}
