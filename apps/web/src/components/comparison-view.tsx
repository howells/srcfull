// apps/web/src/components/comparison-view.tsx
'use client';

import { useState } from 'react';
import type { ResolveResult } from '@/lib/resolver';

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
        <span className={`px-2 py-1 text-xs font-medium rounded ${
          result.method === 'fallback'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-green-500/20 text-green-400'
        }`}>
          {result.method}
        </span>
        {result.confidence && (
          <span className="text-xs text-[var(--text-muted)]">
            {Math.round(result.confidence * 100)}% confidence
          </span>
        )}
        {result.sizeIncrease && (
          <span className="text-xs text-green-400">
            +{result.sizeIncrease} larger
          </span>
        )}
      </div>

      <div className={`grid gap-4 ${isImproved ? 'md:grid-cols-2' : ''}`}>
        {isImproved && (
          <div className="space-y-2">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Original</p>
            <div className="aspect-video bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
              <img
                src={result.original}
                alt="Original image"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
            {isImproved ? 'Resolved' : 'Image'}
          </p>
          <div className="aspect-video bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
            <img
              src={result.resolved}
              alt="Resolved image"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={result.resolved}
          readOnly
          aria-label="Resolved image URL"
          className="flex-1 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded text-sm text-[var(--text-muted)] font-mono"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 bg-[var(--accent)] text-black font-medium rounded hover:bg-[var(--accent-hover)] transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <a
          href={result.resolved}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open image in new tab"
          className="px-4 py-2 border border-[var(--border)] rounded hover:border-[var(--accent)] transition-colors"
        >
          Open
        </a>
      </div>
    </div>
  );
}
