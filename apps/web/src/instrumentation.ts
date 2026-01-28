import { validateEnv } from "@/lib/env";

export function register() {
  // Validate environment variables at startup
  validateEnv();
}
