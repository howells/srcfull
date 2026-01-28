import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { ApiKeysSection, UsageSection } from "./dashboard-client";

/**
 * Srcfull Dashboard Page
 *
 * Clean, functional dashboard with:
 * - Usage statistics
 * - API key management
 * - Quick links to docs
 *
 * To use: rename to page.tsx
 */
export default async function Dashboard() {
  const user = await getSession();
  const { has } = await auth();
  const isPro = user?.plan === "pro" || (has && has({ feature: "pro" }));

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute inset-0 rounded-lg border border-[var(--accent)]/30 animate-focus-pulse" />
              <span className="font-display font-bold text-[var(--accent)]">
                S
              </span>
            </div>
          </div>
          <h1 className="font-display font-bold text-2xl">Srcfull</h1>
          <p className="mt-2 text-[var(--text-muted)]">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Subtle background */}
      <div className="pixel-grid-dense" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <div className="absolute inset-0 rounded-lg border border-[var(--accent)]/30" />
                <div className="absolute inset-1.5 rounded-md border border-[var(--accent)]/50" />
                <span className="font-display font-bold text-[var(--accent)]">
                  S
                </span>
              </div>
            </Link>
            <div>
              <h1 className="font-display font-bold text-2xl">Dashboard</h1>
              <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/docs"
              className="rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Docs
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
            />
          </div>
        </header>

        {/* Content */}
        <div className="space-y-8">
          {/* Upgrade prompt for non-pro users */}
          {!isPro && (
            <section className="rounded-2xl border border-[var(--border-accent)] bg-[var(--bg-secondary)] p-8 glow-subtle">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-display font-semibold text-xl">
                    Subscription required
                  </h2>
                  <p className="mt-2 max-w-lg text-[var(--text-secondary)]">
                    Srcfull is a paid API. Subscribe to unlock API key creation
                    and access to the public endpoints.
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="btn-primary whitespace-nowrap rounded-xl px-6 py-3 font-medium"
                >
                  View pricing
                </Link>
              </div>
            </section>
          )}

          {/* Quick stats row */}
          {isPro && (
            <section className="grid gap-4 sm:grid-cols-3">
              <QuickStatCard
                label="Plan"
                value="Pro"
                accent
              />
              <QuickStatCard
                label="Requests this month"
                value="12,456"
              />
              <QuickStatCard
                label="Remaining"
                value="37,544"
              />
            </section>
          )}

          {/* Usage section */}
          {isPro && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display font-semibold text-xl">Usage</h2>
                <span className="text-sm text-[var(--text-muted)]">
                  Resets in 14 days
                </span>
              </div>
              <UsageSection />
            </section>
          )}

          {/* API Keys section */}
          {isPro && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
              <div className="mb-6">
                <h2 className="font-display font-semibold text-xl">API Keys</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Create and manage your API keys. Keep them secret!
                </p>
              </div>
              <ApiKeysSection />
            </section>
          )}

          {/* Quick reference */}
          {isPro && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
              <h2 className="mb-6 font-display font-semibold text-xl">
                Quick reference
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <QuickRefCard
                  method="POST"
                  endpoint="/api/v1/transform"
                  description="Resolve a single image URL"
                />
                <QuickRefCard
                  method="POST"
                  endpoint="/api/v1/scrape"
                  description="Extract all images from a webpage"
                />
              </div>
              <div className="mt-6">
                <Link
                  href="/docs"
                  className="text-sm text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors"
                >
                  View full documentation →
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function QuickStatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </div>
      <div
        className={`mt-1 font-display font-bold text-2xl ${
          accent ? "text-[var(--accent)]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function QuickRefCard({
  method,
  endpoint,
  description,
}: {
  method: string;
  endpoint: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4">
      <div className="flex items-center gap-2">
        <span className="rounded bg-[var(--accent)]/10 px-2 py-0.5 font-mono text-xs font-medium text-[var(--accent)]">
          {method}
        </span>
        <code className="font-mono text-sm text-[var(--text-primary)]">
          {endpoint}
        </code>
      </div>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{description}</p>
    </div>
  );
}
