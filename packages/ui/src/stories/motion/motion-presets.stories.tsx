import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { type Preset, presets } from "@repo/ui/lib/motion";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const meta = {
  title: "Motion/Presets",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive showcase of motion preset tokens.
 * Presets combine durations, easings, and springs into semantic patterns.
 */
export const AllPresets: Story = {
  render: () => {
    const [activePreset, setActivePreset] = useState<Preset | null>(null);

    const presetKeys = Object.keys(presets) as Preset[];

    return (
      <div className="mx-auto w-full max-w-4xl space-y-12 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Motion Presets</h2>
          <p className="mb-8 text-neutral-600">
            Presets are semantic combinations of durations, easings, and springs
            for common animation patterns. Click on any preset to see it in
            action.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {presetKeys.map((key) => (
            <button
              className={`rounded-lg border p-4 text-left transition-colors ${
                activePreset === key
                  ? "border-primary bg-primary/5"
                  : "border-neutral-200 bg-white hover:bg-neutral-50"
              }`}
              key={key}
              onClick={() => setActivePreset(activePreset === key ? null : key)}
            >
              <p className="font-medium capitalize">{key}</p>
              <p className="mt-1 text-neutral-600 text-xs">
                {key === "dialogOpen" &&
                  "Normal duration with out easing - entering dialogs"}
                {key === "dialogClose" &&
                  "Quick duration with in easing - exiting dialogs"}
                {key === "hoverLift" && "Snappy spring - hover interactions"}
                {key === "hoverSettle" &&
                  "Natural spring - general hover effects"}
                {key === "slideIn" &&
                  "Normal duration with out easing - entering slides"}
                {key === "slideOut" &&
                  "Quick duration with in easing - exiting slides"}
                {key === "fadeIn" &&
                  "Quick duration with out easing - appearing elements"}
                {key === "fadeOut" &&
                  "Quick duration with in easing - disappearing elements"}
              </p>
            </button>
          ))}
        </div>

        {activePreset && (
          <div className="space-y-4 rounded-lg border border-neutral-200 p-8">
            <h3 className="font-medium text-lg capitalize">
              {activePreset} Preview
            </h3>

            <div className="flex min-h-40 items-center justify-start overflow-hidden rounded-lg bg-neutral-50 p-8">
              <AnimatePresence mode="wait">
                {activePreset === "dialogOpen" ||
                activePreset === "dialogClose" ? (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-24 w-32 cursor-pointer rounded-lg bg-primary transition-shadow hover:shadow-lg"
                    exit={{ opacity: 0, scale: 0.8 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    key="dialog"
                    onClick={() =>
                      setActivePreset(
                        activePreset === "dialogOpen"
                          ? "dialogClose"
                          : "dialogOpen"
                      )
                    }
                    transition={
                      activePreset === "dialogOpen"
                        ? presets.dialogOpen
                        : presets.dialogClose
                    }
                  />
                ) : null}

                {activePreset === "slideIn" || activePreset === "slideOut" ? (
                  <motion.div
                    animate={{ x: 0 }}
                    className="h-12 w-12 cursor-pointer rounded bg-secondary transition-shadow hover:shadow-lg"
                    exit={{
                      x: activePreset === "slideOut" ? -100 : 100,
                    }}
                    initial={{ x: activePreset === "slideIn" ? -100 : 100 }}
                    key="slide"
                    onClick={() =>
                      setActivePreset(
                        activePreset === "slideIn" ? "slideOut" : "slideIn"
                      )
                    }
                    transition={
                      activePreset === "slideIn"
                        ? presets.slideIn
                        : presets.slideOut
                    }
                  />
                ) : null}

                {activePreset === "fadeIn" || activePreset === "fadeOut" ? (
                  <motion.div
                    animate={{
                      opacity: activePreset === "fadeOut" ? 0 : 1,
                    }}
                    className="h-16 w-16 cursor-pointer rounded bg-accent transition-shadow hover:shadow-lg"
                    initial={{
                      opacity: activePreset === "fadeIn" ? 0 : 1,
                    }}
                    key="fade"
                    onClick={() =>
                      setActivePreset(
                        activePreset === "fadeIn" ? "fadeOut" : "fadeIn"
                      )
                    }
                    transition={
                      activePreset === "fadeIn"
                        ? presets.fadeIn
                        : presets.fadeOut
                    }
                  />
                ) : null}

                {activePreset === "hoverLift" ||
                activePreset === "hoverSettle" ? (
                  <motion.div
                    animate={{ y: -8 }}
                    className="h-14 w-14 cursor-pointer rounded-lg bg-ring transition-shadow hover:shadow-lg"
                    initial={{ y: 0 }}
                    key="hover"
                    onClick={() =>
                      setActivePreset(
                        activePreset === "hoverLift"
                          ? "hoverSettle"
                          : "hoverLift"
                      )
                    }
                    transition={
                      activePreset === "hoverLift"
                        ? presets.hoverLift
                        : presets.hoverSettle
                    }
                  />
                ) : null}
              </AnimatePresence>
            </div>

            <div className="rounded border border-blue-200 bg-blue-50 p-3">
              <p className="font-mono text-blue-900 text-xs">
                {JSON.stringify(presets[activePreset], null, 2)}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Dialog animation presets.
 * Shows dialogOpen and dialogClose in context.
 */
export const DialogPresets: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Dialog Presets</h2>
          <p className="mb-8 text-neutral-600">
            dialogOpen: Used when opening dialogs/modals/sheets. dialogClose:
            Used when closing them. Click the button to see the animations in
            sequence.
          </p>

          <button
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Close" : "Open"} Dialog
          </button>
        </div>

        <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-lg bg-neutral-50 p-8">
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/20"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={presets.dialogOpen}
                />

                {/* Dialog */}
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-full max-w-sm rounded-lg bg-white p-8 shadow-xl"
                  exit={{ opacity: 0, scale: 0.8 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  transition={presets.dialogOpen}
                >
                  <h3 className="mb-2 font-medium text-lg">Dialog Title</h3>
                  <p className="mb-4 text-neutral-600 text-sm">
                    This dialog uses dialogOpen for entrance and dialogClose for
                    exit animations.
                  </p>
                  <button
                    className="rounded bg-primary px-4 py-2 text-primary-foreground text-sm transition-colors hover:bg-primary/90"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
};

/**
 * Slide animation presets.
 * Shows slideIn and slideOut in context.
 */
export const SlidePresets: Story = {
  render: () => {
    const [direction, setDirection] = useState<"in" | "out">("in");

    return (
      <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Slide Presets</h2>
          <p className="mb-8 text-neutral-600">
            slideIn: Used when elements enter from the side. slideOut: Used when
            elements leave. Toggle between directions to see both animations.
          </p>

          <div className="flex gap-3">
            <button
              className={`rounded-lg px-4 py-2 transition-colors ${
                direction === "in"
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
              }`}
              onClick={() => setDirection("in")}
            >
              Slide In
            </button>
            <button
              className={`rounded-lg px-4 py-2 transition-colors ${
                direction === "out"
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
              }`}
              onClick={() => setDirection("out")}
            >
              Slide Out
            </button>
          </div>
        </div>

        <div className="flex h-64 items-center overflow-hidden rounded-lg bg-neutral-50 p-8">
          <AnimatePresence mode="wait">
            {direction === "in" ? (
              <motion.div
                animate={{ x: 0 }}
                className="h-20 w-20 rounded-lg bg-primary"
                exit={{ x: -100 }}
                initial={{ x: -100 }}
                key="in"
                transition={presets.slideIn}
              />
            ) : (
              <motion.div
                animate={{ x: 100 }}
                className="h-20 w-20 rounded-lg bg-secondary"
                exit={{ x: 100 }}
                initial={{ x: 0 }}
                key="out"
                transition={presets.slideOut}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
};

/**
 * Fade animation presets.
 * Shows fadeIn and fadeOut in context.
 */
export const FadePresets: Story = {
  render: () => {
    const [direction, setDirection] = useState<"in" | "out">("in");

    return (
      <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Fade Presets</h2>
          <p className="mb-8 text-neutral-600">
            fadeIn: Used when elements appear. fadeOut: Used when elements
            disappear. Both use quick timing for snappy transitions.
          </p>

          <div className="flex gap-3">
            <button
              className={`rounded-lg px-4 py-2 transition-colors ${
                direction === "in"
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
              }`}
              onClick={() => setDirection("in")}
            >
              Fade In
            </button>
            <button
              className={`rounded-lg px-4 py-2 transition-colors ${
                direction === "out"
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
              }`}
              onClick={() => setDirection("out")}
            >
              Fade Out
            </button>
          </div>
        </div>

        <div className="flex h-64 items-center justify-center overflow-hidden rounded-lg bg-neutral-50 p-8">
          <AnimatePresence mode="wait">
            {direction === "in" ? (
              <motion.div
                animate={{ opacity: 1 }}
                className="h-32 w-32 rounded-lg bg-accent"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="in"
                transition={presets.fadeIn}
              />
            ) : (
              <motion.div
                animate={{ opacity: 0 }}
                className="h-32 w-32 rounded-lg bg-secondary"
                exit={{ opacity: 0 }}
                initial={{ opacity: 1 }}
                key="out"
                transition={presets.fadeOut}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
};

/**
 * Hover spring presets.
 * Shows hoverLift and hoverSettle in context.
 */
export const HoverPresets: Story = {
  render: () => {
    const [isHovering, setIsHovering] = useState<"lift" | "settle" | null>(
      null
    );

    return (
      <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Hover Spring Presets</h2>
          <p className="mb-8 text-neutral-600">
            hoverLift: Quick snappy response for primary interactions.
            hoverSettle: Smooth natural response for secondary interactions.
            Hover over the boxes to see the difference.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Hover Lift */}
          <div className="space-y-4">
            <h3 className="font-medium">Hover Lift (Snappy)</h3>
            <div className="flex h-48 items-end justify-center rounded-lg bg-neutral-50 p-8">
              <motion.div
                animate={isHovering === "lift" ? { y: -12 } : { y: 0 }}
                className="h-16 w-16 cursor-pointer rounded-lg bg-primary shadow-md"
                onMouseEnter={() => setIsHovering("lift")}
                onMouseLeave={() => setIsHovering(null)}
                transition={presets.hoverLift}
              />
            </div>
            <p className="text-neutral-600 text-sm">
              Quick and responsive feedback
            </p>
          </div>

          {/* Hover Settle */}
          <div className="space-y-4">
            <h3 className="font-medium">Hover Settle (Natural)</h3>
            <div className="flex h-48 items-end justify-center rounded-lg bg-neutral-50 p-8">
              <motion.div
                animate={isHovering === "settle" ? { y: -12 } : { y: 0 }}
                className="h-16 w-16 cursor-pointer rounded-lg bg-secondary shadow-md"
                onMouseEnter={() => setIsHovering("settle")}
                onMouseLeave={() => setIsHovering(null)}
                transition={presets.hoverSettle}
              />
            </div>
            <p className="text-neutral-600 text-sm">
              Smooth and polished interaction
            </p>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Real-world composition example.
 * Shows how multiple presets work together in a realistic UI scenario.
 */
export const RealWorldExample: Story = {
  render: () => {
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [hoveredCards, setHoveredCards] = useState<Record<number, boolean>>({
      1: false,
      2: false,
      3: false,
    });

    const toggleCardHover = (cardId: number, isHovering: boolean) => {
      setHoveredCards((prev) => ({ ...prev, [cardId]: isHovering }));
    };

    return (
      <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
        <div>
          <h2 className="mb-2 font-medium text-2xl">Real-World Example</h2>
          <p className="mb-8 text-neutral-600">
            A realistic scenario combining multiple presets. Hover over cards
            and click to open a detail view.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              animate={hoveredCards[i] ? { y: -4 } : { y: 0 }}
              className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-4"
              key={i}
              onClick={() => setIsCardOpen(!isCardOpen)}
              onMouseEnter={() => toggleCardHover(i, true)}
              onMouseLeave={() => toggleCardHover(i, false)}
              transition={presets.hoverSettle}
            >
              <div className="mb-2 h-12 w-12 rounded-lg bg-primary" />
              <p className="font-medium text-sm">Card {i}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isCardOpen && (
            <>
              <motion.div
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/20"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                onClick={() => setIsCardOpen(false)}
                transition={presets.dialogOpen}
              />

              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-full max-w-md rounded-lg bg-white p-8 shadow-xl"
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
                transition={presets.dialogOpen}
              >
                <h3 className="mb-4 font-medium text-xl">Card Details</h3>
                <p className="mb-6 text-neutral-600 text-sm">
                  This dialog opened with dialogOpen preset. It uses scale and
                  opacity for a smooth entrance.
                </p>

                <motion.button
                  className="rounded bg-primary px-4 py-2 text-primary-foreground"
                  onClick={() => setIsCardOpen(false)}
                  transition={presets.hoverLift}
                  whileHover={{ scale: 1.05 }}
                >
                  Close
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  },
};
