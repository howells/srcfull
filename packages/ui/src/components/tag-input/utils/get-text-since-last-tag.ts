import { $isTextNode, type TextNode } from "lexical";
import { $isKeywordNode } from "../tag-input-keyword-node";

/**
 * Gets all text content since the last KeywordNode or beginning of the text
 */
export function getTextSinceLastTag(node: TextNode, offset: number): string {
  const textContent = node.getTextContent();
  const textBeforeCursor = textContent.slice(0, offset);

  // Check if there are any previous siblings that are KeywordNodes
  let currentNode = node.getPreviousSibling();

  // If the current node has text before the cursor that spans multiple words,
  // and there's no previous KeywordNode, return all text before cursor
  if (!currentNode) {
    return textBeforeCursor.trim();
  }

  // If previous sibling is a KeywordNode, only return text from current node
  if ($isKeywordNode(currentNode)) {
    return textBeforeCursor.trim();
  }

  // Otherwise, walk back through text nodes until we find a KeywordNode or run out
  let fullText = textBeforeCursor;
  while (currentNode && $isTextNode(currentNode)) {
    fullText = currentNode.getTextContent() + fullText;
    currentNode = currentNode.getPreviousSibling();

    if (currentNode && $isKeywordNode(currentNode)) {
      break;
    }
  }

  return fullText.trim();
}
