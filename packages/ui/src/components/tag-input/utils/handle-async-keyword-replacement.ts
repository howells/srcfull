import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  type LexicalEditor,
  type TextNode,
} from "lexical";
import type { TagData } from "../tag-input-types";
import { replaceKeywordWithNode } from "./replace-keyword-with-node";

/**
 * Attempts to replace matched text with a keyword node after async query returns
 */
export function handleAsyncKeywordReplacement(
  editor: LexicalEditor,
  matchedTag: TagData,
  originalText: string
): void {
  editor.update(() => {
    // Get fresh selection and node
    const freshSelection = $getSelection();
    if (!$isRangeSelection(freshSelection)) {
      console.log("[KeywordPlugin] Not a range selection");
      return;
    }

    const freshNode = freshSelection.anchor.getNode();
    if (!$isTextNode(freshNode)) {
      console.log("[KeywordPlugin] Not a text node");
      return;
    }

    const freshTextContent = freshNode.getTextContent();
    const freshAnchorOffset = freshSelection.anchor.offset;

    console.log("[KeywordPlugin] Fresh state:", {
      text: freshTextContent,
      offset: freshAnchorOffset,
      originalText,
    });

    // Validate that text hasn't changed since query
    if (!validateTextStillMatches(freshTextContent, freshAnchorOffset, originalText)) {
      console.log("[KeywordPlugin] Text changed, aborting");
      return;
    }

    console.log("[KeywordPlugin] Proceeding with replacement");

    // Replace keyword with node
    performReplacement(
      freshNode as TextNode,
      freshTextContent,
      freshAnchorOffset,
      matchedTag,
      originalText
    );
  });
}

/**
 * Validates that the original text still matches what's currently typed
 */
function validateTextStillMatches(
  textContent: string,
  offset: number,
  originalText: string
): boolean {
  const beforeCursor = textContent.slice(0, offset).trim();
  const matchesOriginal = beforeCursor
    .toLowerCase()
    .endsWith(originalText.toLowerCase());

  console.log("[KeywordPlugin] Validation:", {
    beforeCursor,
    originalText,
    matches: matchesOriginal,
  });

  return matchesOriginal;
}

/**
 * Performs the actual keyword-to-node replacement
 */
function performReplacement(
  node: TextNode,
  textContent: string,
  offset: number,
  matchedTag: TagData,
  originalText: string
): void {
  // Remove the space that was just typed (if it's still there)
  let adjustedOffset = offset;
  let adjustedText = textContent;

  if (textContent.charAt(offset - 1) === " ") {
    adjustedText = textContent.slice(0, offset - 1) + textContent.slice(offset);
    adjustedOffset = offset - 1;
    node.setTextContent(adjustedText);
  }

  replaceKeywordWithNode(
    node,
    adjustedText,
    adjustedOffset,
    matchedTag,
    originalText
  );
}
