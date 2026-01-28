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
    <section>
      <h2 className="mb-6 font-semibold text-xl">API Keys</h2>

      {newlyCreatedKey && (
        <div className="mb-6 rounded-lg border border-[var(--success)]/20 bg-[var(--success-bg)] p-4">
          <p className="mb-2 font-medium text-[var(--success)] text-sm">
            Key created! Copy it now — you won't see it again.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-[var(--bg-primary)] px-3 py-2 font-mono text-sm">
              {newlyCreatedKey}
            </code>
            <button
              className="rounded bg-[var(--success)] px-3 py-2 font-medium text-black text-sm transition-opacity hover:opacity-90"
              onClick={() => copyToClipboard(newlyCreatedKey)}
              type="button"
            >
              Copy
            </button>
            <button
              className="px-3 py-2 text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)]"
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
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="Key name (e.g., Production)"
          type="text"
          value={newKeyName}
        />
        <button
          className="rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-black text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          disabled={isCreatingKey || !newKeyName.trim()}
          type="submit"
        >
          {isCreatingKey ? "Creating..." : "Create Key"}
        </button>
      </form>

      {error && (
        <div className="mb-4 rounded-lg border border-[var(--error)]/20 bg-[var(--error-bg)] p-3 text-[var(--error)] text-sm">
          {error}
        </div>
      )}

      {apiKeys.length === 0 ? (
        <p className="text-[var(--text-muted)] text-sm">No API keys yet.</p>
      ) : (
        <div className="space-y-2">
          {apiKeys.map((key) => (
            <div
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
              key={key.id}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{key.name}</span>
                  <code className="rounded bg-[var(--bg-primary)] px-2 py-1 text-[var(--text-muted)] text-xs">
                    {key.keyPrefix}...
                  </code>
                </div>
                <div className="mt-1 text-[var(--text-muted)] text-xs">
                  Created {formatDate(key.createdAt)}
                  {key.lastUsedAt &&
                    ` · Last used ${formatDate(key.lastUsedAt)}`}
                </div>
              </div>
              <button
                className="rounded px-3 py-1.5 text-[var(--error)] text-xs transition-colors hover:bg-[var(--error-bg)]"
                onClick={() => handleDeleteKey(key.id)}
                type="button"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
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

  return (
    <section>
      <h2 className="mb-6 font-semibold text-xl">Usage</h2>

      {usage ? (
        <>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <StatCard
              label="Total Requests"
              value={usage.totalRequests.toLocaleString()}
            />
            <StatCard
              label="Last 24 Hours"
              value={usage.last24Hours.toLocaleString()}
            />
            <StatCard
              label="Last 7 Days"
              value={usage.last7Days.toLocaleString()}
            />
          </div>

          {Object.keys(usage.byEndpoint).length > 0 && (
            <div>
              <h3 className="mb-3 font-medium text-[var(--text-secondary)] text-sm">
                By Endpoint
              </h3>
              <div className="space-y-1">
                {Object.entries(usage.byEndpoint).map(([endpoint, count]) => (
                  <div
                    className="flex items-center justify-between rounded bg-[var(--bg-secondary)] px-3 py-2 text-sm"
                    key={endpoint}
                  >
                    <span className="text-[var(--text-muted)]">{endpoint}</span>
                    <span className="text-[var(--text-primary)]">
                      {count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-[var(--text-muted)] text-sm">No usage data yet.</p>
      )}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
      <div className="font-bold text-2xl">{value}</div>
      <div className="mt-1 text-[var(--text-muted)] text-xs">{label}</div>
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
