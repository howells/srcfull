'use client';

import { useChat } from 'ai/react';
import { UrlForm } from './url-form';
import { ImageResults } from './image-results';

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

  // Helper function to check if URL looks like an image
  const isLikelyImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      // Check for image extensions or common image CDN patterns
      return (
        pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?|$)/i) !== null ||
        url.includes('/images/') ||
        url.includes('/img/') ||
        url.includes('cdn') ||
        url.includes('cloudinary') ||
        url.includes('imgix')
      );
    } catch {
      return false;
    }
  };

  // Extract URLs from message content
  const contentUrls = (lastMessage?.content.match(urlRegex) || [])
    .filter(isLikelyImageUrl);

  // Extract URLs from tool invocations results
  const toolUrls: string[] = [];
  if (lastMessage?.toolInvocations) {
    for (const invocation of lastMessage.toolInvocations) {
      if (invocation.state === 'result' && invocation.result) {
        // Convert result to string and extract URLs
        const resultStr = JSON.stringify(invocation.result);
        const urls = (resultStr.match(urlRegex) || []).filter(isLikelyImageUrl);
        toolUrls.push(...urls);
      }
    }
  }

  // Combine all URLs and deduplicate
  const allUrls = [...contentUrls, ...toolUrls];
  const uniqueUrls = [...new Set(allUrls)];

  return (
    <div className="flex flex-col items-center w-full">
      <UrlForm onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Show agent progress during development */}
      {process.env.NODE_ENV === 'development' && messages.length > 0 && (
        <div className="w-full max-w-2xl mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Agent Progress:</h3>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {message.role}
              </div>
              <div className="text-sm whitespace-pre-wrap">
                {message.content}
              </div>
              {message.toolInvocations && message.toolInvocations.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.toolInvocations.map((tool, toolIndex) => (
                    <div
                      key={toolIndex}
                      className="p-2 bg-white rounded border border-gray-200"
                    >
                      <div className="text-xs font-mono text-purple-600">
                        {tool.toolName}
                      </div>
                      {tool.state === 'result' && (
                        <div className="mt-1 text-xs text-gray-600">
                          Complete
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Show final results */}
      <ImageResults images={uniqueUrls} />
    </div>
  );
}
