import type { LexicalNode } from "lexical";
import { $isKeywordNode } from "../tag-input-keyword-node";
import type { TagData } from "../tag-input-types";

/**
 * Traverses the Lexical editor tree and collects all KeywordNodes as tags
 */
export function traverseAndCollectTags(rootNode: LexicalNode): TagData[] {
  const tags: TagData[] = [];

  function traverse(node: LexicalNode) {
    if ($isKeywordNode(node)) {
      tags.push(node.getTagData());
    }

    // Only traverse if the node has children
    if ("getChildren" in node && typeof node.getChildren === "function") {
      const children = node.getChildren();
      for (const child of children) {
        traverse(child);
      }
    }
  }

  traverse(rootNode);
  return tags;
}
