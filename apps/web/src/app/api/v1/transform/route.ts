import { z } from "zod";
import { logUsage, validateApiKey } from "@/lib/api-auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { resolve } from "@/lib/resolver";
import { validateUrl } from "@/lib/url-validator";

const TransformRequestSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: Request) {
  const startTime = Date.now();

  // Validate API key
  const apiKey = await validateApiKey(request);
  if (!apiKey) {
    return apiError("UNAUTHORIZED");
  }

  // Check rate limit (100 requests per minute per API key)
  const rateLimit = checkRateLimit(`api:${apiKey.id}`, 100, 60_000);
  if (!rateLimit.success) {
    return apiError("RATE_LIMITED", undefined, rateLimitHeaders(rateLimit));
  }

  try {
    const body = await request.json();
    const { url } = TransformRequestSchema.parse(body);

    // SSRF protection - validate URL before processing
    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      await logUsage(apiKey.id, "/v1/transform", 400, Date.now() - startTime);
      return apiError("INVALID_URL", urlValidation.error);
    }

    const result = await resolve(url);

    await logUsage(apiKey.id, "/v1/transform", 200, Date.now() - startTime);
    return apiSuccess({
      original: result.original,
      resolved: result.resolved,
      method: result.method,
      confidence: result.confidence ?? null,
      sizeIncrease: result.sizeIncrease ?? null,
      durationMs: Date.now() - startTime,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      await logUsage(apiKey.id, "/v1/transform", 400, Date.now() - startTime);
      return apiError("INVALID_URL");
    }

    console.error("Transform error:", error);
    await logUsage(apiKey.id, "/v1/transform", 500, Date.now() - startTime);
    return apiError("TRANSFORM_FAILED");
  }
}
