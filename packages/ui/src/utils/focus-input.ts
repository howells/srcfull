/**
 * Provides consistent focus styles for input-like components
 */
export const focusInput = [
  // base - thicker ring
  "focus-visible:ring-2",
  // ring color with barely-there opacity
  "focus-visible:ring-ring/5",
  // keep original border color visible, just add slight emphasis
  "focus-visible:border-border",
  // smooth transition
  "transition-[box-shadow,border-color]",
] as const;
