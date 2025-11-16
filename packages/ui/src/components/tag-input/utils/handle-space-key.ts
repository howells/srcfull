import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  type LexicalEditor,
} from "lexical";
import type { TagData } from "../tag-input-types";
import { getTextSinceLastTag } from "./get-text-since-last-tag";
import { handleAsyncKeywordReplacement } from "./handle-async-keyword-replacement";
import { findMatchingTag, queryTagMatches } from "./keyword-utils";
import { replaceKeywordWithNode } from "./replace-keyword-with-node";

type HandleSpaceKeyParams = {
  editor: LexicalEditor;
  onQuery?: (query: string) => Promise<TagData[]> | TagData[];
  keywords?: string[];
  event?: KeyboardEvent | null;
};

/**
 * Handles space key press to detect and replace keywords with tags
 */
export function handleSpaceKey({
  editor,
  onQuery,
  keywords,
  event,
}: HandleSpaceKeyParams): boolean {
  const selection = $getSelection();

  if (!$isRangeSelection(selection)) {
    return false;
  }

  const node = selection.anchor.getNode();
  if (!$isTextNode(node)) {
    return false;
  }

  const textContent = node.getTextContent();
  const anchorOffset = selection.anchor.offset;

  // Get all text since the last tag (or beginning) to support multi-word phrases
  const textSinceLastTag = getTextSinceLastTag(node, anchorOffset);

  if (!textSinceLastTag) {
    return false;
  }

  // Handle async query mode
  if (onQuery) {
    handleAsyncQuery(editor, textSinceLastTag, onQuery);
    return false; // Don't prevent default - let the space be typed
  }

  // Handle simple keywords mode
  if (keywords) {
    return handleSimpleKeywords(
      editor,
      node,
      textContent,
      anchorOffset,
      textSinceLastTag,
      keywords,
      event
    );
  }

  return false;
}

/**
 * Handles async keyword matching
 */
function handleAsyncQuery(
  editor: LexicalEditor,
  originalText: string,
  onQuery: (query: string) => Promise<TagData[]> | TagData[]
): void {
  console.log("[KeywordPlugin] Querying for:", originalText);

  // Run async query
  queryTagMatches(originalText, onQuery)
    .then((matches) => {
      console.log("[KeywordPlugin] Query returned:", matches);

      if (matches.length > 0) {
        // Use first match (best match from query)
        const matchedTag = matches[0];
        console.log("[KeywordPlugin] Using match:", matchedTag);

        if (matchedTag) {
          handleAsyncKeywordReplacement(editor, matchedTag, originalText);
        }
      } else {
        console.log("[KeywordPlugin] No matches returned");
      }
    })
    .catch((error) => {
      console.error("Tag query failed:", error);
    });
}

/**
 * Handles simple keyword matching from a list
 */
function handleSimpleKeywords(
  editor: LexicalEditor,
  node: ReturnType<typeof $getSelection>["anchor"]["getNode"],
  textContent: string,
  anchorOffset: number,
  textSinceLastTag: string,
  keywords: string[],
  event?: KeyboardEvent | null
): boolean {
  const matchedTag = findMatchingTag(textSinceLastTag, keywords);

  if (matchedTag) {
    editor.update(() => {
      replaceKeywordWithNode(node, textContent, anchorOffset, matchedTag);
    });

    // Prevent default space insertion
    event?.preventDefault();
    return true;
  }

  return false;
}
