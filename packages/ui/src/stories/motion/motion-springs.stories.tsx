import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { useState } from "react";
import { motion } from "motion/react";
import { springs, type SpringType } from "@materia/motion/springs";

const meta = {
  title: "Motion/Springs",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive showcase of spring configuration tokens.
 * Springs create physics-based animations with velocity-aware motion and bounce.
 */
export const AllSprings: Story = {
  render: () => {
    const springKeys = Object.keys(springs) as SpringType[];
    const [animatingBoxes, setAnimatingBoxes] = useState<Record<string, boolean>>(
      Object.fromEntries(springKeys.map((key) => [key, false]))
    );

    const toggleBox = (key: string) => {
      setAnimatingBoxes((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleAll = () => {
      const allAnimating = Object.values(animatingBoxes).every((v) => v);
      setAnimatingBoxes(
        Object.fromEntries(springKeys.map((key) => [key, !allAnimating]))
      );
    };

    const allAnimating = Object.values(animatingBoxes).every((v) => v);

    return (
      <div className="w-full max-w-4xl mx-auto p-8 space-y-12">
        <div>
          <h2 className="text-2xl font-medium mb-2">Spring Configurations</h2>
          <p className="text-neutral-600 mb-8">
            Click "Trigger Animation" to see spring physics in action. Springs
            create natural, bouncy animations with different personalities. The
            animation will repeat when triggered again.
          </p>

          <button
            onClick={toggleAll}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg mb-8 hover:bg-primary/90 transition-colors"
          >
            {allAnimating ? "Stop" : "Trigger"} Animation
          </button>
        </div>

        <div className="grid gap-8">
          {springKeys.map((key) => {
            const spring = springs[key];

            return (
              <div
                key={key}
                className="border border-neutral-200 rounded-lg p-6 space-y-4"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-medium capitalize">{key}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
                    <p>
                      <span className="font-medium">Stiffness:</span>{" "}
                      {spring.stiffness}
                    </p>
                    <p>
                      <span className="font-medium">Damping:</span>{" "}
                      {spring.damping}
                    </p>
                    <p>
                      <span className="font-medium">Mass:</span> {spring.mass}
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-lg p-8 flex items-center justify-start h-24 overflow-hidden">
                  <motion.div
                    className="w-12 h-12 bg-primary rounded-lg cursor-pointer transition-shadow hover:shadow-lg"
                    onClick={() => toggleBox(key)}
                    animate={
                      animatingBoxes[key] ? { x: 300 } : { x: 0 }
                    }
                    transition={spring}
                  />
                </div>

                <p className="text-xs text-neutral-500">
                  {key === "subtle" &&
                    "Barely noticeable bounce - professional and polished"}
                  {key === "natural" &&
                    "Balanced bounce - default choice for most interactions"}
                  {key === "playful" &&
                    "Character with bounce - fun and delightful"}
                  {key === "snappy" &&
                    "Quick and responsive - quick feedback for interactions"}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>About Springs:</strong> Spring physics use stiffness
            (strength), damping (resistance), and mass to create natural motion.
            Higher stiffness = faster, quicker response. Higher damping =
            smoother, less bounce.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Spring comparison grid.
 * See all springs side-by-side for quick reference.
 */
export const SpringComparison: Story = {
  render: () => {
    const springKeys = Object.keys(springs) as SpringType[];
    const [animatingBoxes, setAnimatingBoxes] = useState<Record<string, boolean>>(
      Object.fromEntries(springKeys.map((key) => [key, false]))
    );

    const toggleBox = (key: string) => {
      setAnimatingBoxes((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleAll = () => {
      const allAnimating = Object.values(animatingBoxes).every((v) => v);
      setAnimatingBoxes(
        Object.fromEntries(springKeys.map((key) => [key, !allAnimating]))
      );
    };

    const allAnimating = Object.values(animatingBoxes).every((v) => v);

    return (
      <div className="w-full max-w-6xl mx-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-medium mb-2">Spring Comparison</h2>
          <p className="text-neutral-600 mb-8">
            Compare all spring configurations side-by-side. Watch the
            differences in bounce and responsiveness.
          </p>

          <button
            onClick={toggleAll}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {allAnimating ? "Reset" : "Animate"}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {springKeys.map((key) => {
            const spring = springs[key];

            return (
              <div key={key} className="space-y-3">
                <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50 h-24 flex items-center overflow-hidden">
                  <motion.div
                    className="w-6 h-6 bg-primary rounded cursor-pointer transition-shadow hover:shadow-lg"
                    onClick={() => toggleBox(key)}
                    animate={animatingBoxes[key] ? { x: 120 } : { x: 0 }}
                    transition={spring}
                  />
                </div>

                <div className="space-y-1">
                  <p className="font-medium text-sm capitalize">{key}</p>
                  <div className="text-xs text-neutral-600 space-y-0.5">
                    <p>S: {spring.stiffness}</p>
                    <p>D: {spring.damping}</p>
                    <p>M: {spring.mass}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

/**
 * Spring parameters visualization.
 * Understand how stiffness and damping affect spring behavior.
 */
export const SpringParameters: Story = {
  render: () => {
    const [isAnimating, setIsAnimating] = useState(false);

    return (
      <div className="w-full max-w-6xl mx-auto p-8 space-y-12">
        <div>
          <h2 className="text-2xl font-medium mb-2">Spring Parameters</h2>
          <p className="text-neutral-600 mb-8">
            Understanding stiffness and damping helps you create the right feel
            for your animations.
          </p>

          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {isAnimating ? "Reset" : "Animate"}
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Stiffness explanation */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Stiffness</h3>
              <p className="text-sm text-neutral-600">
                Controls how aggressively the spring pulls toward its target.
                Higher values = faster, snappier response.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: "Low (170)", value: 170 },
                { label: "Medium (200)", value: 200 },
                { label: "High (300)", value: 300 },
                { label: "Very High (400)", value: 400 },
              ].map((item) => (
                <div key={item.value} className="space-y-2">
                  <p className="text-sm font-medium">{item.label}</p>
                  <div className="bg-neutral-50 rounded-lg p-4 h-20 flex items-center overflow-hidden">
                    <motion.div
                      className="w-6 h-6 bg-primary rounded"
                      animate={isAnimating ? { x: 180 } : { x: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: item.value,
                        damping: 15,
                        mass: 1,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Damping explanation */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Damping</h3>
              <p className="text-sm text-neutral-600">
                Controls resistance to motion. Higher values = less bounce, more
                controlled.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: "Low (15)", value: 15 },
                { label: "Medium (20)", value: 20 },
                { label: "High (28)", value: 28 },
                { label: "Very High (30)", value: 30 },
              ].map((item) => (
                <div key={item.value} className="space-y-2">
                  <p className="text-sm font-medium">{item.label}</p>
                  <div className="bg-neutral-50 rounded-lg p-4 h-20 flex items-center overflow-hidden">
                    <motion.div
                      className="w-6 h-6 bg-primary rounded"
                      animate={isAnimating ? { x: 180 } : { x: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: item.value,
                        mass: 1,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Use cases */}
        <div className="grid gap-8 md:grid-cols-2">
          {[
            {
              key: "subtle",
              title: "Subtle Spring",
              use: "Polished professional interactions, hover effects",
            },
            {
              key: "natural",
              title: "Natural Spring",
              use: "Default choice, smooth interactions, dialogs",
            },
            {
              key: "playful",
              title: "Playful Spring",
              use: "Fun interactions, character, engagement",
            },
            {
              key: "snappy",
              title: "Snappy Spring",
              use: "Quick feedback, responsive interactions",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="border border-neutral-200 rounded-lg p-4"
            >
              <p className="font-medium text-sm mb-1">{item.title}</p>
              <p className="text-xs text-neutral-600">{item.use}</p>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Spring in practice with real interactions.
 * Shows springs applied to common UI patterns.
 */
export const SpringInPractice: Story = {
  render: () => {
    const [clicked, setClicked] = useState<Record<string, boolean>>({
      button: false,
      card: false,
    });

    return (
      <div className="w-full max-w-6xl mx-auto p-8 space-y-12">
        <div>
          <h2 className="text-2xl font-medium mb-2">Springs in Practice</h2>
          <p className="text-neutral-600 mb-8">
            Interactive examples using springs for real UI patterns.
          </p>
        </div>

        {/* Hover effect */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Hover Lift (Snappy Spring)</h3>
          <div className="bg-neutral-50 rounded-lg p-8 flex items-center justify-center h-32">
            <motion.div
              className="w-20 h-20 bg-primary rounded-lg cursor-pointer shadow-md"
              onMouseEnter={() => setClicked({ ...clicked, button: true })}
              onMouseLeave={() => setClicked({ ...clicked, button: false })}
              animate={clicked.button ? { y: -8 } : { y: 0 }}
              transition={springs.snappy}
            />
          </div>
          <p className="text-sm text-neutral-600">
            Hover over the box to see the spring lift effect
          </p>
        </div>

        {/* Card interaction */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Card Interaction (Natural Spring)
          </h3>
          <div className="bg-neutral-50 rounded-lg p-8 flex items-center justify-center h-40">
            <motion.div
              className="w-32 h-32 bg-secondary rounded-xl cursor-pointer shadow-lg"
              onClick={() => setClicked({ ...clicked, card: !clicked.card })}
              animate={
                clicked.card
                  ? { scale: 1.05, rotateZ: 2 }
                  : { scale: 1, rotateZ: 0 }
              }
              transition={springs.natural}
            />
          </div>
          <p className="text-sm text-neutral-600">
            Click the card to see the natural spring effect
          </p>
        </div>

        {/* Button press */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Button Press (Subtle Spring)
          </h3>
          <div className="bg-neutral-50 rounded-lg p-8 flex items-center justify-center h-24">
            <motion.button
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
              whilePress={{ scale: 0.98 }}
              transition={springs.subtle}
            >
              Press me
            </motion.button>
          </div>
          <p className="text-sm text-neutral-600">
            Press the button to feel the subtle spring effect
          </p>
        </div>
      </div>
    );
  },
};
