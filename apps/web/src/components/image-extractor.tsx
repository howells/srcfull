'use client';

import { useChat } from 'ai/react';
import { UrlForm } from './url-form';
import { ImageResults } from './image-results';
import { ToolProgress } from './tool-progress';
import { ShimmerText } from './shimmer-text';

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
    <div className="flex flex-col items-center w-full gap-8">
      <UrlForm onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Show loading state when processing but no messages yet */}
      {isLoading && messages.length === 0 && (
        <div className="w-full max-w-2xl">
          <ShimmerText className="text-lg">
            Scraping webpage and extracting images...
          </ShimmerText>
        </div>
      )}

      {/* Show tool progress when agent is resolving URLs */}
      {toolInvocations.length > 0 && (
        <div className="w-full max-w-2xl">
          <h3 className="text-lg font-semibold mb-4">
            {hasActiveTools ? (
              <ShimmerText>Resolving clean image URLs...</ShimmerText>
            ) : (
              'URL resolution complete'
            )}
          </h3>
          <ToolProgress toolInvocations={toolInvocations} />
        </div>
      )}

      {/* Show final results */}
      {uniqueUrls.length > 0 && (
        <ImageResults images={uniqueUrls} />
      )}
    </div>
  );
}
