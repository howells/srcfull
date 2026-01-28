import { PricingTable } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Srcfull. Start free, scale as you grow.",
};

/**
 * Srcfull Pricing Page
 *
 * Features:
 * - Clean, centered layout
 * - Clerk PricingTable integration
 * - Custom styled pricing cards (if not using Clerk)
 * - Enterprise CTA section
 *
 * To use: rename to page.tsx
 */
export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Background effects */}
      <div className="pixel-grid" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-radial" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        {/* Back link */}
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to home
          </Link>
        </header>

        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="font-display font-bold text-4xl tracking-tight md:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--text-secondary)]">
            Start with 1,000 free requests. Scale as you grow. No hidden fees.
          </p>
        </div>

        {/* Clerk PricingTable - inherits theme from ClerkProvider */}
        <div className="mb-20">
          <PricingTable />
        </div>

        {/* Alternative: Custom pricing cards (uncomment if not using Clerk) */}
        {/* <PricingCards /> */}

        {/* Enterprise section */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 md:p-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2 className="font-display font-semibold text-2xl">
                Need more?
              </h2>
              <p className="mt-2 max-w-lg text-[var(--text-secondary)]">
                Enterprise plans include unlimited requests, dedicated support,
                SLA guarantees, and custom integrations.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-[var(--text-secondary)] sm:grid-cols-2">
                {[
                  "Unlimited requests",
                  "99.9% uptime SLA",
                  "Dedicated support",
                  "Custom patterns",
                  "Priority processing",
                  "Volume discounts",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-[var(--accent)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="mailto:enterprise@srcfull.dev"
              className="btn-secondary whitespace-nowrap rounded-xl px-6 py-3 font-medium"
            >
              Contact sales
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-20">
          <h2 className="mb-8 text-center font-display font-semibold text-2xl">
            Frequently asked questions
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6"
              >
                <h3 className="font-medium">{faq.question}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

const faqs = [
  {
    question: "What counts as a request?",
    answer:
      "Each call to the Transform or Scrape endpoint counts as one request. Scrape requests that return multiple images still count as a single request.",
  },
  {
    question: "Do unused requests roll over?",
    answer:
      "No, request allocations reset at the start of each billing cycle. We recommend choosing a plan that matches your typical monthly usage.",
  },
  {
    question: "Can I upgrade or downgrade anytime?",
    answer:
      "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the start of your next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) and can arrange invoicing for enterprise customers.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Every account starts with 1,000 free requests. No credit card required. This lets you test the API before committing to a paid plan.",
  },
  {
    question: "What happens if I exceed my limit?",
    answer:
      "Requests beyond your limit return a 429 status code. You can upgrade your plan or wait for the next billing cycle. We never charge overage fees without your consent.",
  },
];

/**
 * Custom Pricing Cards Component
 * Use this if you're not using Clerk's built-in PricingTable
 */
function PricingCards() {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "For side projects and testing",
      features: [
        "5,000 requests/month",
        "Transform endpoint only",
        "Email support",
        "7-day response time",
      ],
      cta: "Get started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For production applications",
      features: [
        "50,000 requests/month",
        "Transform + Scrape endpoints",
        "Priority support",
        "Webhook callbacks",
        "Custom pattern requests",
        "24-hour response time",
      ],
      cta: "Get started",
      highlighted: true,
    },
    {
      name: "Team",
      price: "$99",
      period: "/month",
      description: "For growing teams",
      features: [
        "250,000 requests/month",
        "All Pro features",
        "Multiple API keys",
        "Usage analytics",
        "Slack support channel",
        "4-hour response time",
      ],
      cta: "Get started",
      highlighted: false,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`rounded-2xl border p-8 ${
            plan.highlighted
              ? "border-[var(--border-accent)] bg-[var(--bg-secondary)] glow-subtle"
              : "border-[var(--border)] bg-[var(--bg-secondary)]"
          }`}
        >
          {plan.highlighted && (
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-subtle)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Most popular
            </div>
          )}

          <h3 className="font-display font-semibold text-xl">{plan.name}</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {plan.description}
          </p>

          <div className="mt-6">
            <span className="font-display font-bold text-4xl">{plan.price}</span>
            <span className="text-[var(--text-muted)]">{plan.period}</span>
          </div>

          <ul className="mt-6 space-y-3">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
              >
                <svg
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard"
            className={`mt-8 block w-full rounded-xl py-3 text-center font-medium ${
              plan.highlighted
                ? "btn-primary"
                : "btn-secondary"
            }`}
          >
            {plan.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}
