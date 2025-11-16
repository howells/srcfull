"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { easings } from "@materia/motion/easings";

export interface SearchAssistantProps {
  message: string;
  visible: boolean;
}

export function SearchAssistant({ message, visible }: SearchAssistantProps) {
  const [gradientPosition, setGradientPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-6 h-8 relative overflow-visible">
      <motion.div
        animate={{
          y: visible ? 0 : 60,
          opacity: visible ? 1 : 0,
          filter: visible ? "blur(0px)" : "blur(4px)",
        }}
        transition={{
          duration: 0.25,
          ease: visible ? easings.customOut : easings.customIn,
        }}
        className="flex items-center gap-3 absolute inset-0"
        style={{ marginLeft: "16px", zIndex: 1 }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `linear-gradient(${gradientPosition}deg, #dbeafe, #bfdbfe, #93c5fd)`,
              filter: "blur(0.5px)",
            }}
          />
        </div>
        <motion.div
          key={message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: easings.smooth }}
          className="text-[15px] text-gray-600 font-normal leading-relaxed"
          style={{ letterSpacing: "-0.01em" }}
          role="status"
          aria-live="polite"
        >
          {message}
        </motion.div>
      </motion.div>
    </div>
  );
}
