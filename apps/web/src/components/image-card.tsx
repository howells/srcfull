// apps/web/src/components/image-card.tsx
"use client";

import { useState } from "react";
import type { ResolveResult } from "@/lib/resolver";

type Props = {
  result: ResolveResult;
};

export function ImageCard({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.resolved);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied or not available
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
      <a
        className="block aspect-square"
        href={result.resolved}
        rel="noopener noreferrer"
        target="_blank"
      >
        {/* biome-ignore lint/performance/noImgElement: image URLs are user-provided and can be any domain */}
        <img
          alt="Resolved"
          className="h-full w-full object-cover"
          height={512}
          loading="lazy"
          src={result.resolved}
          width={512}
        />
      </a>

      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <a
          className="rounded bg-white px-3 py-1.5 font-medium text-black text-sm hover:bg-gray-100"
          href={result.resolved}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open
        </a>
        <button
          className="rounded bg-[var(--accent)] px-3 py-1.5 font-medium text-black text-sm hover:bg-[var(--accent-hover)]"
          onClick={handleCopy}
          type="button"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <div className="flex items-center gap-2 text-white/80 text-xs">
          <span className="rounded bg-white/20 px-1.5 py-0.5">
            {result.method}
          </span>
          {result.sizeIncrease && (
            <span className="text-green-400">+{result.sizeIncrease}</span>
          )}
        </div>
      </div>
    </div>
  );
}
