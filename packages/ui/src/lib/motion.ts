/**
 * Motion tokens for UI components.
 * Provides consistent animation durations, easings, springs, and presets.
 */

// Duration types and values
export type Duration = "instant" | "fast" | "normal" | "slow" | "slower";

export const durations = {
  instant: 0,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
} as const;

export const durationMs = (duration: Duration): number => durations[duration];

// Easing functions
export type Easing = "linear" | "easeIn" | "easeOut" | "easeInOut" | "spring";

export const easings = {
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: [0.5, 1, 0.89, 1],
} as const;

export const easingsCSS = {
  linear: "cubic-bezier(0, 0, 1, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.5, 1, 0.89, 1)",
} as const;

// Spring configurations
export type SpringType = "gentle" | "wobbly" | "stiff" | "slow" | "molasses";

export const springs = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 14 },
  wobbly: { type: "spring" as const, stiffness: 180, damping: 12 },
  stiff: { type: "spring" as const, stiffness: 260, damping: 20 },
  slow: { type: "spring" as const, stiffness: 280, damping: 60 },
  molasses: { type: "spring" as const, stiffness: 280, damping: 120 },
} as const;

// Animation presets
export type Preset =
  | "fadeIn"
  | "fadeOut"
  | "slideIn"
  | "slideOut"
  | "scaleIn"
  | "scaleOut";

export const presets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeOut: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    exit: { opacity: 1 },
  },
  slideIn: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  },
  slideOut: {
    initial: { x: 0, opacity: 1 },
    animate: { x: 20, opacity: 0 },
    exit: { x: 0, opacity: 1 },
  },
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
  scaleOut: {
    initial: { scale: 1, opacity: 1 },
    animate: { scale: 0.95, opacity: 0 },
    exit: { scale: 1, opacity: 1 },
  },
} as const;
