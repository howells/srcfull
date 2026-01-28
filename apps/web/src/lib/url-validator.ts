/**
 * SSRF protection - validates URLs to prevent internal network probing.
 * Blocks private IP ranges, localhost, and potentially dangerous schemes.
 */

const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^0\.0\.0\.0$/,
  /^169\.254\.\d+\.\d+$/, // Link-local
  /^::1$/, // IPv6 localhost
  /^fc00:/i, // IPv6 private
  /^fe80:/i, // IPv6 link-local
];

const BLOCKED_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "metadata.google.internal", // GCP metadata
  "169.254.169.254", // AWS/Azure/GCP metadata
];

const ALLOWED_SCHEMES = ["http:", "https:"];

export type UrlValidationResult = {
  valid: boolean;
  error?: string;
  url?: URL;
};

export function validateUrl(urlString: string): UrlValidationResult {
  let url: URL;

  try {
    url = new URL(urlString);
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }

  // Check scheme
  if (!ALLOWED_SCHEMES.includes(url.protocol)) {
    return { valid: false, error: "Only HTTP and HTTPS URLs are allowed" };
  }

  // Check for blocked hostnames
  const hostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return { valid: false, error: "This hostname is not allowed" };
  }

  // Check for private IP patterns
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return { valid: false, error: "Private IP addresses are not allowed" };
    }
  }

  // Check for IP address that might resolve to private range
  // Block any raw IP that's not clearly public
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    const parts = hostname.split(".").map(Number);
    // Additional checks for edge cases
    if (parts[0] === 0 || parts[0] === 127 || parts[0] === 10) {
      return { valid: false, error: "Private IP addresses are not allowed" };
    }
  }

  return { valid: true, url };
}
