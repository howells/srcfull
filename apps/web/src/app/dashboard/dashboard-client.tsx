"use client";

import { useCallback, useEffect, useState } from "react";

type ApiKey = {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
};

type UsageStats = {
  totalRequests: number;
  last24Hours: number;
  last7Days: number;
  byEndpoint: Record<string, number>;
};

export function ApiKeysSection() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingKey, setIsCreatingKey] = useState(false);

  const loadApiKeys = useCallback(async () => {
    try {
      const res = await fetch("/api/keys");
      if (res.ok) {
        const data = await res.json();
        setApiKeys(data.keys);
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    loadApiKeys();
  }, [loadApiKeys]);

  async function handleCreateKey(e: React.FormEvent) {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setIsCreatingKey(true);
    setError(null);

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create key");

      setNewlyCreatedKey(data.key);
      setNewKeyName("");
      loadApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key");
    } finally {
      setIsCreatingKey(false);
    }
  }

  async function handleDeleteKey(id: string) {
    // biome-ignore lint/suspicious/noAlert: intentional confirmation for destructive action
    if (!confirm("Are you sure you want to revoke this API key?")) return;

    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      if (res.ok) {
        setApiKeys(apiKeys.filter((k) => k.id !== id));
      }
    } catch {
      // Ignore
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div>
      {newlyCreatedKey && (
        <div className="mb-6 rounded-lg border border-[var(--success)]/20 bg-[var(--success-light)] p-4">
          <p className="mb-2 font-medium text-[var(--success)] text-sm">
            Key created! Copy it now — you won't see it again.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-[var(--bg-primary)] px-3 py-2 font-mono text-sm">
              {newlyCreatedKey}
            </code>
            <button
              className="btn-primary px-3 py-2 text-sm"
              onClick={() => copyToClipboard(newlyCreatedKey)}
              type="button"
            >
              Copy
            </button>
            <button
              className="px-3 py-2 text-[var(--text-tertiary)] text-sm hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setNewlyCreatedKey(null)}
              type="button"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <form className="mb-6 flex gap-3" onSubmit={handleCreateKey}>
        <input
          className="flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-sm focus:border-[var(--accent)] focus:outline-none transition-colors"
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="Key name (e.g., Production)"
          type="text"
          value={newKeyName}
        />
        <button
          className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
          disabled={isCreatingKey || !newKeyName.trim()}
          type="submit"
        >
          {isCreatingKey ? "Creating..." : "Create key"}
        </button>
      </form>

      {error && (
        <div className="mb-4 rounded-lg border border-[var(--error)]/20 bg-[var(--error-light)] p-3 text-[var(--error)] text-sm">
          {error}
        </div>
      )}

      {apiKeys.length === 0 ? (
        <p className="text-sm text-[var(--text-tertiary)]">No API keys yet.</p>
      ) : (
        <div className="code-block">
          <div className="code-header">
            <span className="font-mono">Keys</span>
            <span className="text-[var(--text-tertiary)]">
              {apiKeys.length} active
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-[var(--text-tertiary)]">
                  <th className="px-4 py-3 font-mono font-normal">Name</th>
                  <th className="px-4 py-3 font-mono font-normal">Key</th>
                  <th className="px-4 py-3 font-mono font-normal">Created</th>
                  <th className="px-4 py-3 font-mono font-normal">
                    Last used
                  </th>
                  <th className="px-4 py-3 font-mono font-normal text-right">
                    &nbsp;
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {apiKeys.map((key, i) => (
                  <tr
                    key={key.id}
                    className={
                      i < apiKeys.length - 1
                        ? "border-b border-[var(--border)]"
                        : ""
                    }
                  >
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                      {key.name}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-tertiary)]">
                      {key.keyPrefix}...
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {formatDate(key.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {key.lastUsedAt ? formatDate(key.lastUsedAt) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="text-[var(--text-tertiary)] text-xs hover:text-[var(--error)] transition-colors"
                        onClick={() => handleDeleteKey(key.id)}
                        type="button"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function UsageSection() {
  const [usage, setUsage] = useState<UsageStats | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/usage");
        if (res.ok) {
          const data = await res.json();
          setUsage(data);
        }
      } catch {
        // Ignore
      }
    }
    load();
  }, []);

  if (!usage) {
    return (
      <p className="text-sm text-[var(--text-tertiary)]">No usage data yet.</p>
    );
  }

  const endpoints = Object.entries(usage.byEndpoint);

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="font-mono">Requests</span>
        <span className="text-[var(--text-tertiary)]">
          {usage.totalRequests.toLocaleString()} total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[var(--text-tertiary)]">
              <th className="px-4 py-3 font-mono font-normal">Endpoint</th>
              <th className="px-4 py-3 font-mono font-normal text-right">
                24h
              </th>
              <th className="px-4 py-3 font-mono font-normal text-right">
                7d
              </th>
              <th className="px-4 py-3 font-mono font-normal text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {endpoints.length > 0 ? (
              endpoints.map(([endpoint, count], i) => (
                <tr
                  key={endpoint}
                  className={
                    i < endpoints.length - 1
                      ? "border-b border-[var(--border)]"
                      : ""
                  }
                >
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                    {endpoint}
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                    —
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                    —
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--text-primary)]">
                    {count.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-3 text-[var(--text-primary)]">All</td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                  {usage.last24Hours.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)]">
                  {usage.last7Days.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-[var(--text-primary)]">
                  {usage.totalRequests.toLocaleString()}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
