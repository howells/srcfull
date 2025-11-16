/**
 * Provides consistent error styles for input-like components
 */
export const hasErrorInput = [
  // base
  "aria-invalid:ring-[3px]",
  // border color
  "aria-invalid:border-destructive",
  // ring color
  "aria-invalid:ring-destructive/20",
  "dark:aria-invalid:ring-destructive/40",
] as const;
