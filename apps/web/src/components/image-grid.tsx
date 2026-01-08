// apps/web/src/components/image-grid.tsx
"use client";

import { useState } from "react";
import type { ResolveResult } from "@/lib/resolver";
import { ImageCard } from "./image-card";

type Props = {
  results: ResolveResult[];
};

export function ImageGrid({ results }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    try {
      const urls = results.map((r) => r.resolved).join("\n");
      await navigator.clipboard.writeText(urls);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied
    }
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[var(--text-muted)] text-sm">
          {results.length} image{results.length !== 1 ? "s" : ""} found
        </p>
        <button
          className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-sm transition-colors hover:border-[var(--accent)]"
          onClick={handleCopyAll}
          type="button"
        >
          {copied ? "Copied!" : "Copy All URLs"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {results.map((result) => (
          <ImageCard key={result.original} result={result} />
        ))}
      </div>
    </div>
  );
}
