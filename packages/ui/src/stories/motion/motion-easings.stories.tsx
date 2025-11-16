import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { useState } from "react";
import { motion } from "motion/react";
import { easings, easingsCSS, type Easing } from "@repo/ui/lib/motion";
import { durations } from "@repo/ui/lib/motion";

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
    const [animatingBoxes, setAnimatingBoxes] = useState<Record<string, boolean>>(
      Object.fromEntries(easingKeys.map((key) => [key, false]))
    );

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
      <div className="w-full max-w-4xl mx-auto p-8 space-y-12">
        <div>
          <h2 className="text-2xl font-medium mb-2">Easing Curves</h2>
          <p className="text-neutral-600 mb-8">
            Click "Trigger Animation" to see how each easing function affects
            animation motion. All animations use the same duration (500ms) to
            focus on the easing differences.
          </p>

          <button
            onClick={toggleAll}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg mb-8 hover:bg-primary/90 transition-colors"
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
                key={key}
                className="border border-neutral-200 rounded-lg p-6 space-y-4"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-medium capitalize">{key}</h3>
                  <p className="text-xs text-neutral-600">
                    Cubic bezier: {easing.join(", ")}
                  </p>
                  <p className="text-xs text-neutral-500 font-mono">
                    {cssEasing}
                  </p>
                </div>

                <div className="bg-neutral-50 rounded-lg p-8 flex items-center justify-start h-24 overflow-hidden">
                  <motion.div
                    className="w-12 h-12 bg-primary rounded-lg cursor-pointer transition-shadow hover:shadow-lg"
                    onClick={() => toggleBox(key)}
                    animate={
                      animatingBoxes[key] ? { x: 300 } : { x: 0 }
                    }
                    transition={{
                      duration: 0.8,
                      ease: easing,
                    }}
                  />
                </div>

                <p className="text-xs text-neutral-500">
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
    const [animatingBoxes, setAnimatingBoxes] = useState<Record<string, boolean>>(
      Object.fromEntries(easingKeys.map((key) => [key, false]))
    );

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
      <div className="w-full max-w-6xl mx-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-medium mb-2">Easing Comparison</h2>
          <p className="text-neutral-600 mb-8">
            Compare all easing functions side-by-side. Watch how each curve
            affects the motion of the box.
          </p>

          <button
            onClick={toggleAll}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {allAnimating ? "Reset" : "Animate"}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {easingKeys.map((key) => (
            <div key={key} className="space-y-3">
              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50 h-24 flex items-center overflow-hidden">
                <motion.div
                  className="w-6 h-6 bg-primary rounded cursor-pointer transition-shadow hover:shadow-lg"
                  onClick={() => toggleBox(key)}
                  animate={animatingBoxes[key] ? { x: 120 } : { x: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: easings[key],
                  }}
                />
              </div>

              <div className="space-y-1">
                <p className="font-medium text-sm capitalize">{key}</p>
                <p className="text-xs text-neutral-600 font-mono leading-tight">
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
      <div className="w-full max-w-6xl mx-auto p-8 space-y-12">
        <div>
          <h2 className="text-2xl font-medium mb-2">Easings in Practice</h2>
          <p className="text-neutral-600 mb-8">
            Real-world examples of easings applied to different animation
            patterns.
          </p>

          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {isAnimating ? "Reset" : "Animate"}
          </button>
        </div>

        <div className="space-y-8">
          {/* Horizontal slide */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Horizontal Slide (out)</h3>
            <div className="bg-neutral-50 rounded-lg p-8 h-20 flex items-center overflow-hidden">
              <motion.div
                className="w-10 h-10 bg-primary rounded"
                animate={isAnimating ? { x: 350 } : { x: 0 }}
                transition={{
                  duration: 0.6,
                  ease: easings.out,
                }}
              />
            </div>
            <p className="text-sm text-neutral-600">
              Smooth start, deceleration - good for elements leaving the screen
            </p>
          </div>

          {/* Vertical bounce in */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vertical Entrance (in)</h3>
            <div className="bg-neutral-50 rounded-lg p-8 h-40 flex items-end justify-center overflow-hidden">
              <motion.div
                className="w-10 h-10 bg-accent rounded"
                animate={isAnimating ? { y: -100 } : { y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: easings.in,
                }}
              />
            </div>
            <p className="text-sm text-neutral-600">
              Accelerates in, sharp end - good for elements entering the screen
            </p>
          </div>

          {/* Scale with inOut */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Scale Transition (inOut)</h3>
            <div className="bg-neutral-50 rounded-lg p-8 h-32 flex items-center justify-center overflow-hidden">
              <motion.div
                className="w-12 h-12 bg-secondary rounded"
                animate={
                  isAnimating ? { scale: 1.5 } : { scale: 1 }
                }
                transition={{
                  duration: 0.6,
                  ease: easings.inOut,
                }}
              />
            </div>
            <p className="text-sm text-neutral-600">
              Smooth both ends - good for complex transitions and scale changes
            </p>
          </div>

          {/* Standard for most cases */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">General Purpose (standard)</h3>
            <div className="bg-neutral-50 rounded-lg p-8 h-32 flex items-center justify-start overflow-hidden">
              <motion.div
                className="w-10 h-10 bg-ring rounded"
                animate={
                  isAnimating
                    ? {
                        x: 300,
                        rotate: 180,
                      }
                    : { x: 0, rotate: 0 }
                }
                transition={{
                  duration: 0.6,
                  ease: easings.standard,
                }}
              />
            </div>
            <p className="text-sm text-neutral-600">
              Balanced acceleration and deceleration - suitable for most UI
              animations
            </p>
          </div>
        </div>
      </div>
    );
  },
};
