import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db/client";
import { apiKeys } from "@/db/schema";
import { generateApiKey, getKeyPrefix, hashApiKey } from "@/lib/api-keys";
import { requireSession } from "@/lib/session";

const CreateKeySchema = z.object({
  name: z.string().min(1).max(50).optional(),
});

export async function GET() {
  try {
    const user = await requireSession();

    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        createdAt: apiKeys.createdAt,
        lastUsedAt: apiKeys.lastUsedAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, user.id));

    return NextResponse.json({ keys });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSession();
    if (user.plan !== "pro") {
      return NextResponse.json(
        {
          error: "Subscription required",
          code: "PAYMENT_REQUIRED",
        },
        { status: 402 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { name } = CreateKeySchema.parse(body);

    const key = generateApiKey();
    const keyHash = await hashApiKey(key);
    const keyPrefix = getKeyPrefix(key);

    const [created] = await db
      .insert(apiKeys)
      .values({
        userId: user.id,
        keyHash,
        keyPrefix,
        name: name ?? "Default",
      })
      .returning();

    // Return the full key ONLY on creation
    return NextResponse.json({
      key,
      id: created.id,
      name: created.name,
      keyPrefix,
      createdAt: created.createdAt,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid name", code: "INVALID_NAME" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }
}
