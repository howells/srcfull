import { NextResponse } from "next/server";
import { z } from "zod";
import { logUsage, validateApiKey } from "@/lib/api-auth";
import { resolve } from "@/lib/resolver";

const TransformRequestSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: Request) {
  const startTime = Date.now();

  // Validate API key
  const apiKey = await validateApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Invalid or missing API key" },
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { url } = TransformRequestSchema.parse(body);

    const result = await resolve(url);

    const response = NextResponse.json({
      success: true,
      original: result.original,
      resolved: result.resolved,
      method: result.method,
      confidence: result.confidence ?? null,
      sizeIncrease: result.sizeIncrease ?? null,
      durationMs: Date.now() - startTime,
    });

    await logUsage(apiKey.id, "/v1/transform", 200, Date.now() - startTime);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_URL",
            message: "The provided URL is not valid",
          },
        },
        { status: 400 }
      );
      await logUsage(apiKey.id, "/v1/transform", 400, Date.now() - startTime);
      return response;
    }

    console.error("Transform error:", error);
    const response = NextResponse.json(
      {
        success: false,
        error: { code: "TRANSFORM_FAILED", message: "Failed to transform URL" },
      },
      { status: 500 }
    );
    await logUsage(apiKey.id, "/v1/transform", 500, Date.now() - startTime);
    return response;
  }
}
