import type { TagData, TagQueryFn } from "../tag-input-types";

// Define regex at top level to avoid recreation on every function call
export const WHITESPACE_REGEX = /\s+/;

/**
 * Extracts the last word from a text string before the cursor position
 */
export function getLastWord(
  text: string,
  cursorOffset: number
): string | undefined {
  const textBeforeCursor = text.slice(0, cursorOffset);
  const words = textBeforeCursor.split(WHITESPACE_REGEX);
  return words.at(-1);
}

/**
 * Queries for tag matches using async query function
 */
export async function queryTagMatches(
  word: string,
  onQuery: TagQueryFn
): Promise<TagData[]> {
  const results = await Promise.resolve(onQuery(word));
  return results;
}

/**
 * Finds a matching tag from a simple keyword array (converts to TagData)
 */
export function findMatchingTag(
  word: string,
  keywords: string[]
): TagData | undefined {
  const wordLower = word.toLowerCase();
  const matchedKeyword = keywords.find((kw) => kw.toLowerCase() === wordLower);

  if (matchedKeyword) {
    return {
      id: matchedKeyword.toLowerCase(),
      label: matchedKeyword,
    };
  }

  return;
}
