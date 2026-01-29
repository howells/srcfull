import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Srcfull. Start free, scale as you grow.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="dot-grid" />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
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

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-20">
        <div className="space-y-6">
          <p className="text-sm font-mono text-[var(--text-tertiary)]">
            Plans
          </p>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-balance leading-[1.1]">
            Pricing
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
            10 free Transform requests. No credit card.
            <br />
            Upgrade when you need more.
          </p>
        </div>

        {/* Pricing table */}
        <div className="mt-16 code-block">
          <div className="code-header">
            <span className="font-mono">Plans</span>
            <span className="text-[var(--text-tertiary)]">monthly</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-[var(--text-tertiary)]">
                  <th className="px-4 py-3 font-mono font-normal">Plan</th>
                  <th className="px-4 py-3 font-mono font-normal">Requests</th>
                  <th className="px-4 py-3 font-mono font-normal">Endpoints</th>
                  <th className="px-4 py-3 font-mono font-normal text-right">Price</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {plans.map((plan, i) => (
                  <tr
                    key={plan.name}
                    className={
                      i < plans.length - 1
                        ? "border-b border-[var(--border)]"
                        : ""
                    }
                  >
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                      {plan.name}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {plan.requests}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {plan.endpoints}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--text-primary)]">
                      {plan.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          All paid plans include priority support and custom pattern requests.
        </p>

        <div className="mt-6 flex items-center gap-4">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="btn-primary px-5 py-2.5 text-sm">
                Get started
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="btn-primary px-5 py-2.5 text-sm">
              Go to dashboard
            </Link>
          </SignedIn>
        </div>

        {/* Enterprise */}
        <div className="mt-24">
          <h2 className="font-medium mb-2">Need something bigger?</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg">
            Enterprise includes unlimited requests, 99.9% SLA,
            and dedicated support.
          </p>
          <Link
            href="mailto:enterprise@srcfull.dev"
            className="mt-3 inline-block text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            enterprise@srcfull.dev →
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-24">
          <p className="text-sm font-mono text-[var(--text-tertiary)] mb-6">
            Common questions
          </p>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-medium mb-1">{faq.question}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
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

const plans = [
  {
    name: "Free",
    requests: "10/mo",
    endpoints: "Transform",
    price: "$0",
  },
  {
    name: "Starter",
    requests: "1,000/mo",
    endpoints: "Transform",
    price: "$19/mo",
  },
  {
    name: "Pro",
    requests: "10,000/mo",
    endpoints: "Transform + Scrape",
    price: "$49/mo",
  },
  {
    name: "Scale",
    requests: "50,000/mo",
    endpoints: "Transform + Scrape",
    price: "$149/mo",
  },
];

const faqs = [
  {
    question: "What counts as a request?",
    answer:
      "Each call to Transform or Scrape counts as one request. Multiple images returned from a single scrape still count as one.",
  },
  {
    question: "Do unused requests roll over?",
    answer:
      "No. Allocations reset each billing cycle.",
  },
  {
    question: "What if I exceed my limit?",
    answer:
      "You'll get a 429. Upgrade or wait for the next cycle. No surprise charges.",
  },
  {
    question: "Can I change plans?",
    answer:
      "Upgrades are instant. Downgrades take effect next cycle.",
  },
];
