'use client';

import { useChat } from 'ai/react';
import { UrlForm } from './url-form';
import { ImageResults } from './image-results';
import { ToolProgress } from './tool-progress';

export function ImageExtractor() {
  const { messages, append, isLoading } = useChat({
    api: '/api/chat',
  });

  const handleSubmit = (url: string) => {
    append({
      role: 'user',
      content: `Extract all main images from this URL: ${url}`,
    });
  };

  // Extract URLs from the last assistant message
  const lastMessage = messages.filter(m => m.role === 'assistant').pop();
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;

  // Helper function to check if URL is definitely an image (strict validation)
  const isImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      const fullUrl = url.toLowerCase();

      // Check if it's a known image CDN (these don't always have file extensions)
      const isKnownImageCdn =
        fullUrl.includes('imageresizer.azureedge.net') ||
        fullUrl.includes('cloudinary.com') ||
        fullUrl.includes('imgix.net') ||
        fullUrl.includes('images.unsplash.com');

      // Must have an image extension in the path or query string, OR be from a known image CDN
      const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)(\?|$)/i.test(pathname);
      const hasFormatParam = /[?&]format=(jpg|jpeg|png|gif|webp|avif|bmp)/i.test(fullUrl);

      // Filter out obvious non-images
      const isNonImage =
        fullUrl.includes('.css') ||
        fullUrl.includes('.js') ||
        fullUrl.includes('.json') ||
        fullUrl.includes('/css/') ||
        fullUrl.includes('/js/') ||
        fullUrl.includes('/fonts/') ||
        pathname === '/' ||
        !pathname ||
        pathname.length < 5;

      return (hasImageExtension || hasFormatParam || isKnownImageCdn) && !isNonImage;
    } catch {
      return false;
    }
  };

  // Extract URLs from text content (agent's final response)
  const contentUrls = (lastMessage?.content.match(urlRegex) || [])
    .filter(isImageUrl);

  // Deduplicate
  const uniqueUrls = [...new Set(contentUrls)];

  // Get tool invocations for progress display
  const toolInvocations = lastMessage?.toolInvocations || [];
  const hasActiveTools = toolInvocations.some(t => t.state === 'call');

  return (
    <div className="w-full">
      <UrlForm onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Initial loading state */}
      {isLoading && messages.length === 0 && (
        <div className="mt-12 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)]/20" />
              <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
            </div>
            <span className="text-sm text-[var(--text-secondary)] animate-shimmer">
              Scraping webpage and extracting images...
            </span>
          </div>
        </div>
      )}

      {/* Tool progress */}
      {toolInvocations.length > 0 && (
        <ToolProgress toolInvocations={toolInvocations} />
      )}

      {/* Results */}
      {uniqueUrls.length > 0 && !hasActiveTools && (
        <ImageResults images={uniqueUrls} />
      )}

      {/* Empty state after completion */}
      {!isLoading && lastMessage && uniqueUrls.length === 0 && !hasActiveTools && (
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
                No images found
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
