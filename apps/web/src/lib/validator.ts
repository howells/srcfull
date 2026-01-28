// apps/web/src/lib/validator.ts
import { httpLimiter } from "./concurrency";

export type ValidationResult = {
  valid: boolean;
  contentType?: string;
  size?: number;
};

export async function validateImageUrl(url: string): Promise<ValidationResult> {
  // Use limiter to prevent too many concurrent outbound requests
  return httpLimiter(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method: "HEAD",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Beeline/2.0)",
          Accept: "image/*",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return { valid: false };
      }

      const contentType = response.headers.get("content-type") ?? "";
      const contentLength = response.headers.get("content-length");
      const size = contentLength ? Number.parseInt(contentLength, 10) : undefined;

      const isImage = contentType.startsWith("image/");

      return {
        valid: isImage,
        contentType: isImage ? contentType : undefined,
        size,
      };
    } catch {
      return { valid: false };
    }
  });
}
