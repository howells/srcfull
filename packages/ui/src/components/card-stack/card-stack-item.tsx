"use client";

import { cn } from "@repo/ui/utils/cn";
import {
  animate,
  easeIn,
  mix,
  motion,
  type PanInfo,
  progress,
  useMotionValue,
  useTransform,
  wrap,
} from "motion/react";
import type * as React from "react";

export type CardStackItemProps = {
  children?: React.ReactNode;
  className?: string;
  index?: number;
  currentIndex?: number;
  totalCards?: number;
  maxRotate?: number;
  minDistance?: number;
  minSpeed?: number;
  setNextImage?: () => void;
  aspectRatio?: number;
  isNew?: boolean;
  baseRotation?: number;
};

/**
 * CardStackItem represents a single card in the stack.
 * Must be used as a child of CardStack.
 */
export function CardStackItem({
  children,
  className,
  index = 0,
  currentIndex = 0,
  totalCards = 1,
  maxRotate = 5,
  minDistance = 400,
  minSpeed = 50,
  setNextImage,
  aspectRatio,
  isNew = false,
  baseRotation = 0,
}: CardStackItemProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(
    x,
    [0, 400],
    [baseRotation, baseRotation + (baseRotation > 0 ? 5 : -5)],
    { clamp: false }
  );
  const zIndex = totalCards - wrap(totalCards, 0, index - currentIndex + 1);

  const handleDragEnd: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void = (_event, _info) => {
    const distance = Math.abs(x.get());
    const speed = Math.abs(x.getVelocity());

    if (distance > minDistance || speed > minSpeed) {
      setNextImage?.();

      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 40,
      });
    } else {
      animate(x, 0, {
        type: "spring",
        stiffness: 250,
        damping: 35,
      });
    }
  };

  const progressInStack = progress(0, totalCards - 1, zIndex);
  const scale = mix(0.88, 1, easeIn(progressInStack));

  return (
    <motion.li
      animate={{ opacity: 1, scale }}
      className={cn(
        "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 overflow-hidden rounded-xl shadow-sm will-change-transform",
        aspectRatio && aspectRatio > 1 ? "h-auto w-full" : "h-full w-auto",
        className
      )}
      data-component="card-stack-item"
      drag={index === currentIndex ? "x" : false}
      exit={{ opacity: 0, scale: 0.5 }}
      initial={isNew ? { opacity: 0, scale: 0.3 } : false}
      onDragEnd={handleDragEnd}
      style={{
        aspectRatio: aspectRatio ? aspectRatio : undefined,
        zIndex,
        rotate,
        x,
      }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 35,
      }}
      whileTap={index === currentIndex ? { scale: 0.99 } : {}}
    >
      {children}
    </motion.li>
  );
}
