"use client";

import { easings } from "@repo/ui/lib/motion";
import { AnimatePresence, motion } from "motion/react";

export type WizardTagsProps = {
  tags: string[];
  onSelect: (tag: string) => void;
  visible: boolean;
  currentStageKey?: string;
};

export function WizardTags({
  tags,
  onSelect,
  visible,
  currentStageKey,
}: WizardTagsProps) {
  if (!visible || tags.length === 0) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
        className="overflow-hidden"
        exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
        initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
        key={currentStageKey}
        transition={{
          duration: 0.25,
          ease: easings.customExpand,
        }}
      >
        <div className="p-2 pt-0">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => {
              const itemsPerRow = 8;
              const row = Math.floor(index / itemsPerRow);
              const col = index % itemsPerRow;

              const delay = row * 0.06 + col * 0.02;

              return (
                <motion.div
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  key={`${currentStageKey}-${tag}`}
                  transition={{
                    delay,
                    duration: 0.2,
                    ease: easings.smooth,
                  }}
                >
                  <button
                    aria-label={`Select ${tag}`}
                    className="flex min-h-[32px] items-center justify-center rounded-full border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-600 text-sm [transition:background-color_70ms_ease-out,border-color_70ms_ease-out] hover:border-gray-300 hover:bg-gray-50 hover:[transition:none]"
                    onClick={() => onSelect(tag)}
                    type="button"
                  >
                    {tag}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
