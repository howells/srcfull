import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { type Duration, durationMs, durations } from "@repo/ui/lib/motion";
import { motion } from "motion/react";
import { useState } from "react";

const meta = {
  title: "Motion/Durations",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive showcase of motion duration tokens.
 * Durations control how long an animation takes (in seconds for Framer Motion, milliseconds for CSS).
 */
export const AllDurations: Story = {
  render: () => {
    const durationKeys = Object.keys(durations) as Duration[];
    const [animatingBoxes, setAnimatingBoxes] = useState<
      Record<string, boolean>
    >(Object.fromEntries(durationKeys.map((key) => [key, false])));

    const toggleBox = (key: string) => {
      setAnimatingBoxes((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleAll = () => {
      const allAnimating = Object.values(animatingBoxes).every((v) => v);
      setAnimatingBoxes(
        Object.fromEntries(durationKeys.map((key) => [key, !allAnimating]))
      );
    };

    const allAnimating = Object.values(animatingBoxes).every((v) => v);

    return (
      <div className="mx-auto w-full max-w-4xl space-y-12 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Duration Tokens</h2>
          <p className="mb-8 text-neutral-600">
            Click "Trigger Animation" to see how each duration affects animation
            timing. Durations are in seconds for Framer Motion.
          </p>

          <button
            className="mb-8 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={toggleAll}
          >
            {allAnimating ? "Stop" : "Trigger"} Animation
          </button>
        </div>

        <div className="grid gap-8">
          {durationKeys.map((key) => (
            <div
              className="space-y-4 rounded-lg border border-neutral-200 p-6"
              key={key}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-medium text-lg capitalize">{key}</h3>
                <div className="space-x-4 text-neutral-600 text-sm">
                  <span>
                    <span className="font-mono text-neutral-900">
                      {durations[key]}
                    </span>
                    s
                  </span>
                  <span className="text-neutral-500">/</span>
                  <span>
                    <span className="font-mono text-neutral-900">
                      {durationMs[key]}
                    </span>
                    ms
                  </span>
                </div>
              </div>

              <div className="flex h-24 items-center justify-start overflow-hidden rounded-lg bg-neutral-50 p-8">
                <motion.div
                  animate={animatingBoxes[key] ? { x: 300 } : { x: 0 }}
                  className="h-12 w-12 cursor-pointer rounded-lg bg-primary transition-shadow hover:shadow-lg"
                  onClick={() => toggleBox(key)}
                  transition={{
                    duration: durations[key],
                    ease: "easeInOut",
                  }}
                />
              </div>

              <p className="text-neutral-500 text-xs">
                {key === "instant" && "No animation - immediate state change"}
                {key === "quick" && "Micro-interactions and hovers (150ms)"}
                {key === "normal" && "Dialogs, sheets, reveals (250ms)"}
                {key === "moderate" &&
                  "Page transitions, complex animations (350ms)"}
                {key === "slow" && "Emphasis and storytelling moments (500ms)"}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Side-by-side duration comparison.
 * Useful for seeing how different durations compare in relative terms.
 */
export const DurationComparison: Story = {
  render: () => {
    const durationKeys = Object.keys(durations) as Duration[];
    const [animatingBoxes, setAnimatingBoxes] = useState<
      Record<string, boolean>
    >(Object.fromEntries(durationKeys.map((key) => [key, false])));

    const toggleBox = (key: string) => {
      setAnimatingBoxes((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleAll = () => {
      const allAnimating = Object.values(animatingBoxes).every((v) => v);
      setAnimatingBoxes(
        Object.fromEntries(durationKeys.map((key) => [key, !allAnimating]))
      );
    };

    const allAnimating = Object.values(animatingBoxes).every((v) => v);

    return (
      <div className="mx-auto w-full max-w-6xl space-y-8 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Duration Comparison</h2>
          <p className="mb-8 text-neutral-600">
            Compare durations side-by-side. All boxes animate to the same
            distance but with different durations.
          </p>

          <button
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={toggleAll}
          >
            {allAnimating ? "Reset" : "Animate"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {durationKeys.map((key) => (
            <div className="space-y-3" key={key}>
              <div className="flex h-20 items-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <motion.div
                  animate={animatingBoxes[key] ? { x: 100 } : { x: 0 }}
                  className="h-8 w-8 cursor-pointer rounded bg-primary transition-shadow hover:shadow-lg"
                  onClick={() => toggleBox(key)}
                  transition={{
                    duration: durations[key],
                    ease: "easeInOut",
                  }}
                />
              </div>

              <div className="space-y-1 text-center">
                <p className="font-medium text-sm capitalize">{key}</p>
                <p className="font-mono text-neutral-600 text-xs">
                  {durations[key]}s
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
 * Duration scale visualization.
 * Shows the relative timing relationships between different durations.
 */
export const DurationScale: Story = {
  render: () => {
    const maxDuration = Math.max(...Object.values(durations));

    return (
      <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Duration Scale</h2>
          <p className="mb-8 text-neutral-600">
            Visual representation of the duration scale. Bars represent relative
            timing.
          </p>
        </div>

        <div className="space-y-6">
          {(Object.keys(durations) as Duration[]).map((key) => {
            const value = durations[key];
            const percentage = (value / maxDuration) * 100;

            return (
              <div className="space-y-2" key={key}>
                <div className="flex items-center justify-between">
                  <p className="w-20 font-medium capitalize">{key}</p>
                  <div className="mx-4 h-8 flex-1 overflow-hidden rounded bg-neutral-100">
                    <div
                      className="h-full rounded bg-primary transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="w-16 text-right font-mono text-neutral-600 text-sm">
                    {value}s
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-blue-900 text-sm">
            <strong>Tip:</strong> These durations follow a semantic scale
            designed for common UI patterns. Start with "normal" (250ms) and
            adjust based on complexity and feedback.
          </p>
        </div>
      </div>
    );
  },
};
