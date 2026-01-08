// apps/web/src/components/comparison-view.tsx
"use client";

import { useState } from "react";
import type { ResolveResult } from "@/lib/resolver";

type Props = {
  result: ResolveResult;
};

export function ComparisonView({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.resolved);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied
    }
  };

  const isImproved = result.resolved !== result.original;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span
          className={`rounded px-2 py-1 font-medium text-xs ${
            result.method === "fallback"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {result.method}
        </span>
        {result.confidence && (
          <span className="text-[var(--text-muted)] text-xs">
            {Math.round(result.confidence * 100)}% confidence
          </span>
        )}
        {result.sizeIncrease && (
          <span className="text-green-400 text-xs">
            +{result.sizeIncrease} larger
          </span>
        )}
      </div>

      <div className={`grid gap-4 ${isImproved ? "md:grid-cols-2" : ""}`}>
        {isImproved && (
          <div className="space-y-2">
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-wide">
              Original
            </p>
            <div className="aspect-video overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
              {/* biome-ignore lint/performance/noImgElement: image URLs are user-provided and can be any domain */}
              <img
                alt="Original"
                className="h-full w-full object-contain"
                height={720}
                src={result.original}
                width={1280}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-[var(--text-muted)] text-xs uppercase tracking-wide">
            {isImproved ? "Resolved" : "Image"}
          </p>
          <div className="aspect-video overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
            {/* biome-ignore lint/performance/noImgElement: image URLs are user-provided and can be any domain */}
            <img
              alt={isImproved ? "Resolved" : "Image"}
              className="h-full w-full object-contain"
              height={720}
              src={result.resolved}
              width={1280}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          aria-label="Resolved image URL"
          className="flex-1 rounded border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 font-mono text-[var(--text-muted)] text-sm"
          readOnly
          type="text"
          value={result.resolved}
        />
        <button
          className="rounded bg-[var(--accent)] px-4 py-2 font-medium text-black transition-colors hover:bg-[var(--accent-hover)]"
          onClick={handleCopy}
          type="button"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <a
          aria-label="Open image in new tab"
          className="rounded border border-[var(--border)] px-4 py-2 transition-colors hover:border-[var(--accent)]"
          href={result.resolved}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open
        </a>
      </div>
    </div>
  );
}
