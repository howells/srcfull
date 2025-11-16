/**
 * Deterministic color utilities inspired by the Midday project.
 *
 * Provides a stable mapping from an input string to a color from a
 * predefined palette. Useful for avatars, category labels, etc.
 */

// A comprehensive palette (subset derived from Midday CATEGORY_COLORS)
export const DETERMINISTIC_COLORS: readonly string[] = [
  // Primary
  "#FF6900",
  "#00D084",
  "#0693E3",
  "#8ED1FC",
  "#9900EF",
  "#EB144C",
  "#FF9F1C",
  "#39CCCC",
  "#0074D9",
  "#3D9970",
  "#B04632",
  "#DC2626",
  "#059669",
  "#6B7280",
  // Extended
  "#FCB900",
  "#ABB8C3",
  "#F78DA7",
  "#0079BF",
  "#B6BBBF",
  "#FF5A5F",
  "#F7C59F",
  "#8492A6",
  "#4D5055",
  "#AF5A50",
  "#F9D6E7",
  "#B5EAEA",
  "#B388EB",
  "#FF78CB",
  "#4E5A65",
  "#01FF70",
  "#85144B",
  "#F012BE",
  "#7FDBFF",
  "#AAAAAA",
  "#111111",
  "#001F3F",
  "#5E6A71",
  "#75D701",
  "#B6C8A9",
  "#00A9FE",
  "#EAE8E1",
  "#CD346C",
  "#FF6FA4",
  "#D667FB",
  "#0080FF",
  "#656D78",
  "#F8842C",
  "#FF8CFF",
  "#647F6A",
  "#5E574E",
  "#EF5466",
  "#B0E0E6",
  "#EB5E7C",
  "#8A2BE2",
  "#6B7C85",
  "#8C92AC",
  "#6C587A",
  "#52A1FF",
  "#32CD32",
  "#E04F9F",
  "#915C83",
  "#4C6B88",
  "#587376",
  "#C46210",
  "#65B0D0",
  "#2F4F4F",
  "#528B8B",
  "#8B4513",
  "#4682B4",
  "#CD853F",
  "#FFA07A",
  "#CD5C5C",
  "#483D8B",
  "#696969",
];

const DEFAULT_COLOR = "#6B7280"; // Neutral gray fallback

/**
 * Produces a deterministic positive integer hash for a given string.
 */
export function customHash(value: string): number {
  // Multiplicative hash without bitwise operators (polynomial rolling hash)
  const MOD = 2_147_483_647; // 2^31 - 1
  const BASE = 31;
  let hash = 0;
  for (const ch of value) {
    hash = (hash * BASE + ch.charCodeAt(0)) % MOD;
  }
  return hash;
}

/**
 * Returns a stable index for `value` within a given array length.
 */
export function getColorIndex(value: string, arrayLength: number): number {
  const hashValue = customHash(value);
  return hashValue % arrayLength;
}

/**
 * Maps a string to a color from the deterministic palette.
 */
export function getColorFromName(value: string): string {
  if (!value) {
    return DEFAULT_COLOR;
  }
  const index = getColorIndex(value, DETERMINISTIC_COLORS.length);
  return DETERMINISTIC_COLORS[index] ?? DEFAULT_COLOR;
}

/**
 * Returns a random color from the deterministic palette.
 */
export function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * DETERMINISTIC_COLORS.length);
  return DETERMINISTIC_COLORS[randomIndex] ?? DEFAULT_COLOR;
}

/**
 * Calculates a readable text color (black/white) for the given background.
 */
const HASH_PREFIX_RE = /^#/;
const WHITESPACE_RE = /\s+/;

export function getReadableTextColor(bgHex: string): "#000000" | "#FFFFFF" {
  const START = 0; // slice start index
  const STEP = 2; // two hex chars per channel
  const HEX_BASE = 16; // hexadecimal base

  // Remove '#'
  const hex = bgHex.replace(HASH_PREFIX_RE, "");
  const rStart = START;
  const gStart = START + STEP;
  const bStart = START + STEP * 2;
  const r = Number.parseInt(hex.slice(rStart, rStart + STEP), HEX_BASE);
  const g = Number.parseInt(hex.slice(gStart, gStart + STEP), HEX_BASE);
  const b = Number.parseInt(hex.slice(bStart, bStart + STEP), HEX_BASE);

  // YIQ weights and threshold
  const WEIGHT_R = 299;
  const WEIGHT_G = 587;
  const WEIGHT_B = 114;
  const SCALE = 1000;
  const THRESHOLD = 128;

  const yiq = (r * WEIGHT_R + g * WEIGHT_G + b * WEIGHT_B) / SCALE;
  return yiq >= THRESHOLD ? "#000000" : "#FFFFFF";
}

/**
 * Generates initials from a name for avatar fallbacks.
 */
export function getInitials(name: string): string {
  if (!name) {
    return "";
  }
  const parts = name.trim().split(WHITESPACE_RE);
  const [firstPart, ...rest] = parts;
  if (!firstPart) {
    return "";
  }
  if (rest.length === 0) {
    return firstPart.charAt(0).toUpperCase();
  }
  const lastPart = rest.at(-1) ?? firstPart;
  const first = firstPart.charAt(0);
  const last = lastPart.charAt(0);
  return `${first}${last}`.toUpperCase();
}
