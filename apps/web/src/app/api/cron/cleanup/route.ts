import { lt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { cache } from "@/db/schema";

// Verify cron secret to prevent unauthorized access
function verifyCronSecret(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // If no secret configured, allow in development
  if (!cronSecret) {
    return process.env.NODE_ENV === "development";
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    // Delete expired cache entries
    const result = await db
      .delete(cache)
      .where(lt(cache.expiresAt, now))
      .returning({ url: cache.originalUrl });

    const deletedCount = result.length;

    console.log(`Cache cleanup: deleted ${deletedCount} expired entries`);

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Cache cleanup error:", error);
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 }
    );
  }
}
