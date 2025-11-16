import { scrapeWebpage } from '../tools/scrape-webpage';
import { extractImageElements } from '../tools/extract-image-elements';
import { analyzeRenderedSizes } from '../tools/analyze-rendered-sizes';
import { matchKnownPatterns } from '../tools/match-known-patterns';
import { findSourceUrl } from '../tools/find-source-url';
import { validateImageUrl } from '../tools/validate-image-url';
import { learnPattern } from '../tools/learn-pattern';

export const tools = {
  scrapeWebpage,
  extractImageElements,
  analyzeRenderedSizes,
  matchKnownPatterns,
  findSourceUrl,
  validateImageUrl,
  learnPattern,
};
