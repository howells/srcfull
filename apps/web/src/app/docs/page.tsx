import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "API reference for Srcfull. Authentication, endpoints, error codes, and rate limits.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="dot-grid" />

      <SiteHeader />

      <main className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-20">
        {/* Header */}
        <div className="space-y-6">
          <p className="text-sm font-mono text-[var(--text-tertiary)]">
            Documentation
          </p>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-balance leading-[1.1]">
            API Reference
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
            Get your API key from the{" "}
            <Link
              href="/dashboard"
              className="text-[var(--text-primary)] hover:underline"
            >
              dashboard
            </Link>
            .
            <br />
            All requests require a Bearer token.
          </p>
        </div>

        {/* Authentication */}
        <section className="mt-16">
          <div className="code-block">
            <div className="code-header">
              <span className="font-mono">Authentication</span>
              <span className="text-[var(--text-tertiary)]">cURL</span>
            </div>
            <div className="code-content">
              <pre>
                <code>curl -H "Authorization: Bearer sk_..."</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mt-16">
          <p className="text-sm font-mono text-[var(--text-tertiary)] mb-6">
            Endpoints
          </p>

          {/* Transform */}
          <div className="mb-12">
            <h2 className="font-medium mb-2">POST /api/v1/transform</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg mb-4">
              Resolve a single image URL to its full-resolution source.
            </p>

            <div className="space-y-4">
              <div className="code-block">
                <div className="code-header">
                  <span className="font-mono">Request</span>
                  <span className="text-[var(--text-tertiary)]">JSON</span>
                </div>
                <div className="code-content">
                  <pre>
                    <code>{`{
  "url": "https://example.com/image.jpg"
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="code-block">
                <div className="code-header">
                  <span className="font-mono">Response</span>
                  <span className="text-[var(--text-tertiary)]">JSON</span>
                </div>
                <div className="code-content">
                  <pre>
                    <code>{`{
  "success": true,
  "resolved": "https://cdn.example.com/full/image.jpg"
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Scrape */}
          <div>
            <h2 className="font-medium mb-2">POST /api/v1/scrape</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg mb-4">
              Extract all images from a webpage and resolve each to its
              full-resolution source.
            </p>

            <div className="space-y-4">
              <div className="code-block">
                <div className="code-header">
                  <span className="font-mono">Request</span>
                  <span className="text-[var(--text-tertiary)]">JSON</span>
                </div>
                <div className="code-content">
                  <pre>
                    <code>{`{
  "url": "https://example.com/gallery"
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="code-block">
                <div className="code-header">
                  <span className="font-mono">Response</span>
                  <span className="text-[var(--text-tertiary)]">JSON</span>
                </div>
                <div className="code-content">
                  <pre>
                    <code>{`{
  "success": true,
  "images": [
    "https://cdn.example.com/full/image1.jpg",
    "https://cdn.example.com/full/image2.jpg"
  ]
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Error Codes */}
        <section className="mt-16">
          <p className="text-sm font-mono text-[var(--text-tertiary)] mb-6">
            Error codes
          </p>

          <div className="code-block">
            <div className="code-header">
              <span className="font-mono">Errors</span>
              <span className="text-[var(--text-tertiary)]">reference</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-[var(--text-tertiary)]">
                    <th className="px-4 py-3 font-mono font-normal">Code</th>
                    <th className="px-4 py-3 font-mono font-normal">HTTP</th>
                    <th className="px-4 py-3 font-mono font-normal">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {errors.map((error, i) => (
                    <tr
                      key={error.code}
                      className={
                        i < errors.length - 1
                          ? "border-b border-[var(--border)]"
                          : ""
                      }
                    >
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                        {error.code}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">
                        {error.http}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">
                        {error.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mt-16">
          <p className="text-sm font-mono text-[var(--text-tertiary)] mb-4">
            Rate limits
          </p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg">
            Limits depend on your plan. See{" "}
            <Link
              href="/pricing"
              className="text-[var(--text-primary)] hover:underline"
            >
              pricing
            </Link>{" "}
            for details.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

const errors = [
  { code: "UNAUTHORIZED", http: "401", description: "Invalid or missing API key" },
  { code: "FORBIDDEN", http: "403", description: "Endpoint not included in plan" },
  { code: "INVALID_URL", http: "400", description: "URL is malformed or unreachable" },
  { code: "RATE_LIMITED", http: "429", description: "Request limit exceeded" },
  { code: "INTERNAL_ERROR", http: "500", description: "Server error, try again" },
];
