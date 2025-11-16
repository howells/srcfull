"use client";

import { cn } from "@repo/ui/utils/cn";
import { AnimatePresence, wrap } from "motion/react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

export interface CardStackProps extends React.ComponentProps<"ul"> {
  totalCards: number;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  maxRotate?: number;
}

/**
 * CardStack provides a swipeable stack of cards with physics-based animations.
 * Children should be CardStackItem components.
 *
 * @example
 * ```tsx
 * <CardStack totalCards={3}>
 *   <CardStackItem index={0}>Card 1</CardStackItem>
 *   <CardStackItem index={1}>Card 2</CardStackItem>
 *   <CardStackItem index={2}>Card 3</CardStackItem>
 * </CardStack>
 * ```
 */
export function CardStack({
  children,
  className,
  totalCards,
  currentIndex: controlledIndex,
  onIndexChange,
  maxRotate = 5,
  ...props
}: CardStackProps) {
  const [uncontrolledIndex, setUncontrolledIndex] = useState(0);
  const ref = useRef<HTMLUListElement>(null);
  const [width, setWidth] = useState(400);
  const prevKeysRef = useRef<Set<string>>(new Set());
  const cardRotationRef = useRef<Map<string, number>>(new Map());
  const addOrderRef = useRef(0);

  const currentIndex = controlledIndex ?? uncontrolledIndex;

  const setNextImage = () => {
    const nextIndex = wrap(0, totalCards, currentIndex + 1);
    if (onIndexChange) {
      onIndexChange(nextIndex);
    } else {
      setUncontrolledIndex(nextIndex);
    }
  };

  useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.offsetWidth);
  }, []);

  // Track current keys to determine which cards are new
  const currentKeys = new Set<string>();
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.key) {
      const key = String(child.key);
      currentKeys.add(key);

      // Assign rotation to new cards based on add order
      if (!cardRotationRef.current.has(key)) {
        const rotation = (addOrderRef.current % 2 === 0 ? 1 : -1) * maxRotate;
        cardRotationRef.current.set(key, rotation);
        addOrderRef.current += 1;
      }
    }
  });

  // Determine which cards are new (not in previous render)
  const newKeys = new Set<string>();
  currentKeys.forEach((key) => {
    if (!prevKeysRef.current.has(key)) {
      newKeys.add(key);
    }
  });

  // Clean up removed cards from rotation map
  const removedKeys = Array.from(prevKeysRef.current).filter(
    (key) => !currentKeys.has(key)
  );
  removedKeys.forEach((key) => {
    cardRotationRef.current.delete(key);
  });

  // Update previous keys after render
  useEffect(() => {
    prevKeysRef.current = currentKeys;
  });

  return (
    <ul
      ref={ref}
      className={cn(
        "relative m-0 h-fit w-fit list-none p-0",
        className
      )}
      data-component="card-stack"
      {...props}
    >
      <AnimatePresence initial={false}>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          const key = child.key ? String(child.key) : undefined;
          const isNew = key ? newKeys.has(key) : false;
          const baseRotation = key ? cardRotationRef.current.get(key) ?? 0 : 0;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return React.cloneElement(child as any, {
            index,
            currentIndex,
            totalCards,
            maxRotate,
            minDistance: width * 0.5,
            setNextImage,
            isNew,
            baseRotation,
          });
        })}
      </AnimatePresence>
    </ul>
  );
}
