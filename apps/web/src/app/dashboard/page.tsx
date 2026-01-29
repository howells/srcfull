import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ApiKeysSection, UsageSection } from "./dashboard-client";

export default async function Dashboard() {
  const user = await getSession();
  const { has } = await auth();
  const isPro = user?.plan === "pro" || (has && has({ feature: "pro" }));

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <div className="dot-grid" />
        <SiteHeader />
        <main className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-20">
          <p className="text-sm font-mono text-[var(--text-tertiary)]">
            Dashboard
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
            Loading...
          </h1>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="dot-grid" />

      <SiteHeader variant="dashboard" />

      <main className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-20">
        {!isPro ? (
          <>
            <div className="space-y-6">
              <p className="text-sm font-mono text-[var(--text-tertiary)]">
                Dashboard
              </p>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-balance leading-[1.1]">
                Get started
              </h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
                Srcfull is a paid API. Subscribe to unlock API key creation and
                access to the public endpoints.
              </p>
              <div className="pt-4">
                <Link href="/pricing" className="btn-primary px-5 py-2.5 text-sm">
                  View pricing
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Page heading */}
            <div className="space-y-6">
              <p className="text-sm font-mono text-[var(--text-tertiary)]">
                Dashboard
              </p>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
                {user.email}
              </h1>
            </div>

            {/* Plan overview */}
            <div className="mt-16 code-block">
              <div className="code-header">
                <span className="font-mono">Plan</span>
                <span className="text-[var(--text-tertiary)]">current</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left text-[var(--text-tertiary)]">
                      <th className="px-4 py-3 font-mono font-normal">Plan</th>
                      <th className="px-4 py-3 font-mono font-normal">
                        Requests
                      </th>
                      <th className="px-4 py-3 font-mono font-normal text-right">
                        Remaining
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                        Pro
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">
                        12,456 / 50,000
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--text-primary)]">
                        37,544
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* API Keys */}
            <div className="mt-24">
              <p className="text-sm font-mono text-[var(--text-tertiary)] mb-6">
                API keys
              </p>
              <ApiKeysSection />
            </div>

            {/* Usage */}
            <div className="mt-24">
              <p className="text-sm font-mono text-[var(--text-tertiary)] mb-6">
                Usage
              </p>
              <UsageSection />
            </div>

            {/* Quick reference */}
            <div className="mt-24">
              <p className="text-sm font-mono text-[var(--text-tertiary)] mb-6">
                Quick reference
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="card p-4">
                  <div className="flex items-center gap-2">
                    <span className="badge-accent font-mono text-xs">POST</span>
                    <code className="font-mono text-sm">/api/v1/transform</code>
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Resolve a single image URL
                  </p>
                </div>
                <div className="card p-4">
                  <div className="flex items-center gap-2">
                    <span className="badge-accent font-mono text-xs">POST</span>
                    <code className="font-mono text-sm">/api/v1/scrape</code>
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Extract all images from a webpage
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/docs"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  View full documentation →
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
