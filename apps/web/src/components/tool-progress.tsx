'use client';

import { ShimmerText } from './shimmer-text';
import type { ToolInvocation } from 'ai';

interface ToolProgressProps {
  toolInvocations: ToolInvocation[];
}

const toolTitles: Record<string, string> = {
  scrapeWebpage: 'Fetching webpage',
  extractImageElements: 'Extracting image elements',
  analyzeRenderedSizes: 'Analyzing image sizes',
  findSourceUrl: 'Finding source URLs',
  validateImageUrl: 'Validating image URL',
  matchKnownPatterns: 'Checking known CDN patterns',
  learnPattern: 'Learning new pattern',
};

const toolIcons: Record<string, string> = {
  scrapeWebpage: '🌐',
  extractImageElements: '🔍',
  analyzeRenderedSizes: '📏',
  findSourceUrl: '🔗',
  validateImageUrl: '✓',
  matchKnownPatterns: '🎯',
  learnPattern: '🧠',
};

export function ToolProgress({ toolInvocations }: ToolProgressProps) {
  if (!toolInvocations || toolInvocations.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl space-y-2">
      {toolInvocations.map((tool, index) => {
        const title = toolTitles[tool.toolName] || tool.toolName;
        const icon = toolIcons[tool.toolName] || '⚙️';
        const isComplete = tool.state === 'result';
        const isPending = tool.state === 'call';

        return (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              isComplete
                ? 'bg-green-50 border-green-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="text-2xl">{icon}</div>
            <div className="flex-1">
              {isPending ? (
                <ShimmerText className="text-sm font-medium">
                  {title}...
                </ShimmerText>
              ) : (
                <div className="text-sm font-medium text-gray-700">
                  {title}
                </div>
              )}
            </div>
            <div className="text-xs">
              {isComplete ? (
                <span className="text-green-600 font-semibold">✓ Done</span>
              ) : (
                <ShimmerText className="text-blue-600">
                  Running...
                </ShimmerText>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
