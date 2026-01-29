import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Subtle dot grid */}
      <div className="dot-grid" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link href="/" className="text-lg font-medium tracking-tight">
          srcfull
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/pricing"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Pricing
          </Link>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="btn-primary px-4 py-2 text-sm">
                Get started
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="btn-primary px-4 py-2 text-sm">
              Dashboard
            </Link>
          </SignedIn>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-20">
        <div className="space-y-6">
          <p className="text-sm font-mono text-[var(--text-tertiary)]">
            Image extraction API
          </p>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-balance leading-[1.1]">
            Every image, any URL.
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
            Point us at any webpage. Get back every image at its highest
            resolution. One API call.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="btn-primary px-5 py-2.5 text-sm">
                  Get API key
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="btn-primary px-5 py-2.5 text-sm">
                Go to dashboard
              </Link>
            </SignedIn>
            <Link
              href="#example"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              See example →
            </Link>
          </div>
        </div>

        {/* Code Example */}
        <div id="example" className="mt-20">
          <div className="code-block">
            <div className="code-header">
              <span className="font-mono">POST /api/v1/scrape</span>
              <span className="text-[var(--text-tertiary)]">cURL</span>
            </div>
            <div className="code-content">
              <pre className="text-[var(--text-primary)] whitespace-pre-wrap">
                {`curl -X POST https://srcfull.dev/api/v1/scrape \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/gallery"}'`}
              </pre>
            </div>
          </div>

          <div className="mt-4 code-block">
            <div className="code-header">
              <span className="font-mono">Response</span>
              <span className="text-[var(--text-tertiary)]">JSON</span>
            </div>
            <div className="code-content">
              <pre className="text-[var(--text-primary)] whitespace-pre-wrap">
                {`{
  "success": true,
  "url": "https://example.com/gallery",
  "images": [
    { "original": "/thumb_1.jpg", "resolved": "/full_1.jpg" },
    { "original": "/thumb_2.jpg", "resolved": "/full_2.jpg" },
    { "original": "/thumb_3.jpg", "resolved": "/full_3.jpg" }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-medium mb-2">Full page extraction</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Point at any webpage. We find every image and return the
              highest-resolution version available.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">50+ CDN patterns</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Shopify, Cloudinary, Imgix, WordPress, Unsplash — we know how to
              get the originals from all the major CDNs.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">One endpoint</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              No configuration. No SDK. Just POST a URL and get back JSON with
              every image at its best.
            </p>
          </div>
        </div>

        {/* Supported CDNs */}
        <div className="mt-24">
          <p className="text-sm text-[var(--text-tertiary)] mb-4">Works with</p>
          <div className="flex flex-wrap gap-3">
            {[
              "Shopify",
              "Cloudinary",
              "Imgix",
              "WordPress",
              "Unsplash",
              "Contentful",
              "Sanity",
              "Cloudflare",
            ].map((cdn) => (
              <span key={cdn} className="badge">
                {cdn}
              </span>
            ))}
            <span className="badge">+40 more</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border)] mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <p className="text-sm text-[var(--text-tertiary)]">srcfull</p>
          <div className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
