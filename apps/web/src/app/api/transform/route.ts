// apps/web/src/app/api/transform/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { resolve } from "@/lib/resolver";
import { requireSession } from "@/lib/session";

const TransformRequestSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const user = await requireSession();
    const { has } = await auth();
    if (user.plan !== "pro" && !(has && has({ feature: "pro" }))) {
      return NextResponse.json(
        { error: "Subscription required", code: "PAYMENT_REQUIRED" },
        { status: 402 }
      );
    }

    const body = await request.json();
    const { url } = TransformRequestSchema.parse(body);

    const result = await resolve(url);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid URL", code: "INVALID_URL" },
        { status: 400 }
      );
    }

    console.error("Transform error:", error);
    return NextResponse.json(
      { error: "Failed to transform URL", code: "TRANSFORM_FAILED" },
      { status: 500 }
    );
  }
}
