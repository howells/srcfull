import type { DecoratorNode, SerializedLexicalNode, Spread } from "lexical";
import type { ReactElement } from "react";

// Generic tag with extensible metadata
export type TagData<T = Record<string, unknown>> = {
  id: string;
  label: string;
  type?: string; // e.g., "brand", "category", "classification"
  metadata?: T;
};

// Query function that returns matches
export type TagQueryFn<T = Record<string, unknown>> = (
  query: string
) => Promise<TagData<T>[]> | TagData<T>[];

// Render function for custom tag rendering
export type TagRenderFn<T = Record<string, unknown>> = (
  tag: TagData<T>,
  onRemove: () => void
) => ReactElement;

// Editor ref for click handlers
export type TagInputEditorRef = {
  focus: () => void;
  insertText: (text: string) => void;
};

// Click handler per tag type
export type TagClickHandler<T = Record<string, unknown>> = (
  tag: TagData<T>,
  editorRef: TagInputEditorRef
) => void;

export type TagInputProps<T = Record<string, unknown>> = {
  className?: string;
  placeholder?: string;

  // Simple mode: array of strings (internally converted to TagData)
  keywords?: string[];

  // Advanced mode: async query function
  onQuery?: TagQueryFn<T>;

  // Rendering (defaults to Badge with info variant)
  renderTag?: TagRenderFn<T>;

  // Click handlers per tag type
  onTagClick?: Record<string, TagClickHandler<T>>;

  // Callbacks
  onTagsChange?: (tags: TagData<T>[]) => void;
  onContentChange?: (hasContent: boolean) => void;
};

export type SerializedKeywordNode = Spread<
  {
    tagData: TagData;
  },
  SerializedLexicalNode
>;

export type KeywordNodeType = DecoratorNode<ReactElement> & {
  __tagData: TagData;
};

export type SerializedMatchedTextNode = Spread<
  {
    tagData: TagData;
  },
  SerializedLexicalNode
>;

export type MatchedTextNodeType = DecoratorNode<ReactElement> & {
  __tagData: TagData;
};
