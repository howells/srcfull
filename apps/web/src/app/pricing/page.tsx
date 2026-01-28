import { PricingTable } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Subscribe to Beeline to access the image source resolver API.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <header className="mb-4">
          <Link
            className="text-[var(--text-muted)] text-sm transition-colors hover:text-[var(--text-primary)]"
            href="/"
          >
            &larr; Back
          </Link>
        </header>

        <div className="mb-12 text-center">
          <h1 className="font-bold text-4xl tracking-tight">Pricing</h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            Subscribe to unlock API key creation and access to the public API.
          </p>
        </div>

        <PricingTable />
      </div>
    </main>
  );
}
