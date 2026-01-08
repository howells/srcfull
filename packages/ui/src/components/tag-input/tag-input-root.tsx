"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { useMemo } from "react";
import { cn } from "../../utils/cn";
import { focusInput } from "../../utils/focus-input";
import { ContentChangePlugin } from "./tag-input-content-change-plugin";
import { TagInputProvider } from "./tag-input-context";
import { KeywordNode } from "./tag-input-keyword-node";
import { KeywordPlugin } from "./tag-input-keyword-plugin";
import { MatchHighlightPlugin } from "./tag-input-match-highlight-plugin";
import { MatchedElementNode } from "./tag-input-matched-element-node";
import { TagCollectionPlugin } from "./tag-input-tag-collection-plugin";
import type { TagInputProps } from "./tag-input-types";

export function TagInput<T = Record<string, unknown>>({
  className,
  placeholder = "Type a keyword and press space…",
  keywords,
  onQuery,
  renderTag,
  onTagClick,
  onTagsChange,
  onContentChange,
}: TagInputProps<T>) {
  const initialConfig = useMemo(
    () => ({
      namespace: "TagInput",
      theme: {
        paragraph: "m-0 leading-6",
      },
      nodes: [KeywordNode, MatchedElementNode],
      onError: (error: Error) => {
        console.error(error);
      },
    }),
    []
  );

  return (
    <TagInputProvider
      keywords={keywords}
      onQuery={onQuery as never}
      onTagClick={onTagClick as never}
      renderTag={renderTag as never}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <div
          className={cn(
            "relative flex h-[52px] w-full items-center rounded-full border border-border bg-input-bg px-3.5 text-sm transition-colors",
            focusInput,
            className
          )}
        >
          <PlainTextPlugin
            contentEditable={
              <ContentEditable
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="min-h-6 flex-1 outline-none"
                spellCheck={false}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={
              <div className="pointer-events-none absolute inset-0 flex items-center px-3.5 text-muted-foreground text-sm">
                {placeholder}
              </div>
            }
          />
          <HistoryPlugin />
          <KeywordPlugin />
          <MatchHighlightPlugin />
          {/* <AutocompletePlugin /> */}
          <TagCollectionPlugin onTagsChange={onTagsChange} />
          <ContentChangePlugin onContentChange={onContentChange} />
        </div>
      </LexicalComposer>
    </TagInputProvider>
  );
}

export type { TagData, TagInputProps } from "./tag-input-types";
