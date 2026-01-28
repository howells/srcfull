import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "@/db/client";
import { users } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    switch (evt.type) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const email = email_addresses?.[0]?.email_address;
        if (!email) break;

        // Check if user already exists by email (migration path)
        const [existing] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (existing) {
          if (!existing.clerkUserId) {
            await db
              .update(users)
              .set({ clerkUserId: id })
              .where(eq(users.id, existing.id));
          }
        } else {
          await db.insert(users).values({
            clerkUserId: id,
            email,
            name: first_name
              ? `${first_name} ${last_name ?? ""}`.trim()
              : undefined,
          });
        }
        break;
      }

      case "subscription.created":
      case "subscription.updated":
      case "subscription.active": {
        const clerkUserId =
          "user_id" in evt.data ? (evt.data.user_id as string) : null;
        if (clerkUserId) {
          await db
            .update(users)
            .set({ plan: "pro" })
            .where(eq(users.clerkUserId, clerkUserId));
        }
        break;
      }

      case "subscription.pastDue": {
        const clerkUserId =
          "user_id" in evt.data ? (evt.data.user_id as string) : null;
        if (clerkUserId) {
          await db
            .update(users)
            .set({ plan: "free" })
            .where(eq(users.clerkUserId, clerkUserId));
        }
        break;
      }

      default:
        break;
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Clerk webhook error:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }
}
