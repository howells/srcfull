import type { NodeKey } from "lexical";
import { DecoratorNode } from "lexical";
import { KeywordComponent } from "./tag-input-keyword-component";
import type { SerializedKeywordNode, TagData } from "./tag-input-types";

export class KeywordNode extends DecoratorNode<JSX.Element> {
  __tagData: TagData;

  static getType(): string {
    return "keyword";
  }

  static clone(node: KeywordNode): KeywordNode {
    return new KeywordNode(node.__tagData, node.__key);
  }

  constructor(tagData: TagData, key?: NodeKey) {
    super(key);
    this.__tagData = tagData;
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  static importJSON(serializedNode: SerializedKeywordNode): KeywordNode {
    return $createKeywordNode(serializedNode.tagData);
  }

  exportJSON(): SerializedKeywordNode {
    return {
      tagData: this.__tagData,
      type: "keyword",
      version: 1,
    };
  }

  getTextContent(): string {
    return this.__tagData.label;
  }

  getTagData(): TagData {
    return this.__tagData;
  }

  decorate(): JSX.Element {
    return <KeywordComponent nodeKey={this.__key} tagData={this.__tagData} />;
  }
}

export function $createKeywordNode(tagData: TagData): KeywordNode {
  return new KeywordNode(tagData);
}

export function $isKeywordNode(
  node: unknown | null | undefined
): node is KeywordNode {
  return node instanceof KeywordNode;
}
