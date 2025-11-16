import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { useState } from "react";
import { motion } from "motion/react";
import { durations, durationMs, type Duration } from "@materia/motion/durations";

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
    const [animatingBoxes, setAnimatingBoxes] = useState<Record<string, boolean>>(
      Object.fromEntries(durationKeys.map((key) => [key, false]))
    );

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
      <div className="w-full max-w-4xl mx-auto p-8 space-y-12">
        <div>
          <h2 className="text-2xl font-medium mb-2">Duration Tokens</h2>
          <p className="text-neutral-600 mb-8">
            Click "Trigger Animation" to see how each duration affects animation
            timing. Durations are in seconds for Framer Motion.
          </p>

          <button
            onClick={toggleAll}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg mb-8 hover:bg-primary/90 transition-colors"
          >
            {allAnimating ? "Stop" : "Trigger"} Animation
          </button>
        </div>

        <div className="grid gap-8">
          {durationKeys.map((key) => (
            <div
              key={key}
              className="border border-neutral-200 rounded-lg p-6 space-y-4"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-medium capitalize">{key}</h3>
                <div className="text-sm text-neutral-600 space-x-4">
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

              <div className="bg-neutral-50 rounded-lg p-8 flex items-center justify-start h-24 overflow-hidden">
                <motion.div
                  className="w-12 h-12 bg-primary rounded-lg cursor-pointer transition-shadow hover:shadow-lg"
                  onClick={() => toggleBox(key)}
                  animate={
                    animatingBoxes[key] ? { x: 300 } : { x: 0 }
                  }
                  transition={{
                    duration: durations[key],
                    ease: "easeInOut",
                  }}
                />
              </div>

              <p className="text-xs text-neutral-500">
                {key === "instant" &&
                  "No animation - immediate state change"}
                {key === "quick" &&
                  "Micro-interactions and hovers (150ms)"}
                {key === "normal" &&
                  "Dialogs, sheets, reveals (250ms)"}
                {key === "moderate" &&
                  "Page transitions, complex animations (350ms)"}
                {key === "slow" &&
                  "Emphasis and storytelling moments (500ms)"}
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
    const [animatingBoxes, setAnimatingBoxes] = useState<Record<string, boolean>>(
      Object.fromEntries(durationKeys.map((key) => [key, false]))
    );

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
      <div className="w-full max-w-6xl mx-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-medium mb-2">Duration Comparison</h2>
          <p className="text-neutral-600 mb-8">
            Compare durations side-by-side. All boxes animate to the same
            distance but with different durations.
          </p>

          <button
            onClick={toggleAll}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {allAnimating ? "Reset" : "Animate"}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {durationKeys.map((key) => (
            <div key={key} className="space-y-3">
              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50 h-20 flex items-center overflow-hidden">
                <motion.div
                  className="w-8 h-8 bg-primary rounded cursor-pointer transition-shadow hover:shadow-lg"
                  onClick={() => toggleBox(key)}
                  animate={animatingBoxes[key] ? { x: 100 } : { x: 0 }}
                  transition={{
                    duration: durations[key],
                    ease: "easeInOut",
                  }}
                />
              </div>

              <div className="text-center space-y-1">
                <p className="font-medium text-sm capitalize">{key}</p>
                <p className="text-xs text-neutral-600 font-mono">
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
      <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-medium mb-2">Duration Scale</h2>
          <p className="text-neutral-600 mb-8">
            Visual representation of the duration scale. Bars represent relative
            timing.
          </p>
        </div>

        <div className="space-y-6">
          {(Object.keys(durations) as Duration[]).map((key) => {
            const value = durations[key];
            const percentage = (value / maxDuration) * 100;

            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium capitalize w-20">{key}</p>
                  <div className="flex-1 mx-4 h-8 bg-neutral-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-primary rounded transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-neutral-600 font-mono w-16 text-right">
                    {value}s
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> These durations follow a semantic scale
            designed for common UI patterns. Start with "normal" (250ms) and
            adjust based on complexity and feedback.
          </p>
        </div>
      </div>
    );
  },
};
