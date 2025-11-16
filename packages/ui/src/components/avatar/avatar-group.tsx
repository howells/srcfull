"use client";

import { cn } from "@repo/ui/utils/cn";
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import type { ComponentSize } from "../../lib/size";
import { AVATAR_SIZE_PX } from "./avatar-root";

export type AvatarGroupProps = {
  children: ReactNode;
  className?: string;
  max?: number;
  size?: ComponentSize | number;
  spacing?: "tight" | "normal" | "loose";
  animate?: boolean;
  renderSurplus?: (count: number) => ReactNode;
  selectable?: boolean;
  selectedIndex?: number;
  onSelect?: (index: number) => void;
  labels?: string[];
};

const SPACING_CLASS = {
  tight: "-space-x-2",
  normal: "-space-x-1",
  loose: "-space-x-0.5",
};

const HOVER_SPACING = {
  tight: "hover:space-x-0",
  normal: "hover:space-x-0.5",
  loose: "hover:space-x-1",
};

function pxToComponentSize(px: number): ComponentSize {
  const sizeMap: ComponentSize[] = ["2xs", "xs", "sm", "base", "lg", "xl", "2xl"];
  const sizes = sizeMap.map((s) => AVATAR_SIZE_PX[s]);
  const closestIndex = sizes.reduce(
    (closest, s, index) =>
      Math.abs(s - px) < Math.abs((sizes[closest] ?? 0) - px) ? index : closest,
    0
  );
  return sizeMap[closestIndex] ?? "base";
}

export function AvatarGroup({
  children,
  className,
  max,
  size = "base",
  spacing = "normal",
  animate = false,
  renderSurplus,
  selectable = false,
  selectedIndex,
  onSelect,
  labels,
  ...props
}: AvatarGroupProps) {
  const childArray = Children.toArray(children);
  const totalCount = childArray.length;
  const displayCount = max !== undefined ? Math.min(max, totalCount) : totalCount;
  const surplusCount = max !== undefined && totalCount > max ? totalCount - max : 0;

  // Handle size as either ComponentSize or number (pixels)
  const componentSize: ComponentSize =
    typeof size === "number" ? pxToComponentSize(size) : size;
  const px = typeof size === "number" ? size : AVATAR_SIZE_PX[componentSize];

  const displayChildren = childArray.slice(0, displayCount).map((child, index) => {
    if (!isValidElement(child)) {
      return child;
    }

    const isSelected = selectable && selectedIndex === index;
    const label = labels?.[index];

    // Clone the avatar and ensure it has the right size
    const clonedChild = cloneElement(child as ReactElement, {
      size: componentSize,
      "data-avatar-index": index,
    } as never);

    const handleClick = () => {
      if (selectable && onSelect) {
        onSelect(index);
      }
    };

    return (
      <div
        key={index}
        className={cn(
          "relative inline-flex shrink-0 rounded-full ring-2 ring-background",
          animate && "transition-all duration-200",
          selectable && [
            "cursor-pointer",
            "hover:ring-primary/50",
            isSelected && "ring-primary ring-offset-2",
          ]
        )}
        style={{
          width: px,
          height: px,
          zIndex: displayCount - index,
        }}
        onClick={handleClick}
        role={selectable ? "button" : undefined}
        aria-label={label}
        aria-pressed={selectable ? isSelected : undefined}
        tabIndex={selectable ? 0 : undefined}
        onKeyDown={(e) => {
          if (selectable && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {clonedChild}
      </div>
    );
  });

  const surplusElement = surplusCount > 0 && (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-2 ring-background",
        "text-xs font-medium",
        animate && "transition-all duration-200"
      )}
      style={{
        width: px,
        height: px,
        zIndex: 0,
      }}
      data-component="avatar-surplus"
    >
      {renderSurplus ? renderSurplus(surplusCount) : `+${surplusCount}`}
    </div>
  );

  return (
    <div
      className={cn(
        "flex items-center",
        SPACING_CLASS[spacing],
        animate && [
          "*:transition-all *:duration-200",
          HOVER_SPACING[spacing],
        ],
        className
      )}
      data-component="avatar-group"
      {...props}
    >
      {displayChildren}
      {surplusElement}
    </div>
  );
}
