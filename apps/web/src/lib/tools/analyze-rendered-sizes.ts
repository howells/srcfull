import { tool } from 'ai';
import { z } from 'zod';
import type { ToolResult, ImageCandidate } from './types';

const ImageCandidateSchema = z.object({
  url: z.string(),
  source: z.enum(['img', 'picture', 'background']),
  width: z.number().optional(),
  height: z.number().optional(),
  srcset: z.array(z.string()).optional(),
  alt: z.string().optional(),
});

export const analyzeRenderedSizes = tool({
  description: 'Analyzes image candidates and filters to main images based on size',
  parameters: z.object({
    candidates: z.array(ImageCandidateSchema).describe('Array of image candidates to analyze'),
  }),
  execute: async ({ candidates }): Promise<ToolResult<ImageCandidate[]>> => {
    try {
      const MIN_SIZE = 200; // Minimum width or height to be considered a "main" image

      const mainImages = candidates.filter(candidate => {
        // If we have explicit dimensions, check them
        if (candidate.width || candidate.height) {
          const maxDimension = Math.max(candidate.width || 0, candidate.height || 0);
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

        // If no size info, include it (we'll validate later)
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
        data: mainImages,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to analyze image sizes: ${message}`,
      };
    }
  },
});
