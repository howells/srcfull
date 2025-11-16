"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { NodeKey } from "lexical";
import { $createTextNode, $getNodeByKey, $getSelection } from "lexical";
import { useCallback } from "react";
import { Badge } from "../badge";
import { BadgeButton } from "../badge/badge-button";
import { useTagInputContext } from "./tag-input-context";
import type { TagData, TagInputEditorRef } from "./tag-input-types";

type KeywordComponentProps = {
  tagData: TagData;
  nodeKey: NodeKey;
};

export function KeywordComponent({ tagData, nodeKey }: KeywordComponentProps) {
  const [editor] = useLexicalComposerContext();
  const { renderTag, onTagClick } = useTagInputContext();

  // Check if this is the first KeywordNode
  const isFirstBadge = editor.getEditorState().read(() => {
    const node = $getNodeByKey(nodeKey);
    if (!node) {
      return false;
    }

    const parent = node.getParent();
    if (!parent) {
      return false;
    }

    const children = parent.getChildren();
    const firstKeywordNode = children.find(
      (child) => child.getType() === "keyword"
    );
    return firstKeywordNode?.getKey() === nodeKey;
  });

  const handleDelete = useCallback(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) {
        node.remove();
      }
    });
  }, [editor, nodeKey]);

  const handleClick = useCallback(() => {
    if (tagData.type && onTagClick?.[tagData.type]) {
      const editorRef: TagInputEditorRef = {
        focus: () => {
          editor.focus();
        },
        insertText: (text: string) => {
          editor.update(() => {
            const selection = $getSelection();
            if (selection) {
              const textNode = $createTextNode(text);
              selection.insertNodes([textNode]);
            }
          });
        },
      };
      const handler = onTagClick[tagData.type];
      if (handler) {
        handler(tagData, editorRef);
      }
    }
  }, [tagData, onTagClick, editor]);

  // Custom rendering if provided
  if (renderTag) {
    return (
      <span className="mx-0.5 inline-flex">
        {renderTag(tagData, handleDelete)}
      </span>
    );
  }

  // Default rendering
  return (
    <Badge
      appearance="light"
      className={
        isFirstBadge ? "-ml-1 mr-0.5 inline-flex" : "mx-0.5 inline-flex"
      }
      onClick={handleClick}
      shape="circle"
      size="xl"
      variant="primary"
    >
      {tagData.label}
      <BadgeButton
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDelete();
        }}
      />
    </Badge>
  );
}
