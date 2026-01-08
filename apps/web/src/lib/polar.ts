import { Polar } from "@polar-sh/sdk";
import { requireEnv } from "./env";

let polarClient: Polar | null = null;

export function getPolarClient(): Polar {
  if (polarClient) {
    return polarClient;
  }

  polarClient = new Polar({
    accessToken: requireEnv("POLAR_ACCESS_TOKEN"),
    server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
  });

  return polarClient;
}

export function getPolarWebhookSecret(): string {
  return requireEnv("POLAR_WEBHOOK_SECRET");
}
