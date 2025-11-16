 "use client";

import { Checkbox } from "@materia/ui/components/checkbox";
import { cn } from "@materia/ui/utils/cn";
import type * as React from "react";
import { useDocumentListContext } from "./document-list-context";

export function DocumentListHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { documents, allSelected, someSelected, toggleAll, selectedIds } =
    useDocumentListContext();

  const total = documents.length;
  const selected = selectedIds.size;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3",
        className
      )}
      data-component="document-list-header"
      {...props}
    >
      <label className="flex cursor-pointer items-center gap-3">
        <Checkbox
          checked={allSelected ? true : someSelected ? ("indeterminate" as const) : false}
          onCheckedChange={() => toggleAll()}
          aria-label="Select all documents"
        />
        <span className="text-sm">
          {selected > 0 ? `${selected} selected` : `Select All (${total} items)`}
        </span>
      </label>
    </div>
  );
}
