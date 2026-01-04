// Agent tools for URL resolution only
// Scraping, extraction, and analysis are done server-side to avoid token limits
import { matchKnownPatterns } from '../tools/match-known-patterns';
import { findSourceUrl } from '../tools/find-source-url';
import { validateImageUrl } from '../tools/validate-image-url';
import { learnPattern } from '../tools/learn-pattern';

export const tools = {
  matchKnownPatterns,
  findSourceUrl,
  validateImageUrl,
  learnPattern,
};
