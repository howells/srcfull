import { ScrapingBeeClient } from 'scrapingbee';

interface ToolResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const client = new ScrapingBeeClient(
  process.env.SCRAPINGBEE_API_KEY!
);

// Internal function for testing
export async function executeScrapeWebpage(url: string): Promise<ToolResult<string>> {
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
}
