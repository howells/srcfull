import type { LexicalEditor } from "lexical";
import { $getRoot } from "lexical";
import { useCallback, useEffect, useState } from "react";
import type { TagData } from "./tag-input-types";
import { traverseAndCollectTags } from "./utils";

export function useTagInput(editor: LexicalEditor | null) {
  const [tags, setTags] = useState<TagData[]>([]);

  // Collect all tags from editor state
  const collectTags = useCallback(
    (editorState: { read: (arg0: () => void) => void }) => {
      let collectedTags: TagData[] = [];

      editorState.read(() => {
        const root = $getRoot();
        collectedTags = traverseAndCollectTags(root);
      });

      return collectedTags;
    },
    []
  );

  // Listen to editor updates and collect tags
  useEffect(() => {
    if (!editor) return;

    return editor.registerUpdateListener(({ editorState }) => {
      const newTags = collectTags(editorState);
      setTags(newTags);
    });
  }, [editor, collectTags]);

  return {
    tags,
  };
}
