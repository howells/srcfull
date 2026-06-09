import { lookup } from "node:dns/promises";

const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^198\.(1[89])\.\d+\.\d+$/,
  /^0\.0\.0\.0$/,
  /^169\.254\.\d+\.\d+$/,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "metadata.google.internal",
  "169.254.169.254",
]);

const BLOCKED_HOSTNAME_SUFFIXES = [".local", ".internal", ".localhost"];

export interface PublicUrlValidationOptions {
  resolveHostname?: (hostname: string) => Promise<string[]>;
}

export interface PublicUrlValidation {
  valid: boolean;
  error?: string;
  url?: URL;
}

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/^\[(.*)\]$/, "$1");
}

function isPrivateAddress(hostname: string): boolean {
  const normalized = normalizeHostname(hostname);

  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(normalized)) {
      return true;
    }
  }

  if (/^\d+\.\d+\.\d+\.\d+$/.test(normalized)) {
    const parts = normalized.split(".").map(Number);
    if (parts[0] === 0 || parts[0] === 10 || parts[0] === 127) {
      return true;
    }
  }

  return false;
}

async function resolveHostname(hostname: string): Promise<string[]> {
  const entries = await lookup(hostname, { all: true, verbatim: true });
  return entries.map((entry) => entry.address);
}

export function validatePublicUrl(urlString: string): PublicUrlValidation {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return { error: "Invalid URL format", valid: false };
  }

  if (!(url.protocol === "http:" || url.protocol === "https:")) {
    return { error: "Only HTTP and HTTPS URLs are allowed", valid: false };
  }

  const hostname = normalizeHostname(url.hostname);
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { error: "This hostname is not allowed", valid: false };
  }

  if (BLOCKED_HOSTNAME_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) {
    return { error: "Private hostnames are not allowed", valid: false };
  }

  if (isPrivateAddress(hostname)) {
    return { error: "Private IP addresses are not allowed", valid: false };
  }

  return { url, valid: true };
}

export async function validatePublicUrlForServer(
  urlString: string,
  options: PublicUrlValidationOptions = {},
): Promise<PublicUrlValidation> {
  const validation = validatePublicUrl(urlString);
  if (!validation.valid || !validation.url) {
    return validation;
  }

  const hostname = normalizeHostname(validation.url.hostname);
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname.includes(":")) {
    return validation;
  }

  let addresses: string[];
  try {
    addresses = await (options.resolveHostname ?? resolveHostname)(hostname);
  } catch {
    return { error: "Hostname could not be resolved", valid: false };
  }

  if (addresses.some(isPrivateAddress)) {
    return {
      error: "Hostname resolves to a private IP address",
      valid: false,
    };
  }

  return validation;
}
