/**
 * Srcfull Landing Page
 *
 * This is a sample implementation of the new Srcfull design system.
 * To use: rename this file to page.tsx (backup the original first)
 */

import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Background effects */}
      <div className="pixel-grid" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-hero" />

      <div className="relative z-10">
        {/* Navigation */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-3">
            {/* Logo mark - concentric squares with S */}
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute inset-0 rounded-lg border border-[var(--accent)]/30" />
              <div className="absolute inset-1.5 rounded-md border border-[var(--accent)]/50" />
              <span className="font-display font-bold text-[var(--accent)] text-lg">
                S
              </span>
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">
              srcfull
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/docs"
              className="rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Docs
            </Link>
            <SignedIn>
              <Link
                href="/dashboard"
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-sm transition-all hover:border-[var(--border-hover)]"
              >
                Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="redirect">
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button
                  type="button"
                  className="btn-primary rounded-lg px-4 py-2 text-sm"
                >
                  Get started
                </button>
              </SignUpButton>
            </SignedOut>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
          <div className="stagger-children">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-glow-pulse" />
              <span className="text-[var(--text-secondary)]">
                Now processing 1M+ images/month
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold text-5xl tracking-tight md:text-6xl lg:text-7xl">
              Find the source.
              <br />
              <span className="text-gradient">Every time.</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--text-secondary)] leading-relaxed md:text-xl">
              Srcfull resolves image URLs to their highest-quality source
              versions. Built for production pipelines where quality matters.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/dashboard"
                className="btn-primary rounded-xl px-6 py-3 font-medium"
              >
                Get API Key
              </Link>
              <Link
                href="/docs"
                className="btn-secondary rounded-xl px-6 py-3 font-medium"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </section>

        {/* Visual Demo */}
        <section className="mx-auto max-w-4xl px-6 pb-20">
          <div className="card-shine rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              {/* Before */}
              <div className="text-center">
                <div className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  Input
                </div>
                <div className="relative mx-auto aspect-video w-full max-w-[200px] rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4">
                  <div className="absolute inset-4 rounded bg-gradient-to-br from-[var(--text-muted)]/20 to-[var(--text-muted)]/5 blur-sm" />
                  <div className="relative flex h-full items-center justify-center">
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      150x150
                    </span>
                  </div>
                </div>
                <code className="mt-3 block truncate font-mono text-xs text-[var(--text-muted)]">
                  /thumb_small.jpg
                </code>
              </div>

              {/* Arrow */}
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
                <svg
                  className="h-8 w-8 text-[var(--accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>

              {/* After */}
              <div className="text-center">
                <div className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
                  Output
                </div>
                <div className="relative mx-auto aspect-video w-full rounded-lg border border-[var(--border-accent)] bg-[var(--bg-primary)] p-4 glow-accent">
                  <div className="absolute inset-4 rounded bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5" />
                  <div className="relative flex h-full items-center justify-center">
                    <span className="font-mono text-sm text-[var(--accent)]">
                      2400x1600
                    </span>
                  </div>
                </div>
                <code className="mt-3 block truncate font-mono text-xs text-[var(--accent)]">
                  /original_full.jpg
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-12 text-center font-display font-semibold text-3xl">
            How it works
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Pattern Match",
                description:
                  "We match URLs against 1000+ known patterns for CDNs, image services, and common transformations.",
              },
              {
                step: "02",
                title: "Probe & Test",
                description:
                  "We test known transformations and verify they resolve to real, accessible images.",
              },
              {
                step: "03",
                title: "Return Best",
                description:
                  "You get the highest-resolution URL that actually works. Guaranteed.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card-hover rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6"
              >
                <div className="mb-4 font-mono text-sm text-[var(--accent)]">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-4 text-center font-display font-semibold text-3xl">
            Two endpoints. Full coverage.
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-[var(--text-secondary)]">
            Transform single URLs or scrape entire pages. Both return the
            highest-quality sources available.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Transform endpoint */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
              <div className="border-b border-[var(--border)] p-6">
                <h3 className="font-semibold text-xl">Transform</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Resolve a single image URL to its best-known source.
                </p>
              </div>
              <div className="code-block rounded-none border-0">
                <div className="code-header rounded-none border-t-0">
                  <span>
                    <span className="code-method">POST</span>{" "}
                    <span className="text-[var(--text-tertiary)]">
                      /api/v1/transform
                    </span>
                  </span>
                  <button
                    type="button"
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="code-content overflow-x-auto text-xs leading-relaxed">
                  <code>{`curl -X POST https://srcfull.dev/api/v1/transform \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/thumb.jpg"}'`}</code>
                </pre>
              </div>
            </div>

            {/* Scrape endpoint */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
              <div className="border-b border-[var(--border)] p-6">
                <h3 className="font-semibold text-xl">Scrape</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Extract all images from a webpage with resolved sources.
                </p>
              </div>
              <div className="code-block rounded-none border-0">
                <div className="code-header rounded-none border-t-0">
                  <span>
                    <span className="code-method">POST</span>{" "}
                    <span className="text-[var(--text-tertiary)]">
                      /api/v1/scrape
                    </span>
                  </span>
                  <button
                    type="button"
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="code-content overflow-x-auto text-xs leading-relaxed">
                  <code>{`curl -X POST https://srcfull.dev/api/v1/scrape \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/gallery"}'`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-2xl border border-[var(--border-accent)] bg-[var(--bg-secondary)] p-12 text-center glow-subtle">
            <h2 className="font-display font-semibold text-3xl">
              Ready to find the source?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--text-secondary)]">
              Start with 1,000 free requests. No credit card required.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/dashboard"
                className="btn-primary rounded-xl px-8 py-4 font-medium text-lg"
              >
                Get started free
              </Link>
              <Link
                href="/pricing"
                className="btn-secondary rounded-xl px-8 py-4 font-medium text-lg"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--border)] py-12">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-3">
                <div className="relative flex h-8 w-8 items-center justify-center">
                  <div className="absolute inset-0 rounded border border-[var(--accent)]/30" />
                  <span className="font-display font-bold text-[var(--accent)] text-sm">
                    S
                  </span>
                </div>
                <span className="font-display font-medium">srcfull</span>
              </div>

              <nav className="flex gap-6 text-sm text-[var(--text-muted)]">
                <Link
                  href="/docs"
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  Documentation
                </Link>
                <Link
                  href="/pricing"
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  Privacy
                </Link>
              </nav>

              <div className="text-sm text-[var(--text-muted)]">
                © {new Date().getFullYear()} Srcfull
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
