import { tool } from 'ai';
import { z } from 'zod';
import type { ToolResult } from './types';

export const findSourceUrl = tool({
  description: 'Generates candidate source URLs by trying different strategies',
  parameters: z.object({
    url: z.string().url().describe('The image URL to find source for'),
    srcset: z.array(z.string()).optional().describe('Optional srcset URLs to try'),
  }),
  execute: async ({ url, srcset }): Promise<ToolResult<string[]>> => {
    try {
      const candidates: string[] = [];

      // Strategy 1: Try largest srcset variant
      if (srcset && srcset.length > 0) {
        // Assume last in srcset is largest
        candidates.push(srcset[srcset.length - 1]);
      }

      // Strategy 2: Strip common resizing query parameters
      const urlObj = new URL(url);
      const resizingParams = [
        'w', 'h', 'width', 'height',
        'resize', 'size', 'quality', 'q',
        'fit', 'crop', 'auto', 'fm', 'format',
        'dpr', 'scale'
      ];

      resizingParams.forEach(param => {
        urlObj.searchParams.delete(param);
      });

      const strippedUrl = urlObj.toString();
      if (strippedUrl !== url) {
        candidates.push(strippedUrl);
      }

      // Strategy 3: Remove all query parameters
      const noQueryUrl = url.split('?')[0];
      if (noQueryUrl !== url && !candidates.includes(noQueryUrl)) {
        candidates.push(noQueryUrl);
      }

      // Strategy 4: Try removing size suffixes from filename
      const sizePatterns = [
        /-\d+x\d+(\.\w+)$/,  // -800x600.jpg
        /_\d+x\d+(\.\w+)$/,  // _800x600.jpg
        /-(?:small|medium|large|thumb|thumbnail)(\.\w+)$/,
      ];

      sizePatterns.forEach(pattern => {
        const match = url.match(pattern);
        if (match) {
          const cleaned = url.replace(pattern, match[1]);
          if (!candidates.includes(cleaned)) {
            candidates.push(cleaned);
          }
        }
      });

      // Always include original URL as fallback
      if (!candidates.includes(url)) {
        candidates.push(url);
      }

      return {
        success: true,
        data: candidates,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to find source URL: ${message}`,
      };
    }
  },
});
