import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { getPolarWebhookSecret } from "@/lib/polar";

export async function POST(request: Request) {
  const body = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  try {
    const event = validateEvent(body, headers, getPolarWebhookSecret());

    switch (event.type) {
      case "subscription.created":
      case "subscription.updated": {
        const subscription = event.data;
        if (subscription.status === "active") {
          await db
            .update(users)
            .set({
              plan: "pro",
              polarSubscriptionId: subscription.id,
            })
            .where(eq(users.polarCustomerId, subscription.customerId));
        }
        break;
      }

      case "subscription.canceled": {
        const subscription = event.data;
        await db
          .update(users)
          .set({
            plan: "free",
            polarSubscriptionId: null,
          })
          .where(eq(users.polarCustomerId, subscription.customerId));
        break;
      }

      case "checkout.created": {
        const checkout = event.data;
        const email = checkout.customerEmail;
        const customerId = checkout.customerId;

        if (!(email && customerId)) {
          break;
        }

        const [existing] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!existing) {
          await db.insert(users).values({
            email,
            name: checkout.customerName ?? undefined,
            polarCustomerId: customerId,
          });
          break;
        }

        if (!existing.polarCustomerId) {
          await db
            .update(users)
            .set({ polarCustomerId: customerId })
            .where(eq(users.id, existing.id));
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
