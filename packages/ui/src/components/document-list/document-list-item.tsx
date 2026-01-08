"use client";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@repo/ui/components/item-list/item-list-item";
import { cn } from "@repo/ui/utils/cn";
import { Download } from "lucide-react";
import type * as React from "react";
import { useDocumentListContext } from "./document-list-context";
import type { DocumentItem } from "./document-list-types";
import { getIconForFile } from "./document-list-types";

export function DocumentListItem({
  document,
  onDownload,
  className,
  ...props
}: {
  document: DocumentItem;
  onDownload: (url: string) => void;
} & React.ComponentProps<typeof Item>) {
  const { isSelected, toggleItem } = useDocumentListContext();
  const Icon = getIconForFile(document);

  return (
    <Item className={cn("items-center", className)} {...props}>
      <div className="flex items-center gap-3">
        <Checkbox
          aria-label={`Select ${document.name}`}
          checked={isSelected(document.id)}
          onCheckedChange={() => toggleItem(document.id)}
        />
        <ItemMedia icon={Icon} variant="icon" />
      </div>
      <ItemContent className="min-w-0">
        <ItemTitle className="truncate">{document.name}</ItemTitle>
        {document.size ? (
          <ItemDescription className="truncate">
            File size: {document.size}
          </ItemDescription>
        ) : null}
      </ItemContent>
      <ItemActions>
        <Button
          appearance="ghost"
          aria-label={`Download ${document.name}`}
          mode="icon"
          onClick={() => onDownload(document.downloadUrl)}
          variant="outline"
        >
          <Download />
        </Button>
      </ItemActions>
    </Item>
  );
}
