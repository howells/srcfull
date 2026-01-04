// apps/web/src/components/image-card.tsx
'use client';

import { useState } from 'react';
import type { ResolveResult } from '@/lib/resolver';

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
    <div className="group relative bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
      <a
        href={result.resolved}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-square"
      >
        <img
          src={result.resolved}
          alt="Resolved image"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </a>

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <a
          href={result.resolved}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-white text-black text-sm font-medium rounded hover:bg-gray-100"
        >
          Open
        </a>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-[var(--accent)] text-black text-sm font-medium rounded hover:bg-[var(--accent-hover)]"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-2 text-xs text-white/80">
          <span className="px-1.5 py-0.5 bg-white/20 rounded">
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
