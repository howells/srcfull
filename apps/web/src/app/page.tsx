// apps/web/src/app/page.tsx
'use client';

import { useState } from 'react';
import { UrlInput } from '@/components/url-input';
import { ComparisonView } from '@/components/comparison-view';
import { ImageGrid } from '@/components/image-grid';
import type { ResolveResult } from '@/lib/resolver';

type Mode = 'transform' | 'scrape';

export default function Home() {
  const [mode, setMode] = useState<Mode>('transform');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transformResult, setTransformResult] = useState<ResolveResult | null>(null);
  const [scrapeResults, setScrapeResults] = useState<ResolveResult[]>([]);

  const handleTransform = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setTransformResult(null);

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to transform URL');
      }

      setTransformResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrape = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setScrapeResults([]);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape page');
      }

      setScrapeResults(data.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Beeline</h1>
          <p className="text-[var(--text-muted)]">
            Get the source. Skip the resizing.
          </p>
        </header>

        <div className="space-y-6">
          {/* Mode Toggle */}
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setMode('transform')}
              aria-pressed={mode === 'transform'}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'transform'
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Single URL
            </button>
            <button
              type="button"
              onClick={() => setMode('scrape')}
              aria-pressed={mode === 'scrape'}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'scrape'
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Scrape Page
            </button>
          </div>

          {/* Input */}
          <UrlInput
            onSubmit={mode === 'transform' ? handleTransform : handleScrape}
            isLoading={isLoading}
            placeholder={
              mode === 'transform'
                ? 'Paste an image URL...'
                : 'Paste a webpage URL...'
            }
            buttonText={mode === 'transform' ? 'Get Source' : 'Extract All'}
          />

          {/* Error */}
          {error && (
            <div role="alert" className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Results */}
          {mode === 'transform' && transformResult && (
            <ComparisonView result={transformResult} />
          )}

          {mode === 'scrape' && scrapeResults.length > 0 && (
            <ImageGrid results={scrapeResults} />
          )}
        </div>
      </div>
    </main>
  );
}
