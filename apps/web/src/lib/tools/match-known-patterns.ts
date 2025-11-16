import { tool } from 'ai';
import { z } from 'zod';
import type { ToolResult } from './types';
import { loadPatterns } from '../utils/patterns';

export const matchKnownPatterns = tool({
  description: 'Checks if a URL matches known patterns and returns the clean source URL',
  parameters: z.object({
    url: z.string().url().describe('The image URL to check against known patterns'),
  }),
  execute: async ({ url }): Promise<ToolResult<string | null>> => {
    try {
      const patterns = loadPatterns();

      for (const [name, pattern] of Object.entries(patterns)) {
        // Skip generic pattern initially
        if (name === 'generic') continue;

        // Check if URL matches this pattern's domain
        if (!url.includes(pattern.domain)) continue;

        let cleanUrl = url;

        // Strip query parameters
        if (pattern.stripParams) {
          for (const param of pattern.stripParams) {
            const regex = new RegExp(param, 'g');
            cleanUrl = cleanUrl.replace(regex, '');
          }
          // Clean up leftover ? and & characters
          cleanUrl = cleanUrl
            .replace(/\?&/g, '?')
            .replace(/&&+/g, '&')
            .replace(/[?&]+$/g, '')
            .replace(/&+/g, '&');
        }

        // Strip suffixes from filename
        if (pattern.stripSuffixes) {
          for (const suffix of pattern.stripSuffixes) {
            const regex = new RegExp(suffix + '(\\.\\w+)$');
            cleanUrl = cleanUrl.replace(regex, '$1');
          }
        }

        // If we modified the URL, return it
        if (cleanUrl !== url) {
          return {
            success: true,
            data: cleanUrl,
          };
        }
      }

      // Try generic pattern as fallback
      const genericPattern = patterns.generic;
      if (genericPattern?.stripParams) {
        let cleanUrl = url;
        for (const param of genericPattern.stripParams) {
          const regex = new RegExp(`[?&]${param}`, 'g');
          cleanUrl = cleanUrl.replace(regex, '');
        }
        cleanUrl = cleanUrl
          .replace(/\?&/g, '?')
          .replace(/&&+/g, '&')
          .replace(/[?&]+$/g, '')
          .replace(/&+/g, '&');

        if (cleanUrl !== url) {
          return {
            success: true,
            data: cleanUrl,
          };
        }
      }

      // No pattern matched
      return {
        success: true,
        data: null,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to match patterns: ${message}`,
      };
    }
  },
});
