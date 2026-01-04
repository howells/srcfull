// apps/web/src/components/image-grid.tsx
'use client';

import { useState } from 'react';
import { ImageCard } from './image-card';
import type { ResolveResult } from '@/lib/resolver';

type Props = {
  results: ResolveResult[];
};

export function ImageGrid({ results }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    try {
      const urls = results.map(r => r.resolved).join('\n');
      await navigator.clipboard.writeText(urls);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied
    }
  };

  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          {results.length} image{results.length !== 1 ? 's' : ''} found
        </p>
        <button
          type="button"
          onClick={handleCopyAll}
          className="px-3 py-1.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border)] rounded hover:border-[var(--accent)] transition-colors"
        >
          {copied ? 'Copied!' : 'Copy All URLs'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((result) => (
          <ImageCard key={result.original} result={result} />
        ))}
      </div>
    </div>
  );
}
