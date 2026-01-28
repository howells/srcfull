import { getEnv } from "../env";

type FirecrawlImage = {
  url: string;
  alt: string | null;
};

type FirecrawlResult = {
  success: boolean;
  images?: FirecrawlImage[];
  error?: string;
};

export async function scrapeWithFirecrawl(url: string): Promise<FirecrawlResult> {
  const apiKey = getEnv("FIRECRAWL_API_KEY");
  if (!apiKey) {
    return { success: false, error: "FIRECRAWL_API_KEY not configured" };
  }

  try {
    const response = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        onlyMainContent: true,
        maxAge: 172800000, // 48 hours cache
        formats: ["images"],
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Firecrawl returned ${response.status}`,
      };
    }

    const data = await response.json();

    if (!data.success || !data.data?.images) {
      return {
        success: false,
        error: data.error || "No images returned from Firecrawl",
      };
    }

    // Filter out SVGs and small icons
    const filtered = (data.data.images as string[]).filter((imgUrl) => {
      if (imgUrl.endsWith(".svg")) return false;
      if (/logo|icon|favicon|badge|sprite|button/i.test(imgUrl)) return false;
      return true;
    });

    return {
      success: true,
      images: filtered.map((imgUrl) => ({ url: imgUrl, alt: null })),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Firecrawl failed: ${message}`,
    };
  }
}
