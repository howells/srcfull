'use client';

import { useState } from 'react';

type Props = {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  placeholder?: string;
  buttonText?: string;
};

export function UrlInput({ onSubmit, isLoading, placeholder, buttonText }: Props) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={placeholder ?? 'Paste image or page URL...'}
        className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!url.trim() || isLoading}
        className="px-6 py-3 bg-[var(--accent)] text-black font-medium rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Loading...' : buttonText ?? 'Go'}
      </button>
    </form>
  );
}
