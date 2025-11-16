/**
 * Provides consistent focus styles for interactive elements (buttons, links, etc.)
 */
export const focusRing = [
  // base - thicker outline with minimal offset
  "outline outline-offset-1 outline-0 focus-visible:outline-2",
  // outline color with barely-there opacity
  "outline-ring/5",
  // smooth transition
  "transition-[outline,outline-offset]",
] as const;
