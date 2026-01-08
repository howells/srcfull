import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import {
  durations,
  type Easing,
  easings,
  easingsCSS,
} from "@repo/ui/lib/motion";
import { motion } from "motion/react";
import { useState } from "react";

const meta = {
  title: "Motion/Easings",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive showcase of easing curve tokens.
 * Easings control acceleration and deceleration of animations.
 */
export const AllEasings: Story = {
  render: () => {
    const easingKeys = Object.keys(easings) as Easing[];
    const [animatingBoxes, setAnimatingBoxes] = useState<
      Record<string, boolean>
    >(Object.fromEntries(easingKeys.map((key) => [key, false])));

    const toggleBox = (key: string) => {
      setAnimatingBoxes((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleAll = () => {
      const allAnimating = Object.values(animatingBoxes).every((v) => v);
      setAnimatingBoxes(
        Object.fromEntries(easingKeys.map((key) => [key, !allAnimating]))
      );
    };

    const allAnimating = Object.values(animatingBoxes).every((v) => v);

    return (
      <div className="mx-auto w-full max-w-4xl space-y-12 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Easing Curves</h2>
          <p className="mb-8 text-neutral-600">
            Click "Trigger Animation" to see how each easing function affects
            animation motion. All animations use the same duration (500ms) to
            focus on the easing differences.
          </p>

          <button
            className="mb-8 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={toggleAll}
          >
            {allAnimating ? "Stop" : "Trigger"} Animation
          </button>
        </div>

        <div className="grid gap-8">
          {easingKeys.map((key) => {
            const easing = easings[key];
            const cssEasing = easingsCSS[key];

            return (
              <div
                className="space-y-4 rounded-lg border border-neutral-200 p-6"
                key={key}
              >
                <div className="space-y-2">
                  <h3 className="font-medium text-lg capitalize">{key}</h3>
                  <p className="text-neutral-600 text-xs">
                    Cubic bezier: {easing.join(", ")}
                  </p>
                  <p className="font-mono text-neutral-500 text-xs">
                    {cssEasing}
                  </p>
                </div>

                <div className="flex h-24 items-center justify-start overflow-hidden rounded-lg bg-neutral-50 p-8">
                  <motion.div
                    animate={animatingBoxes[key] ? { x: 300 } : { x: 0 }}
                    className="h-12 w-12 cursor-pointer rounded-lg bg-primary transition-shadow hover:shadow-lg"
                    onClick={() => toggleBox(key)}
                    transition={{
                      duration: 0.8,
                      ease: easing,
                    }}
                  />
                </div>

                <p className="text-neutral-500 text-xs">
                  {key === "standard" &&
                    "General purpose with smooth acceleration and deceleration"}
                  {key === "in" &&
                    "Accelerates in with sharp exit - for entering elements"}
                  {key === "out" &&
                    "Smooth start with deceleration - for exiting elements"}
                  {key === "inOut" &&
                    "Smooth both ends - for complex transitions"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

/**
 * Easing comparison grid.
 * See all easings at once for quick reference.
 */
export const EasingComparison: Story = {
  render: () => {
    const easingKeys = Object.keys(easings) as Easing[];
    const [animatingBoxes, setAnimatingBoxes] = useState<
      Record<string, boolean>
    >(Object.fromEntries(easingKeys.map((key) => [key, false])));

    const toggleBox = (key: string) => {
      setAnimatingBoxes((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleAll = () => {
      const allAnimating = Object.values(animatingBoxes).every((v) => v);
      setAnimatingBoxes(
        Object.fromEntries(easingKeys.map((key) => [key, !allAnimating]))
      );
    };

    const allAnimating = Object.values(animatingBoxes).every((v) => v);

    return (
      <div className="mx-auto w-full max-w-6xl space-y-8 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Easing Comparison</h2>
          <p className="mb-8 text-neutral-600">
            Compare all easing functions side-by-side. Watch how each curve
            affects the motion of the box.
          </p>

          <button
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={toggleAll}
          >
            {allAnimating ? "Reset" : "Animate"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {easingKeys.map((key) => (
            <div className="space-y-3" key={key}>
              <div className="flex h-24 items-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <motion.div
                  animate={animatingBoxes[key] ? { x: 120 } : { x: 0 }}
                  className="h-6 w-6 cursor-pointer rounded bg-primary transition-shadow hover:shadow-lg"
                  onClick={() => toggleBox(key)}
                  transition={{
                    duration: 0.6,
                    ease: easings[key],
                  }}
                />
              </div>

              <div className="space-y-1">
                <p className="font-medium text-sm capitalize">{key}</p>
                <p className="font-mono text-neutral-600 text-xs leading-tight">
                  {easings[key].join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Easing in practice with different animations.
 * Shows how easings work with different types of motion.
 */
export const EasingInPractice: Story = {
  render: () => {
    const [isAnimating, setIsAnimating] = useState(false);

    return (
      <div className="mx-auto w-full max-w-6xl space-y-12 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Easings in Practice</h2>
          <p className="mb-8 text-neutral-600">
            Real-world examples of easings applied to different animation
            patterns.
          </p>

          <button
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={() => setIsAnimating(!isAnimating)}
          >
            {isAnimating ? "Reset" : "Animate"}
          </button>
        </div>

        <div className="space-y-8">
          {/* Horizontal slide */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Horizontal Slide (out)</h3>
            <div className="flex h-20 items-center overflow-hidden rounded-lg bg-neutral-50 p-8">
              <motion.div
                animate={isAnimating ? { x: 350 } : { x: 0 }}
                className="h-10 w-10 rounded bg-primary"
                transition={{
                  duration: 0.6,
                  ease: easings.out,
                }}
              />
            </div>
            <p className="text-neutral-600 text-sm">
              Smooth start, deceleration - good for elements leaving the screen
            </p>
          </div>

          {/* Vertical bounce in */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Vertical Entrance (in)</h3>
            <div className="flex h-40 items-end justify-center overflow-hidden rounded-lg bg-neutral-50 p-8">
              <motion.div
                animate={isAnimating ? { y: -100 } : { y: 0 }}
                className="h-10 w-10 rounded bg-accent"
                transition={{
                  duration: 0.6,
                  ease: easings.in,
                }}
              />
            </div>
            <p className="text-neutral-600 text-sm">
              Accelerates in, sharp end - good for elements entering the screen
            </p>
          </div>

          {/* Scale with inOut */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Scale Transition (inOut)</h3>
            <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg bg-neutral-50 p-8">
              <motion.div
                animate={isAnimating ? { scale: 1.5 } : { scale: 1 }}
                className="h-12 w-12 rounded bg-secondary"
                transition={{
                  duration: 0.6,
                  ease: easings.inOut,
                }}
              />
            </div>
            <p className="text-neutral-600 text-sm">
              Smooth both ends - good for complex transitions and scale changes
            </p>
          </div>

          {/* Standard for most cases */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">General Purpose (standard)</h3>
            <div className="flex h-32 items-center justify-start overflow-hidden rounded-lg bg-neutral-50 p-8">
              <motion.div
                animate={
                  isAnimating
                    ? {
                        x: 300,
                        rotate: 180,
                      }
                    : { x: 0, rotate: 0 }
                }
                className="h-10 w-10 rounded bg-ring"
                transition={{
                  duration: 0.6,
                  ease: easings.standard,
                }}
              />
            </div>
            <p className="text-neutral-600 text-sm">
              Balanced acceleration and deceleration - suitable for most UI
              animations
            </p>
          </div>
        </div>
      </div>
    );
  },
};
