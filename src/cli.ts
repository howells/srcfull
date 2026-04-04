#!/usr/bin/env node
import { parseArgs } from "node:util";
import packageJson from "../package.json";
import { createFirecrawlImageFallback } from "./providers/firecrawl";
import { createScrapingBeeHtmlFetcher } from "./providers/scrapingbee";
import { resolveImageUrl } from "./resolve";
import { scrapePage } from "./scrape";
import type { DebugEvent, DebugLogger } from "./types";

function printUsage(): void {
  process.stdout.write(`srcfull\n\n`);
  process.stdout.write(`Commands:\n`);
  process.stdout.write(`  srcfull resolve <image-url> [--verbose]\n`);
  process.stdout.write(
    `  srcfull scrape <page-url> [--max-images=20] [--min-size=200] [--resolve-concurrency=5] [--fetcher=default|scrapingbee] [--fallback=none|firecrawl] [--verbose]\n`,
  );
  process.stdout.write(`  srcfull help\n`);
  process.stdout.write(`  srcfull --version\n`);
}

function printError(message: string): void {
  process.stderr.write(`${message}\n`);
}

function parseOptionalInteger(
  value: string | undefined,
  optionName: string,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new Error(`${optionName} must be a positive integer`);
  }

  return parsed;
}

function createVerboseLogger(enabled: boolean): DebugLogger | undefined {
  if (!enabled) {
    return undefined;
  }

  return (event: DebugEvent) => {
    const suffix = [
      event.url ? ` url=${event.url}` : "",
      event.method ? ` method=${event.method}` : "",
      event.status !== undefined ? ` status=${event.status}` : "",
      event.attempt !== undefined ? ` attempt=${event.attempt}` : "",
      event.error ? ` error=${event.error}` : "",
    ].join("");
    process.stderr.write(`[${event.type}] ${event.message}${suffix}\n`);
  };
}

async function main() {
  const [command, target, ...rest] = process.argv.slice(2);

  if (!command || command === "help" || command === "--help") {
    printUsage();
    return;
  }

  if (command === "version" || command === "--version") {
    process.stdout.write(`${packageJson.version}\n`);
    return;
  }

  if (command === "resolve") {
    if (!target) {
      throw new Error("Missing image URL");
    }

    const { values } = parseArgs({
      args: rest,
      options: {
        verbose: {
          type: "boolean",
          short: "v",
        },
      },
      allowPositionals: true,
    });

    const result = await resolveImageUrl(target, {
      onDebug: createVerboseLogger(values.verbose ?? false),
    });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  if (command === "scrape") {
    if (!target) {
      throw new Error("Missing page URL");
    }

    const { values } = parseArgs({
      args: rest,
      options: {
        "max-images": {
          type: "string",
        },
        "min-size": {
          type: "string",
        },
        "resolve-concurrency": {
          type: "string",
        },
        fetcher: {
          type: "string",
        },
        fallback: {
          type: "string",
        },
        verbose: {
          type: "boolean",
          short: "v",
        },
      },
      allowPositionals: true,
    });

    const maxImages = parseOptionalInteger(
      values["max-images"],
      "--max-images",
    );
    const minSize = parseOptionalInteger(values["min-size"], "--min-size");
    const resolveConcurrency = parseOptionalInteger(
      values["resolve-concurrency"],
      "--resolve-concurrency",
    );
    const verbose = values.verbose ?? false;
    const onDebug = createVerboseLogger(verbose);
    const fetcher = values.fetcher ?? "default";
    const fallback = values.fallback ?? "none";

    const fetchHtml =
      fetcher === "scrapingbee"
        ? createScrapingBeeHtmlFetcher({
            apiKey:
              process.env.SCRAPINGBEE_API_KEY ??
              (() => {
                throw new Error(
                  "SCRAPINGBEE_API_KEY is required for --fetcher=scrapingbee",
                );
              })(),
            onDebug,
          })
        : undefined;

    const imageFallback =
      fallback === "firecrawl"
        ? createFirecrawlImageFallback({
            apiKey:
              process.env.FIRECRAWL_API_KEY ??
              (() => {
                throw new Error(
                  "FIRECRAWL_API_KEY is required for --fallback=firecrawl",
                );
              })(),
            onDebug,
          })
        : undefined;

    if (fetcher !== "default" && fetcher !== "scrapingbee") {
      throw new Error(`Unknown fetcher: ${fetcher}`);
    }

    if (fallback !== "none" && fallback !== "firecrawl") {
      throw new Error(`Unknown fallback: ${fallback}`);
    }

    const result = await scrapePage(target, {
      maxImages,
      minSize,
      resolveConcurrency,
      fetchHtml,
      imageFallback,
      onDebug,
    });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

void main().catch((error) => {
  printError(error instanceof Error ? error.message : "Unknown error");
  printUsage();
  process.exitCode = 1;
});
