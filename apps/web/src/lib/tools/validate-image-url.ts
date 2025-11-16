import { tool } from 'ai';
import { z } from 'zod';
import type { ToolResult } from './types';

export const validateImageUrl = tool({
  description: 'Validates that an image URL returns a 200 response',
  parameters: z.object({
    url: z.string().url().describe('The image URL to validate'),
  }),
  execute: async ({ url }): Promise<ToolResult<boolean>> => {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      });

      const isValid = response.ok && response.status === 200;

      return {
        success: true,
        data: isValid,
      };
    } catch (error) {
      // Network errors or invalid URLs
      return {
        success: true,
        data: false,
      };
    }
  },
});
