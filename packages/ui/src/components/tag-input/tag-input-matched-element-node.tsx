import {
  $applyNodeReplacement,
  type DOMConversionMap,
  type DOMConversionOutput,
  type EditorConfig,
  ElementNode,
  type LexicalNode,
  type NodeKey,
  type SerializedElementNode,
  type Spread,
} from "lexical";
import type { TagData } from "./tag-input-types";

export type SerializedMatchedElementNode = Spread<
  {
    tagData: TagData;
  },
  SerializedElementNode
>;

export class MatchedElementNode extends ElementNode {
  __tagData: TagData;

  static getType(): string {
    return "matched-element";
  }

  static clone(node: MatchedElementNode): MatchedElementNode {
    return new MatchedElementNode(node.__tagData, node.__key);
  }

  constructor(tagData: TagData, key?: NodeKey) {
    super(key);
    this.__tagData = tagData;
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement("span");
    element.className =
      "inline-block cursor-pointer bg-info-soft rounded px-1 py-0.5 hover:bg-info-accent";
    // Store tag data for click handling
    element.dataset.tagId = this.__tagData.id;
    element.dataset.tagType = this.__tagData.type;
    return element;
  }

  updateDOM(): false {
    // Never update, always create fresh
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (_node: Node) => ({
        conversion: convertMatchedElement,
        priority: 1,
      }),
    };
  }

  static importJSON(
    serializedNode: SerializedMatchedElementNode
  ): MatchedElementNode {
    return $createMatchedElementNode(serializedNode.tagData);
  }

  exportJSON(): SerializedMatchedElementNode {
    return {
      ...super.exportJSON(),
      tagData: this.__tagData,
      type: "matched-element",
      version: 1,
    };
  }

  getTagData(): TagData {
    return this.__tagData;
  }

  // Allow text to be inserted and edited inside this node
  isInline(): true {
    return true;
  }

  // Don't collapse when empty
  canBeEmpty(): false {
    return false;
  }

  // Extract text content from children
  getTextContent(): string {
    return super.getTextContent();
  }
}

function convertMatchedElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLElement)) {
    return null;
  }

  const tagId = domNode.dataset.tagId;
  const tagType = domNode.dataset.tagType;
  const label = domNode.textContent || "";

  if (!(tagId && tagType)) {
    return null;
  }

  const node = $createMatchedElementNode({
    id: tagId,
    label,
    type: tagType as "category" | "classification" | "brand",
  });

  return { node };
}

export function $createMatchedElementNode(
  tagData: TagData
): MatchedElementNode {
  return $applyNodeReplacement(new MatchedElementNode(tagData));
}

export function $isMatchedElementNode(
  node: LexicalNode | null | undefined
): node is MatchedElementNode {
  return node instanceof MatchedElementNode;
}
