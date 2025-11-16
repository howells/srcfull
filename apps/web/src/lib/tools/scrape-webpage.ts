import scrapingbee from 'scrapingbee';
import { tool } from 'ai';
import { z } from 'zod';
import type { ToolResult } from './types';

const client = new scrapingbee.ScrapingBeeClient(
  process.env.SCRAPINGBEE_API_KEY!
);

export const scrapeWebpage = tool({
  description: 'Scrapes a webpage and returns its HTML content using ScrapingBee',
  parameters: z.object({
    url: z.string().url().describe('The URL to scrape'),
  }),
  execute: async ({ url }): Promise<ToolResult<string>> => {
    try {
      const response = await client.get({
        url,
        params: {
          render_js: true,
          wait: 2000,
          block_resources: false,
        },
      });

      const html = response.data.toString();

      if (!html || html.length === 0) {
        return {
          success: false,
          error: 'Received empty response from ScrapingBee',
        };
      }

      return {
        success: true,
        data: html,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to scrape webpage: ${message}`,
      };
    }
  },
});
