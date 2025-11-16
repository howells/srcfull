import * as cheerio from 'cheerio';
import { tool } from 'ai';
import { z } from 'zod';
import type { ToolResult, ImageCandidate } from './types';

// Internal function for testing
export async function executeExtractImageElements(
  html: string
): Promise<ToolResult<ImageCandidate[]>> {
  try {
    const $ = cheerio.load(html);
    const candidates: ImageCandidate[] = [];

    // Extract from <img> tags
    $('img').each((_, el) => {
      const $el = $(el);
      const src = $el.attr('src');
      const srcset = $el.attr('srcset');
      const width = parseInt($el.attr('width') || '0', 10) || undefined;
      const height = parseInt($el.attr('height') || '0', 10) || undefined;
      const alt = $el.attr('alt');

      if (src) {
        const srcsetUrls = srcset
          ? srcset.split(',').map(s => s.trim().split(' ')[0])
          : [];

        candidates.push({
          url: src,
          source: 'img',
          width,
          height,
          srcset: srcsetUrls.length > 0 ? srcsetUrls : undefined,
          alt,
        });
      }
    });

    // Extract from <picture> tags
    $('picture source').each((_, el) => {
      const $el = $(el);
      const srcset = $el.attr('srcset');

      if (srcset) {
        const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
        urls.forEach(url => {
          candidates.push({
            url,
            source: 'picture',
            srcset: urls,
          });
        });
      }
    });

    // Extract from CSS background-image
    $('[style*="background-image"]').each((_, el) => {
      const $el = $(el);
      const style = $el.attr('style');
      if (style) {
        const match = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
        if (match && match[1]) {
          candidates.push({
            url: match[1],
            source: 'background',
          });
        }
      }
    });

    // Deduplicate by URL
    const uniqueCandidates = candidates.filter(
      (candidate, index, self) =>
        index === self.findIndex(c => c.url === candidate.url)
    );

    return {
      success: true,
      data: uniqueCandidates,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to extract images: ${message}`,
    };
  }
}

export const extractImageElements = tool({
  description: 'Extracts all image elements from HTML including img, picture, and CSS background images',
  parameters: z.object({
    html: z.string().describe('The HTML content to parse'),
  }),
  execute: async ({ html }) => executeExtractImageElements(html),
});
