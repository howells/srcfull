import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";

export function SiteHeader({
  variant = "default",
}: {
  variant?: "default" | "dashboard";
}) {
  return (
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
        {variant === "dashboard" ? (
          <>
            <Link
              href="/docs"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Docs
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </>
        ) : (
          <>
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="btn-primary px-4 py-2 text-sm">
                  Get started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="btn-primary px-4 py-2 text-sm"
              >
                Dashboard
              </Link>
            </SignedIn>
          </>
        )}
      </nav>
    </header>
  );
}
