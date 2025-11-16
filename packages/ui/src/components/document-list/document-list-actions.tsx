 "use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/utils/cn";
import { Download } from "lucide-react";
import type * as React from "react";
import { useDocumentListContext } from "./document-list-context";

export function DocumentListActions({
  onBulkDownload,
  className,
  ...props
}: {
  onBulkDownload: (urls: string[]) => void;
} & React.ComponentProps<"div">) {
  const { getSelectedDocuments, selectedIds } = useDocumentListContext();
  const selected = selectedIds.size;
  const disabled = selected === 0;

  const handleBulk = () => {
    const urls = getSelectedDocuments().map((d) => d.downloadUrl);
    onBulkDownload(urls);
  };

  return (
    <div
      className={cn("mt-3", className)}
      data-component="document-list-actions"
      {...props}
    >
      <Button
        className="w-full rounded-xl"
        variant="outline"
        size="lg"
        onClick={handleBulk}
        disabled={disabled}
      >
        <Download />
        Download selected items{selected > 0 ? ` (${selected})` : ""}
      </Button>
    </div>
  );
}
