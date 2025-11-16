import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { presets, type Preset } from "@materia/motion/presets";

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
      <div className="w-full max-w-4xl mx-auto p-8 space-y-12">
        <div>
          <h2 className="text-2xl font-medium mb-2">Motion Presets</h2>
          <p className="text-neutral-600 mb-8">
            Presets are semantic combinations of durations, easings, and springs
            for common animation patterns. Click on any preset to see it in
            action.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {presetKeys.map((key) => (
            <button
              key={key}
              onClick={() =>
                setActivePreset(activePreset === key ? null : key)
              }
              className={`text-left p-4 rounded-lg border transition-colors ${
                activePreset === key
                  ? "border-primary bg-primary/5"
                  : "border-neutral-200 bg-white hover:bg-neutral-50"
              }`}
            >
              <p className="font-medium capitalize">{key}</p>
              <p className="text-xs text-neutral-600 mt-1">
                {key === "dialogOpen" &&
                  "Normal duration with out easing - entering dialogs"}
                {key === "dialogClose" &&
                  "Quick duration with in easing - exiting dialogs"}
                {key === "hoverLift" &&
                  "Snappy spring - hover interactions"}
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
          <div className="border border-neutral-200 rounded-lg p-8 space-y-4">
            <h3 className="text-lg font-medium capitalize">
              {activePreset} Preview
            </h3>

            <div className="bg-neutral-50 rounded-lg p-8 min-h-40 flex items-center justify-start overflow-hidden">
              <AnimatePresence mode="wait">
                {activePreset === "dialogOpen" || activePreset === "dialogClose"
                  ? (
                      <motion.div
                        key="dialog"
                        className="w-32 h-24 bg-primary rounded-lg cursor-pointer transition-shadow hover:shadow-lg"
                        onClick={() => setActivePreset(activePreset === "dialogOpen" ? "dialogClose" : "dialogOpen")}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={
                          activePreset === "dialogOpen"
                            ? presets.dialogOpen
                            : presets.dialogClose
                        }
                      />
                    )
                  : null}

                {activePreset === "slideIn" || activePreset === "slideOut"
                  ? (
                      <motion.div
                        key="slide"
                        className="w-12 h-12 bg-secondary rounded cursor-pointer transition-shadow hover:shadow-lg"
                        onClick={() => setActivePreset(activePreset === "slideIn" ? "slideOut" : "slideIn")}
                        initial={{ x: activePreset === "slideIn" ? -100 : 100 }}
                        animate={{ x: 0 }}
                        exit={{
                          x: activePreset === "slideOut" ? -100 : 100,
                        }}
                        transition={
                          activePreset === "slideIn"
                            ? presets.slideIn
                            : presets.slideOut
                        }
                      />
                    )
                  : null}

                {activePreset === "fadeIn" || activePreset === "fadeOut"
                  ? (
                      <motion.div
                        key="fade"
                        className="w-16 h-16 bg-accent rounded cursor-pointer transition-shadow hover:shadow-lg"
                        onClick={() => setActivePreset(activePreset === "fadeIn" ? "fadeOut" : "fadeIn")}
                        initial={{
                          opacity: activePreset === "fadeIn" ? 0 : 1,
                        }}
                        animate={{
                          opacity: activePreset === "fadeOut" ? 0 : 1,
                        }}
                        transition={
                          activePreset === "fadeIn"
                            ? presets.fadeIn
                            : presets.fadeOut
                        }
                      />
                    )
                  : null}

                {activePreset === "hoverLift" || activePreset === "hoverSettle"
                  ? (
                      <motion.div
                        key="hover"
                        className="w-14 h-14 bg-ring rounded-lg cursor-pointer transition-shadow hover:shadow-lg"
                        onClick={() => setActivePreset(activePreset === "hoverLift" ? "hoverSettle" : "hoverLift")}
                        initial={{ y: 0 }}
                        animate={{ y: -8 }}
                        transition={
                          activePreset === "hoverLift"
                            ? presets.hoverLift
                            : presets.hoverSettle
                        }
                      />
                    )
                  : null}
              </AnimatePresence>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-xs text-blue-900 font-mono">
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
      <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-medium mb-2">Dialog Presets</h2>
          <p className="text-neutral-600 mb-8">
            dialogOpen: Used when opening dialogs/modals/sheets.
            dialogClose: Used when closing them. Click the button to see the
            animations in sequence.
          </p>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {isOpen ? "Close" : "Open"} Dialog
          </button>
        </div>

        <div className="bg-neutral-50 rounded-lg p-8 h-80 flex items-center justify-center overflow-hidden relative">
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="absolute inset-0 bg-black/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={presets.dialogOpen}
                />

                {/* Dialog */}
                <motion.div
                  className="relative bg-white rounded-lg shadow-xl p-8 max-w-sm w-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={presets.dialogOpen}
                >
                  <h3 className="text-lg font-medium mb-2">Dialog Title</h3>
                  <p className="text-neutral-600 text-sm mb-4">
                    This dialog uses dialogOpen for entrance and dialogClose for
                    exit animations.
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
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
      <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-medium mb-2">Slide Presets</h2>
          <p className="text-neutral-600 mb-8">
            slideIn: Used when elements enter from the side. slideOut: Used when
            elements leave. Toggle between directions to see both animations.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setDirection("in")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                direction === "in"
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
              }`}
            >
              Slide In
            </button>
            <button
              onClick={() => setDirection("out")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                direction === "out"
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
              }`}
            >
              Slide Out
            </button>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-lg p-8 h-64 flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            {direction === "in"
              ? (
                  <motion.div
                    key="in"
                    className="w-20 h-20 bg-primary rounded-lg"
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    exit={{ x: -100 }}
                    transition={presets.slideIn}
                  />
                )
              : (
                  <motion.div
                    key="out"
                    className="w-20 h-20 bg-secondary rounded-lg"
                    initial={{ x: 0 }}
                    animate={{ x: 100 }}
                    exit={{ x: 100 }}
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
      <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-medium mb-2">Fade Presets</h2>
          <p className="text-neutral-600 mb-8">
            fadeIn: Used when elements appear. fadeOut: Used when elements
            disappear. Both use quick timing for snappy transitions.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setDirection("in")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                direction === "in"
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
              }`}
            >
              Fade In
            </button>
            <button
              onClick={() => setDirection("out")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                direction === "out"
                  ? "bg-primary text-primary-foreground"
                  : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
              }`}
            >
              Fade Out
            </button>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-lg p-8 h-64 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {direction === "in"
              ? (
                  <motion.div
                    key="in"
                    className="w-32 h-32 bg-accent rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={presets.fadeIn}
                  />
                )
              : (
                  <motion.div
                    key="out"
                    className="w-32 h-32 bg-secondary rounded-lg"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
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
    const [isHovering, setIsHovering] = useState<
      "lift" | "settle" | null
    >(null);

    return (
      <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-medium mb-2">Hover Spring Presets</h2>
          <p className="text-neutral-600 mb-8">
            hoverLift: Quick snappy response for primary interactions.
            hoverSettle: Smooth natural response for secondary interactions.
            Hover over the boxes to see the difference.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Hover Lift */}
          <div className="space-y-4">
            <h3 className="font-medium">Hover Lift (Snappy)</h3>
            <div className="bg-neutral-50 rounded-lg p-8 h-48 flex items-end justify-center">
              <motion.div
                className="w-16 h-16 bg-primary rounded-lg shadow-md cursor-pointer"
                onMouseEnter={() => setIsHovering("lift")}
                onMouseLeave={() => setIsHovering(null)}
                animate={isHovering === "lift" ? { y: -12 } : { y: 0 }}
                transition={presets.hoverLift}
              />
            </div>
            <p className="text-sm text-neutral-600">
              Quick and responsive feedback
            </p>
          </div>

          {/* Hover Settle */}
          <div className="space-y-4">
            <h3 className="font-medium">Hover Settle (Natural)</h3>
            <div className="bg-neutral-50 rounded-lg p-8 h-48 flex items-end justify-center">
              <motion.div
                className="w-16 h-16 bg-secondary rounded-lg shadow-md cursor-pointer"
                onMouseEnter={() => setIsHovering("settle")}
                onMouseLeave={() => setIsHovering(null)}
                animate={isHovering === "settle" ? { y: -12 } : { y: 0 }}
                transition={presets.hoverSettle}
              />
            </div>
            <p className="text-sm text-neutral-600">
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
      <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-medium mb-2">Real-World Example</h2>
          <p className="text-neutral-600 mb-8">
            A realistic scenario combining multiple presets. Hover over cards
            and click to open a detail view.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="bg-white border border-neutral-200 rounded-lg p-4 cursor-pointer h-32 flex flex-col items-center justify-center"
              onMouseEnter={() => toggleCardHover(i, true)}
              onMouseLeave={() => toggleCardHover(i, false)}
              onClick={() => setIsCardOpen(!isCardOpen)}
              animate={hoveredCards[i] ? { y: -4 } : { y: 0 }}
              transition={presets.hoverSettle}
            >
              <div className="w-12 h-12 bg-primary rounded-lg mb-2" />
              <p className="text-sm font-medium">Card {i}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isCardOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={presets.dialogOpen}
                onClick={() => setIsCardOpen(false)}
              />

              <motion.div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={presets.dialogOpen}
              >
                <h3 className="text-xl font-medium mb-4">Card Details</h3>
                <p className="text-neutral-600 text-sm mb-6">
                  This dialog opened with dialogOpen preset. It uses scale and
                  opacity for a smooth entrance.
                </p>

                <motion.button
                  className="px-4 py-2 bg-primary text-primary-foreground rounded"
                  whileHover={{ scale: 1.05 }}
                  transition={presets.hoverLift}
                  onClick={() => setIsCardOpen(false)}
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
