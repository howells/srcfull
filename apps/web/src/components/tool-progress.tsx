'use client';

import type { ToolInvocation } from 'ai';
import type { ReactNode } from 'react';

interface ToolProgressProps {
  toolInvocations: ToolInvocation[];
}

const toolMeta: Record<string, { label: string; icon: ReactNode }> = {
  scrapeWebpage: {
    label: 'Fetching webpage',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  extractImageElements: {
    label: 'Extracting images',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21,15 16,10 5,21" />
      </svg>
    ),
  },
  analyzeRenderedSizes: {
    label: 'Analyzing sizes',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 21H3V3" />
        <path d="M21 9l-6 6-4-4-6 6" />
      </svg>
    ),
  },
  matchKnownPatterns: {
    label: 'Matching patterns',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  findSourceUrl: {
    label: 'Finding source URL',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  validateImageUrl: {
    label: 'Validating URL',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22,4 12,14.01 9,11.01" />
      </svg>
    ),
  },
  learnPattern: {
    label: 'Learning pattern',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" />
        <path d="M12 22a4 4 0 0 1-4-4c0-1.95 1.4-3.58 3.25-3.93" />
        <path d="M18.5 12a4 4 0 0 1-4 4c-1.95 0-3.58-1.4-3.93-3.25" />
        <path d="M5.5 12a4 4 0 0 1 4-4c1.95 0 3.58 1.4 3.93 3.25" />
      </svg>
    ),
  },
};

function getToolMeta(toolName: string): { label: string; icon: ReactNode } {
  return toolMeta[toolName] || {
    label: toolName,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  };
}

export function ToolProgress({ toolInvocations }: ToolProgressProps) {
  if (!toolInvocations || toolInvocations.length === 0) {
    return null;
  }

  // Group and deduplicate - show unique tool types with their latest state
  const uniqueTools = new Map<string, ToolInvocation>();
  toolInvocations.forEach((tool) => {
    const existing = uniqueTools.get(tool.toolName);
    // Keep the one that's 'result' if available, otherwise the latest
    if (!existing || tool.state === 'result') {
      uniqueTools.set(tool.toolName, tool);
    }
  });

  const tools = Array.from(uniqueTools.values());
  const hasActiveTools = tools.some((t) => t.state === 'call');
  const completedCount = tools.filter((t) => t.state === 'result').length;

  return (
    <div className="w-full mt-10 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">
          {hasActiveTools ? (
            <span className="animate-shimmer">Processing...</span>
          ) : (
            'Extraction complete'
          )}
        </h3>
        <span className="text-xs text-[var(--text-muted)]">
          {completedCount}/{tools.length} steps
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[var(--bg-elevated)] rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-500 ease-out"
          style={{ width: `${(completedCount / tools.length) * 100}%` }}
        />
      </div>

      {/* Tool list */}
      <div className="space-y-2">
        {tools.map((tool, index) => {
          const meta = getToolMeta(tool.toolName);
          const isComplete = tool.state === 'result';
          const isActive = tool.state === 'call';

          return (
            <div
              key={`${tool.toolName}-${index}`}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                border transition-all duration-300
                ${isComplete
                  ? 'bg-[var(--success-bg)] border-[var(--success)]/20'
                  : isActive
                    ? 'bg-[var(--accent-subtle)] border-[var(--border-accent)]'
                    : 'bg-[var(--bg-secondary)] border-[var(--border)]'
                }
              `}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Icon */}
              <div
                className={`
                  flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                  transition-colors duration-300
                  ${isComplete
                    ? 'bg-[var(--success)]/20 text-[var(--success)]'
                    : isActive
                      ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                      : 'bg-[var(--bg-hover)] text-[var(--text-muted)]'
                  }
                `}
              >
                {isComplete ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="animate-scale-in"
                  >
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                ) : (
                  meta.icon
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  flex-1 text-sm font-medium
                  ${isComplete
                    ? 'text-[var(--success)]'
                    : isActive
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)]'
                  }
                `}
              >
                {meta.label}
              </span>

              {/* Status indicator */}
              {isActive && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  <span className="text-xs text-[var(--accent)]">Running</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
