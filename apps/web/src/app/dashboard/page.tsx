import { auth } from "@clerk/nextjs/server";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { ApiKeysSection, UsageSection } from "./dashboard-client";

export default async function Dashboard() {
  const user = await getSession();
  const { has } = await auth();
  const isPro = user?.plan === "pro" || (has && has({ feature: "pro" }));

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="mb-2 font-bold text-3xl">Beeline</h1>
          <p className="text-[var(--text-muted)]">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl">Dashboard</h1>
            <p className="mt-1 text-[var(--text-muted)] text-sm">
              {user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <UserButton />
          </div>
        </header>

        <div className="space-y-12">
          {!isPro && (
            <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
              <h2 className="font-semibold text-xl">Subscription required</h2>
              <p className="mt-2 max-w-prose text-[var(--text-muted)] text-sm">
                Beeline is paid-only. Subscribe to unlock API key creation and
                access to the public API.
              </p>
              <div className="mt-5">
                <Link
                  className="rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-black text-sm transition-opacity hover:opacity-90"
                  href="/pricing"
                >
                  View pricing
                </Link>
              </div>
            </section>
          )}

          {isPro && <ApiKeysSection />}
          {isPro && <UsageSection />}
        </div>
      </div>
    </main>
  );
}
