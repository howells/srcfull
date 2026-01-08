"use client";

import { useState } from "react";

type Props = {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  placeholder?: string;
  buttonText?: string;
};

export function UrlInput({
  onSubmit,
  isLoading,
  placeholder,
  buttonText,
}: Props) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onSubmit(url.trim());
    }
  };

  return (
    <form className="flex gap-3" onSubmit={handleSubmit}>
      <input
        className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
        disabled={isLoading}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={placeholder ?? "Paste image or page URL..."}
        type="url"
        value={url}
      />
      <button
        className="rounded-lg bg-[var(--accent)] px-6 py-3 font-medium text-black transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!url.trim() || isLoading}
        type="submit"
      >
        {isLoading ? "Loading..." : (buttonText ?? "Go")}
      </button>
    </form>
  );
}
