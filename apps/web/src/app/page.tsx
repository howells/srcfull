import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="hex-grid" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-radial" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] font-black text-black text-lg">
              B
            </div>
            <div>
              <div className="font-semibold leading-tight">Beeline</div>
              <div className="text-[var(--text-muted)] text-xs leading-tight">
                Image source resolver API
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SignedIn>
              <Link
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-sm transition-colors hover:border-[var(--border-hover)]"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="redirect">
                <button
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-sm transition-colors hover:border-[var(--border-hover)]"
                  type="button"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button
                  className="rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-black text-sm transition-opacity hover:opacity-90"
                  type="button"
                >
                  Get started
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </header>

        <section className="mt-16 max-w-3xl">
          <h1 className="font-bold text-5xl tracking-tight">
            Get the source.
            <span className="text-[var(--text-secondary)]">
              {" "}
              Skip the resizing.
            </span>
          </h1>
          <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
            Beeline resolves image URLs to their highest-quality source versions
            using curated patterns, learned transformations, and probing. It's
            built for production pipelines where "close enough" is not enough.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-3 font-medium transition-colors hover:border-[var(--border-hover)]"
              href="/dashboard"
            >
              Get an API key
            </Link>
            <Link
              className="rounded-xl bg-[var(--accent)] px-5 py-3 font-medium text-black transition-opacity hover:opacity-90"
              href="/pricing"
            >
              View pricing
            </Link>
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <h2 className="font-semibold text-lg">Transform</h2>
            <p className="mt-2 text-[var(--text-muted)] text-sm">
              Resolve a single image URL to its best-known source URL.
            </p>
            <pre className="mt-4 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4 text-xs leading-relaxed">
              <code>{`curl -X POST https://YOUR_DOMAIN/api/v1/transform \\\n  -H "Authorization: Bearer sk_live_…" \\\n  -H "Content-Type: application/json" \\\n  -d '{"url":"https://example.com/image.jpg"}'`}</code>
            </pre>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <h2 className="font-semibold text-lg">Scrape</h2>
            <p className="mt-2 text-[var(--text-muted)] text-sm">
              Scrape a webpage and return resolved image URLs (with metadata).
            </p>
            <pre className="mt-4 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4 text-xs leading-relaxed">
              <code>{`curl -X POST https://YOUR_DOMAIN/api/v1/scrape \\\n  -H "Authorization: Bearer sk_live_…" \\\n  -H "Content-Type: application/json" \\\n  -d '{"url":"https://example.com"}'`}</code>
            </pre>
          </div>
        </section>

        <footer className="mt-16 text-[var(--text-muted)] text-sm">
          © {new Date().getFullYear()} Beeline. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
