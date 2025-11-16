 "use client";

import { ItemList } from "@repo/ui/components/item-list/item-list-root";
import type * as React from "react";
import { DocumentListProvider } from "./document-list-context";
import { DocumentListActions } from "./document-list-actions";
import { DocumentListHeader } from "./document-list-header";
import { DocumentListItem } from "./document-list-item";
import type { DocumentItem } from "./document-list-types";

export type DocumentListProps = {
  documents: readonly DocumentItem[];
  onDownload?: (url: string) => void;
  onBulkDownload?: (urls: string[]) => void;
  variant?: React.ComponentProps<typeof ItemList>["variant"];
};

function defaultSingleDownload(url: string) {
  try {
    const link = document.createElement("a");
    link.href = url;
    link.rel = "noopener";
    link.target = "_blank";
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    // swallow
  }
}

function defaultBulkDownload(urls: string[]) {
  // Naive default: open each in a new tab
  for (const url of urls) {
    defaultSingleDownload(url);
  }
}

export function DocumentList({
  documents,
  onDownload = defaultSingleDownload,
  onBulkDownload = defaultBulkDownload,
  variant = "divided",
}: DocumentListProps) {
  return (
    <DocumentListProvider documents={documents}>
      <div data-component="document-list" data-slot="document-list">
        <DocumentListHeader />
        <ItemList className="mt-3" variant={variant}>
          {documents.map((doc) => (
            <DocumentListItem
              key={doc.id}
              document={doc}
              onDownload={onDownload}
            />
          ))}
        </ItemList>
        <DocumentListActions onBulkDownload={onBulkDownload} />
      </div>
    </DocumentListProvider>
  );
}
