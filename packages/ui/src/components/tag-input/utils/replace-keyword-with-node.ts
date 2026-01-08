import { $createTextNode, type TextNode } from "lexical";
import { $createKeywordNode } from "../tag-input-keyword-node";
import type { TagData } from "../tag-input-types";

/**
 * Replaces a keyword in a text node with a KeywordNode decorator
 */
export function replaceKeywordWithNode(
  node: TextNode,
  textContent: string,
  anchorOffset: number,
  tagData: TagData,
  originalText?: string
): void {
  // Use originalText if provided (what user actually typed), otherwise fall back to label
  const searchText = originalText || tagData.label;

  const textBeforeCursor = textContent.slice(0, anchorOffset);
  const lowerTextBeforeCursor = textBeforeCursor.toLowerCase();
  const lowerSearchText = searchText.toLowerCase();

  const keywordStartIndex = lowerTextBeforeCursor.lastIndexOf(lowerSearchText);

  if (keywordStartIndex === -1) {
    console.log("[replaceKeywordWithNode] Could not find keyword", {
      searchText,
      textBeforeCursor,
      anchorOffset,
    });
    return;
  }

  const textBefore = textContent.slice(0, keywordStartIndex);
  const textAfter = textContent.slice(keywordStartIndex + searchText.length);

  // Create the keyword node
  const keywordNode = $createKeywordNode(tagData);

  // Create text node for content before keyword (if any)
  if (textBefore) {
    const beforeNode = $createTextNode(textBefore);
    node.insertBefore(beforeNode);
  }

  // Insert the keyword node
  node.insertBefore(keywordNode);

  // Create text node for continuation (with space)
  const continuationText = ` ${textAfter}`;
  const continuationNode = $createTextNode(continuationText);
  node.insertBefore(continuationNode);

  // Remove the original node
  node.remove();

  // Move cursor after the space in the continuation node
  continuationNode.select(1, 1);
}
