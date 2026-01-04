import { tool } from 'ai';
import { z } from 'zod';
import { loadPatterns, savePatterns } from '../utils/patterns';

export const learnPattern = tool({
  description: 'Learns a new URL pattern from successful resolution',
  parameters: z.object({
    originalUrl: z.string().url().describe('The original image URL'),
    sourceUrl: z.string().url().describe('The resolved source URL'),
    domain: z.string().describe('The domain to associate this pattern with'),
  }),
  execute: async ({ originalUrl, sourceUrl, domain }) => {
    try {
      // Don't learn if URLs are the same
      if (originalUrl === sourceUrl) {
        return { learned: false, reason: 'URLs are identical' };
      }

      const patterns = loadPatterns();

      // Extract what was stripped/changed
      const originalParams = new URL(originalUrl).searchParams;
      const sourceParams = new URL(sourceUrl).searchParams;

      const strippedParams: string[] = [];
      originalParams.forEach((_, key) => {
        if (!sourceParams.has(key)) {
          strippedParams.push(key);
        }
      });

      // Check if we already have a pattern for this domain
      const existingPattern = Object.entries(patterns).find(
        ([_, p]) => p.domain === domain
      );

      if (existingPattern) {
        const [name, pattern] = existingPattern;

        // Update stripParams if we found new ones
        const currentParams = pattern.stripParams || [];
        const newParams = strippedParams.filter(p => !currentParams.includes(p));

        if (newParams.length > 0) {
          patterns[name] = {
            ...pattern,
            stripParams: [...currentParams, ...newParams],
          };
          savePatterns(patterns);
          return { learned: true, updated: true, params: newParams };
        }
        return { learned: false, reason: 'Pattern already known' };
      } else if (strippedParams.length > 0) {
        // Create new pattern
        const patternName = domain.replace(/[^a-zA-Z0-9]/g, '_');
        patterns[patternName] = {
          domain,
          stripParams: strippedParams,
          confidence: 'low',
          examples: [originalUrl],
        };
        savePatterns(patterns);
        return { learned: true, created: true, params: strippedParams };
      }

      return { learned: false, reason: 'No params to learn' };
    } catch (error) {
      // Don't fail the request if we can't learn
      // Just log and continue
      console.error('Failed to learn pattern:', error);
      return { learned: false, reason: 'Error during learning' };
    }
  },
});
