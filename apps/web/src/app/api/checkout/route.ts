import { Checkout } from "@polar-sh/nextjs";
import { getAppUrl } from "@/lib/app-url";
import { requireEnv } from "@/lib/env";

export const GET = Checkout({
  accessToken: requireEnv("POLAR_ACCESS_TOKEN"),
  successUrl: `${getAppUrl()}/auth/success?checkout_id={CHECKOUT_ID}`,
  server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});
