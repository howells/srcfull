"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { DocumentItem } from "./document-list-types";

type DocumentListContextValue = {
  documents: readonly DocumentItem[];
  selectedIds: ReadonlySet<string>;
  isSelected: (id: string) => boolean;
  toggleItem: (id: string) => void;
  toggleAll: () => void;
  clearSelection: () => void;
  allSelected: boolean;
  someSelected: boolean;
  getSelectedDocuments: () => DocumentItem[];
};

const DocumentListContext = createContext<DocumentListContextValue | null>(
  null
);

export function DocumentListProvider({
  documents,
  children,
}: {
  documents: readonly DocumentItem[];
  children: React.ReactNode;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const toggleItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === documents.length) {
        return new Set();
      }
      return new Set(documents.map((d) => d.id));
    });
  }, [documents]);

  const allSelected =
    selectedIds.size > 0 && selectedIds.size === documents.length;
  const someSelected =
    selectedIds.size > 0 && selectedIds.size < documents.length;

  const getSelectedDocuments = useCallback(
    () => documents.filter((d) => selectedIds.has(d.id)),
    [documents, selectedIds]
  );

  const value = useMemo<DocumentListContextValue>(
    () => ({
      documents,
      selectedIds,
      isSelected,
      toggleItem,
      toggleAll,
      clearSelection,
      allSelected,
      someSelected,
      getSelectedDocuments,
    }),
    [
      documents,
      selectedIds,
      isSelected,
      toggleItem,
      toggleAll,
      clearSelection,
      allSelected,
      someSelected,
      getSelectedDocuments,
    ]
  );

  return (
    <DocumentListContext.Provider value={value}>
      {children}
    </DocumentListContext.Provider>
  );
}

export function useDocumentListContext(): DocumentListContextValue {
  const ctx = useContext(DocumentListContext);
  if (!ctx) {
    throw new Error(
      "useDocumentListContext must be used within DocumentListProvider"
    );
  }
  return ctx;
}
