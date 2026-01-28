import { ScrapingBeeClient } from "scrapingbee";
import { requireEnv } from "../env";

type ScrapeMetadata = {
  usedStealthProxy: boolean;
  domain: string;
};

type ToolResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: ScrapeMetadata;
};

const client = new ScrapingBeeClient(requireEnv("SCRAPINGBEE_API_KEY"));

async function scrapeWithParams(
  url: string,
  extraParams: Record<string, unknown> = {}
): Promise<ToolResult<string>> {
  const response = await client.get({
    url,
    params: {
      render_js: true,
      wait: 2000,
      block_resources: false,
      ...extraParams,
    },
  });

  const html = response.data.toString();

  if (!html || html.length === 0) {
    return {
      success: false,
      error: "Received empty response from ScrapingBee",
    };
  }

  return {
    success: true,
    data: html,
  };
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

// Internal function for testing
export async function executeScrapeWebpage(
  url: string
): Promise<ToolResult<string>> {
  const domain = extractDomain(url);

  try {
    // Try standard proxy first
    const result = await scrapeWithParams(url);
    if (result.success) {
      return {
        ...result,
        metadata: { usedStealthProxy: false, domain },
      };
    }

    // Fallback to stealth proxy on failure
    console.log(`Standard proxy failed for ${url}, retrying with stealth proxy`);
    const stealthResult = await scrapeWithParams(url, { stealth_proxy: true });
    return {
      ...stealthResult,
      metadata: { usedStealthProxy: true, domain },
    };
  } catch (error) {
    // If standard proxy throws, try stealth proxy
    console.log(`Standard proxy threw for ${url}, retrying with stealth proxy`);
    try {
      const stealthResult = await scrapeWithParams(url, { stealth_proxy: true });
      return {
        ...stealthResult,
        metadata: { usedStealthProxy: true, domain },
      };
    } catch (stealthError) {
      const message =
        stealthError instanceof Error ? stealthError.message : "Unknown error";
      return {
        success: false,
        error: `Failed to scrape webpage: ${message}`,
        metadata: { usedStealthProxy: true, domain },
      };
    }
  }
}
