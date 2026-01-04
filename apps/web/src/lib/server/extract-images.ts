import { executeScrapeWebpage } from '../tools/scrape-webpage';
import { executeExtractImageElements } from '../tools/extract-image-elements';
import type { ImageCandidate } from '../tools/types';

/**
 * Server-side image extraction that runs all steps before passing to agent.
 * This avoids sending large HTML payloads to the AI model.
 */
export async function extractImagesFromUrl(url: string): Promise<{
  success: boolean;
  candidates?: ImageCandidate[];
  error?: string;
}> {
  // Step 1: Scrape the webpage
  const scrapeResult = await executeScrapeWebpage(url);

  if (!scrapeResult.success || !scrapeResult.data) {
    return {
      success: false,
      error: scrapeResult.error || 'Failed to scrape webpage',
    };
  }

  const html = scrapeResult.data;

  // Step 2: Extract image elements from HTML
  const extractResult = await executeExtractImageElements(html);

  if (!extractResult.success || !extractResult.data) {
    return {
      success: false,
      error: extractResult.error || 'Failed to extract images',
    };
  }

  const allCandidates = extractResult.data;

  // Step 3: Analyze and filter to main images (server-side logic)
  const MIN_SIZE = 200;
  const MAX_LOGO_SIZE = 150;

  const logoPatterns = [
    /logo/i,
    /icon/i,
    /favicon/i,
    /badge/i,
    /sprite/i,
    /thumbnail/i,
    /avatar/i,
    /profile-pic/i,
    /social/i,
    /share/i,
    /button/i,
  ];

  const mainImages = allCandidates.filter(candidate => {
    // Filter out URLs that match logo patterns
    const isLikelyLogo = logoPatterns.some(pattern => pattern.test(candidate.url));
    if (isLikelyLogo) {
      return false;
    }

    // If we have explicit dimensions, check them
    if (candidate.width || candidate.height) {
      const maxDimension = Math.max(candidate.width || 0, candidate.height || 0);

      // Filter out small images that are likely icons/logos
      if (maxDimension < MAX_LOGO_SIZE) {
        return false;
      }

      return maxDimension >= MIN_SIZE;
    }

    // If we have srcset, assume it's likely a main image
    if (candidate.srcset && candidate.srcset.length > 0) {
      return true;
    }

    // Background images are often main images
    if (candidate.source === 'background') {
      return true;
    }

    // If no size info, include it (agent will validate later)
    return true;
  });

  // Sort by size (largest first) when we have dimension info
  mainImages.sort((a, b) => {
    const sizeA = Math.max(a.width || 0, a.height || 0);
    const sizeB = Math.max(b.width || 0, b.height || 0);
    return sizeB - sizeA;
  });

  return {
    success: true,
    candidates: mainImages,
  };
}
