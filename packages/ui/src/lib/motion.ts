/**
 * Re-export motion tokens for UI components.
 * Components should import from here rather than directly from @materia/motion.
 */
// biome-ignore lint/performance/noBarrelFile: Intentional facade for UI package
export {
  type Duration,
  durationMs,
  durations,
  type Easing,
  easings,
  easingsCSS,
  type Preset,
  presets,
  type SpringType,
  springs,
} from "@materia/motion";
