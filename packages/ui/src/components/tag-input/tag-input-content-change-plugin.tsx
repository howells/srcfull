"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $isTextNode } from "lexical";
import { useEffect, useRef } from "react";

type ContentChangePluginProps = {
  onContentChange?: (hasContent: boolean) => void;
};

export function ContentChangePlugin({ onContentChange }: ContentChangePluginProps) {
  const [editor] = useLexicalComposerContext();
  const previousValueRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!onContentChange) {
      return;
    }

    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const children = root.getChildren();

        // Check if there's any text content
        let hasTextContent = false;
        for (const child of children) {
          if ("getChildren" in child && typeof child.getChildren === "function") {
            const grandchildren = child.getChildren();
            for (const grandchild of grandchildren) {
              if ($isTextNode(grandchild) && grandchild.getTextContent().trim()) {
                hasTextContent = true;
                break;
              }
            }
          }
          if (hasTextContent) {
            break;
          }
        }

        // Only call onContentChange if the value actually changed
        if (previousValueRef.current !== hasTextContent) {
          previousValueRef.current = hasTextContent;
          onContentChange(hasTextContent);
        }
      });
    });
  }, [editor, onContentChange]);

  return null;
}
