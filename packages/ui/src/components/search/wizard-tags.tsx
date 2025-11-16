"use client";

import { motion, AnimatePresence } from "motion/react";
import { easings } from "@repo/ui/lib/motion";

export interface WizardTagsProps {
  tags: string[];
  onSelect: (tag: string) => void;
  visible: boolean;
  currentStageKey?: string;
}

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
        key={currentStageKey}
        initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
        exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
        transition={{
          duration: 0.25,
          ease: easings.customExpand,
        }}
        className="overflow-hidden"
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
                  key={`${currentStageKey}-${tag}`}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay,
                    duration: 0.2,
                    ease: easings.smooth,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(tag)}
                    className="bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-50 hover:border-gray-300 min-h-[32px] flex items-center justify-center [transition:background-color_70ms_ease-out,border-color_70ms_ease-out] hover:[transition:none]"
                    aria-label={`Select ${tag}`}
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
