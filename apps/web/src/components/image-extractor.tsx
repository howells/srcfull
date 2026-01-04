'use client';

import { useState } from 'react';
import { UrlForm } from './url-form';
import { ImageResults } from './image-results';

type ExtractionState = 'idle' | 'loading' | 'success' | 'error';

export function ImageExtractor() {
  const [state, setState] = useState<ExtractionState>('idle');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (url: string) => {
    setState('loading');
    setImages([]);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Extract images from: ${url}` }],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract images');
      }

      const extractedImages = data.images || [];
      setImages(extractedImages);
      setState(extractedImages.length > 0 ? 'success' : 'error');

      if (extractedImages.length === 0) {
        setError('No images found on this page');
      }
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="w-full">
      <UrlForm onSubmit={handleSubmit} isLoading={state === 'loading'} />

      {/* Loading state */}
      {state === 'loading' && (
        <div className="mt-12 animate-fade-in-up">
          <div className="flex flex-col items-center gap-4">
            {/* Animated loader */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)]/20" />
              <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-[var(--accent)]/20" />
              <div
                className="absolute inset-2 rounded-full border-2 border-[var(--accent)] border-b-transparent animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
              />
            </div>

            {/* Progress steps */}
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium text-[var(--text-primary)] animate-shimmer">
                Extracting images...
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Scraping page, finding images, validating URLs
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {state === 'success' && images.length > 0 && (
        <ImageResults images={images} />
      )}

      {/* Error/Empty state */}
      {state === 'error' && (
        <div className="mt-12 text-center animate-fade-in-up">
          <div className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div className="w-12 h-12 rounded-xl bg-[var(--error-bg)] flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--error)"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {error || 'No images found'}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Try a different URL or check if the page has visible images
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
