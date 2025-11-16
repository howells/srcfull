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
  const extractedUrls = lastMessage?.content.match(urlRegex) || [];
  const uniqueUrls = [...new Set(extractedUrls)];

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
