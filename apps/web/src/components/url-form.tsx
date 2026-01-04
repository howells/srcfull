'use client';

import { useState } from 'react';

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    if (url) {
      onSubmit(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`
          relative flex items-center gap-3 p-2 rounded-2xl
          border transition-all duration-300
          ${isFocused
            ? 'border-[var(--border-accent)] bg-[var(--bg-elevated)] shadow-[0_0_0_4px_var(--accent-glow)]'
            : 'border-[var(--border)] bg-[var(--bg-secondary)]'
          }
          ${isLoading ? 'animate-border-glow' : ''}
        `}
      >
        {/* URL icon */}
        <div className="pl-3 text-[var(--text-muted)]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>

        <input
          type="url"
          name="url"
          placeholder="Paste a URL to extract images..."
          required
          disabled={isLoading}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="
            flex-1 py-3 bg-transparent text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)]
            focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
            text-base
          "
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`
            relative px-6 py-3 rounded-xl font-medium text-sm
            transition-all duration-300
            disabled:cursor-not-allowed
            ${isLoading
              ? 'bg-[var(--bg-hover)] text-[var(--text-tertiary)]'
              : 'bg-[var(--accent)] text-[var(--bg-primary)] hover:brightness-110 active:scale-[0.98]'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Extracting...
            </span>
          ) : (
            'Extract'
          )}
        </button>
      </div>

      {/* Helper text */}
      <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
        Works with product pages, blogs, portfolios, and more
      </p>
    </form>
  );
}
