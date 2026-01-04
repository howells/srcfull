import { tool } from 'ai';
import { z } from 'zod';

export const validateImageUrl = tool({
  description: 'Validates that an image URL returns a 200 response and is actually an image',
  parameters: z.object({
    url: z.string().url().describe('The image URL to validate'),
  }),
  execute: async ({ url }) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check if response is OK
      if (!response.ok) {
        return false;
      }

      // Check content-type to ensure it's actually an image
      const contentType = response.headers.get('content-type');
      const isImage = contentType?.startsWith('image/') || false;

      // Also check content-length to filter out tiny images (likely broken/placeholders)
      const contentLength = response.headers.get('content-length');
      const isTooSmall = contentLength && parseInt(contentLength) < 1000; // Less than 1KB

      const isValid = response.status === 200 && isImage && !isTooSmall;

      return isValid;
    } catch (error) {
      // Network errors, timeouts, or invalid URLs
      return false;
    }
  },
});
