export function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }

  return value;
}

export function getEnv(name: string): string | undefined {
  return process.env[name];
}

// Required env vars for the app to function
const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "SCRAPINGBEE_API_KEY",
  "CLERK_SECRET_KEY",
] as const;

// Optional but recommended
const OPTIONAL_ENV_VARS = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_WEBHOOK_SECRET",
  "CRON_SECRET",
  "FIRECRAWL_API_KEY",
] as const;

/**
 * Validate all required environment variables are present.
 * Call this at startup to fail fast if config is missing.
 */
export function validateEnv(): void {
  const missing: string[] = [];

  for (const name of REQUIRED_ENV_VARS) {
    if (!process.env[name]) {
      missing.push(name);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n  - ${missing.join("\n  - ")}`
    );
  }

  // Log warnings for missing optional vars in development
  if (process.env.NODE_ENV === "development") {
    const missingOptional = OPTIONAL_ENV_VARS.filter(
      (name) => !process.env[name]
    );
    if (missingOptional.length > 0) {
      console.warn(
        `Optional environment variables not set: ${missingOptional.join(", ")}`
      );
    }
  }
}
