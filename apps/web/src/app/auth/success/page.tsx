import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { getPolarClient } from "@/lib/polar";

type Props = {
  searchParams: Promise<{ checkout_id?: string }>;
};

export default async function AuthSuccessPage({ searchParams }: Props) {
  const { checkout_id } = await searchParams;

  if (!checkout_id) {
    redirect("/dashboard?error=missing_checkout_id");
  }

  try {
    const checkout = await getPolarClient().checkouts.get({ id: checkout_id });
    const email = checkout.customerEmail;
    const customerId = checkout.customerId;

    if (!(email && customerId)) {
      redirect("/dashboard?error=missing_customer_info");
    }

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const [user] = existingUser
      ? await db
          .update(users)
          .set({
            polarCustomerId: existingUser.polarCustomerId ?? customerId,
            name: existingUser.name ?? checkout.customerName ?? undefined,
            plan: "pro",
          })
          .where(eq(users.id, existingUser.id))
          .returning()
      : await db
          .insert(users)
          .values({
            email,
            name: checkout.customerName ?? undefined,
            polarCustomerId: customerId,
            plan: "pro",
          })
          .returning();

    if (!user) {
      redirect("/dashboard?error=user_upsert_failed");
    }

    const cookieStore = await cookies();
    cookieStore.set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    redirect("/dashboard");
  } catch (error) {
    console.error("Auth success error:", error);
    redirect("/dashboard?error=auth_failed");
  }
}
