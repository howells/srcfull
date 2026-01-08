"use client";

import { easings } from "@repo/ui/lib/motion";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export type SearchAssistantProps = {
  message: string;
  visible: boolean;
};

export function SearchAssistant({ message, visible }: SearchAssistantProps) {
  const [gradientPosition, setGradientPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mb-6 h-8 overflow-visible">
      <motion.div
        animate={{
          y: visible ? 0 : 60,
          opacity: visible ? 1 : 0,
          filter: visible ? "blur(0px)" : "blur(4px)",
        }}
        className="absolute inset-0 flex items-center gap-3"
        style={{ marginLeft: "16px", zIndex: 1 }}
        transition={{
          duration: 0.25,
          ease: visible ? easings.customOut : easings.customIn,
        }}
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full">
          <div
            className="h-full w-full rounded-full"
            style={{
              background: `linear-gradient(${gradientPosition}deg, #dbeafe, #bfdbfe, #93c5fd)`,
              filter: "blur(0.5px)",
            }}
          />
        </div>
        <motion.div
          animate={{ opacity: 1 }}
          aria-live="polite"
          className="font-normal text-[15px] text-gray-600 leading-relaxed"
          initial={{ opacity: 0 }}
          key={message}
          role="status"
          style={{ letterSpacing: "-0.01em" }}
          transition={{ duration: 0.3, ease: easings.smooth }}
        >
          {message}
        </motion.div>
      </motion.div>
    </div>
  );
}
