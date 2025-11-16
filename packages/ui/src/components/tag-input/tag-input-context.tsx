"use client";

import { createContext, useContext } from "react";
import type {
  TagClickHandler,
  TagQueryFn,
  TagRenderFn,
} from "./tag-input-types";

type TagInputContextValue = {
  renderTag?: TagRenderFn;
  onTagClick?: Record<string, TagClickHandler>;
  onQuery?: TagQueryFn;
  keywords?: string[];
};

const TagInputContext = createContext<TagInputContextValue | null>(null);

export function TagInputProvider({
  children,
  renderTag,
  onTagClick,
  onQuery,
  keywords,
}: {
  children: React.ReactNode;
  renderTag?: TagRenderFn;
  onTagClick?: Record<string, TagClickHandler>;
  onQuery?: TagQueryFn;
  keywords?: string[];
}) {
  return (
    <TagInputContext.Provider
      value={{ renderTag, onTagClick, onQuery, keywords }}
    >
      {children}
    </TagInputContext.Provider>
  );
}

export function useTagInputContext() {
  const context = useContext(TagInputContext);
  if (!context) {
    throw new Error("useTagInputContext must be used within TagInputProvider");
  }
  return context;
}
