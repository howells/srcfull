import Link from "next/link";

export function SiteFooter() {
  return (
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
          <Link
            href="/docs"
            className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Docs
          </Link>
        </div>
      </div>
    </footer>
  );
}
