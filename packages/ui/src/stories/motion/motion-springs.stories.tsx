import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { type SpringType, springs } from "@repo/ui/lib/motion";
import { motion } from "motion/react";
import { useState } from "react";

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
    const [animatingBoxes, setAnimatingBoxes] = useState<
      Record<string, boolean>
    >(Object.fromEntries(springKeys.map((key) => [key, false])));

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
      <div className="mx-auto w-full max-w-4xl space-y-12 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Spring Configurations</h2>
          <p className="mb-8 text-neutral-600">
            Click "Trigger Animation" to see spring physics in action. Springs
            create natural, bouncy animations with different personalities. The
            animation will repeat when triggered again.
          </p>

          <button
            className="mb-8 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={toggleAll}
          >
            {allAnimating ? "Stop" : "Trigger"} Animation
          </button>
        </div>

        <div className="grid gap-8">
          {springKeys.map((key) => {
            const spring = springs[key];

            return (
              <div
                className="space-y-4 rounded-lg border border-neutral-200 p-6"
                key={key}
              >
                <div className="space-y-2">
                  <h3 className="font-medium text-lg capitalize">{key}</h3>
                  <div className="grid grid-cols-2 gap-2 text-neutral-600 text-xs">
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

                <div className="flex h-24 items-center justify-start overflow-hidden rounded-lg bg-neutral-50 p-8">
                  <motion.div
                    animate={animatingBoxes[key] ? { x: 300 } : { x: 0 }}
                    className="h-12 w-12 cursor-pointer rounded-lg bg-primary transition-shadow hover:shadow-lg"
                    onClick={() => toggleBox(key)}
                    transition={spring}
                  />
                </div>

                <p className="text-neutral-500 text-xs">
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

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-blue-900 text-sm">
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
    const [animatingBoxes, setAnimatingBoxes] = useState<
      Record<string, boolean>
    >(Object.fromEntries(springKeys.map((key) => [key, false])));

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
      <div className="mx-auto w-full max-w-6xl space-y-8 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Spring Comparison</h2>
          <p className="mb-8 text-neutral-600">
            Compare all spring configurations side-by-side. Watch the
            differences in bounce and responsiveness.
          </p>

          <button
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={toggleAll}
          >
            {allAnimating ? "Reset" : "Animate"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {springKeys.map((key) => {
            const spring = springs[key];

            return (
              <div className="space-y-3" key={key}>
                <div className="flex h-24 items-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                  <motion.div
                    animate={animatingBoxes[key] ? { x: 120 } : { x: 0 }}
                    className="h-6 w-6 cursor-pointer rounded bg-primary transition-shadow hover:shadow-lg"
                    onClick={() => toggleBox(key)}
                    transition={spring}
                  />
                </div>

                <div className="space-y-1">
                  <p className="font-medium text-sm capitalize">{key}</p>
                  <div className="space-y-0.5 text-neutral-600 text-xs">
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
      <div className="mx-auto w-full max-w-6xl space-y-12 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Spring Parameters</h2>
          <p className="mb-8 text-neutral-600">
            Understanding stiffness and damping helps you create the right feel
            for your animations.
          </p>

          <button
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={() => setIsAnimating(!isAnimating)}
          >
            {isAnimating ? "Reset" : "Animate"}
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Stiffness explanation */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium text-lg">Stiffness</h3>
              <p className="text-neutral-600 text-sm">
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
                <div className="space-y-2" key={item.value}>
                  <p className="font-medium text-sm">{item.label}</p>
                  <div className="flex h-20 items-center overflow-hidden rounded-lg bg-neutral-50 p-4">
                    <motion.div
                      animate={isAnimating ? { x: 180 } : { x: 0 }}
                      className="h-6 w-6 rounded bg-primary"
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
              <h3 className="mb-2 font-medium text-lg">Damping</h3>
              <p className="text-neutral-600 text-sm">
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
                <div className="space-y-2" key={item.value}>
                  <p className="font-medium text-sm">{item.label}</p>
                  <div className="flex h-20 items-center overflow-hidden rounded-lg bg-neutral-50 p-4">
                    <motion.div
                      animate={isAnimating ? { x: 180 } : { x: 0 }}
                      className="h-6 w-6 rounded bg-primary"
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
              className="rounded-lg border border-neutral-200 p-4"
              key={item.key}
            >
              <p className="mb-1 font-medium text-sm">{item.title}</p>
              <p className="text-neutral-600 text-xs">{item.use}</p>
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
      <div className="mx-auto w-full max-w-6xl space-y-12 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Springs in Practice</h2>
          <p className="mb-8 text-neutral-600">
            Interactive examples using springs for real UI patterns.
          </p>
        </div>

        {/* Hover effect */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Hover Lift (Snappy Spring)</h3>
          <div className="flex h-32 items-center justify-center rounded-lg bg-neutral-50 p-8">
            <motion.div
              animate={clicked.button ? { y: -8 } : { y: 0 }}
              className="h-20 w-20 cursor-pointer rounded-lg bg-primary shadow-md"
              onMouseEnter={() => setClicked({ ...clicked, button: true })}
              onMouseLeave={() => setClicked({ ...clicked, button: false })}
              transition={springs.snappy}
            />
          </div>
          <p className="text-neutral-600 text-sm">
            Hover over the box to see the spring lift effect
          </p>
        </div>

        {/* Card interaction */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">
            Card Interaction (Natural Spring)
          </h3>
          <div className="flex h-40 items-center justify-center rounded-lg bg-neutral-50 p-8">
            <motion.div
              animate={
                clicked.card
                  ? { scale: 1.05, rotateZ: 2 }
                  : { scale: 1, rotateZ: 0 }
              }
              className="h-32 w-32 cursor-pointer rounded-xl bg-secondary shadow-lg"
              onClick={() => setClicked({ ...clicked, card: !clicked.card })}
              transition={springs.natural}
            />
          </div>
          <p className="text-neutral-600 text-sm">
            Click the card to see the natural spring effect
          </p>
        </div>

        {/* Button press */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Button Press (Subtle Spring)</h3>
          <div className="flex h-24 items-center justify-center rounded-lg bg-neutral-50 p-8">
            <motion.button
              className="rounded-lg bg-primary px-6 py-2 text-primary-foreground"
              transition={springs.subtle}
              whilePress={{ scale: 0.98 }}
            >
              Press me
            </motion.button>
          </div>
          <p className="text-neutral-600 text-sm">
            Press the button to feel the subtle spring effect
          </p>
        </div>
      </div>
    );
  },
};
