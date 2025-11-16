/**
 * Utility functions for TagInput component
 *
 * Single-purpose utilities extracted from the main component files
 * for better organization, reusability, and testability.
 */

export {
  findMatchingTag,
  getLastWord,
  queryTagMatches,
  WHITESPACE_REGEX,
} from "./keyword-utils";
export { replaceKeywordWithNode } from "./replace-keyword-with-node";
export { traverseAndCollectTags } from "./traverse-and-collect-tags";
