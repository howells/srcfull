"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import type { TagData } from "./tag-input-types";
import { useTagInput } from "./use-tag-input";

type TagCollectionPluginProps<T = Record<string, unknown>> = {
  onTagsChange?: (tags: TagData<T>[]) => void;
};

export function TagCollectionPlugin<T = Record<string, unknown>>({
  onTagsChange,
}: TagCollectionPluginProps<T>) {
  const [editor] = useLexicalComposerContext();
  const { tags } = useTagInput(editor);

  useEffect(() => {
    onTagsChange?.(tags as TagData<T>[]);
  }, [tags, onTagsChange]);

  return null;
}
