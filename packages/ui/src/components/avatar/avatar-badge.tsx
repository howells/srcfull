"use client";

import { cn } from "@materia/ui/utils/cn";
import type { ComponentSize } from "../../lib/size";

export type AvatarBadgeProps = {
  count?: number;
  max?: number;
  size?: ComponentSize;
  className?: string;
  position?: "bottom-right" | "top-right" | "bottom-left" | "top-left";
  variant?: "default" | "primary" | "destructive";
  dot?: boolean;
};

const BADGE_SIZE: Record<ComponentSize, string> = {
  "2xs": "text-[6px] min-w-3 h-3",
  xs: "text-[7px] min-w-3.5 h-3.5",
  sm: "text-[8px] min-w-4 h-4",
  base: "text-[9px] min-w-4 h-4",
  lg: "text-[10px] min-w-5 h-5",
  xl: "text-[11px] min-w-5 h-5",
  "2xl": "text-[12px] min-w-6 h-6",
};

const DOT_SIZE: Record<ComponentSize, string> = {
  "2xs": "size-2",
  xs: "size-2",
  sm: "size-2.5",
  base: "size-2.5",
  lg: "size-3",
  xl: "size-3",
  "2xl": "size-3.5",
};

const POSITION_CLASS: Record<
  NonNullable<AvatarBadgeProps["position"]>,
  string
> = {
  "bottom-right": "-bottom-1 -right-1",
  "top-right": "-top-1 -right-1",
  "bottom-left": "-bottom-1 -left-1",
  "top-left": "-top-1 -left-1",
};

const VARIANT_CLASS: Record<NonNullable<AvatarBadgeProps["variant"]>, string> =
  {
    default: "bg-secondary text-secondary-foreground",
    primary: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };

export function AvatarBadge({
  count,
  max = 99,
  size = "base",
  className,
  position = "top-right",
  variant = "destructive",
  dot = false,
}: AvatarBadgeProps) {
  const displayCount = count !== undefined && count > max ? `${max}+` : count;
  const showBadge = dot || (count !== undefined && count > 0);

  if (!showBadge) {
    return null;
  }

  if (dot) {
    return (
      <span
        className={cn(
          "absolute rounded-full",
          DOT_SIZE[size],
          VARIANT_CLASS[variant],
          POSITION_CLASS[position],
          "ring-2 ring-background",
          className
        )}
        data-component="avatar-badge"
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      className={cn(
        "absolute flex items-center justify-center rounded-full px-1 font-medium tabular-nums",
        BADGE_SIZE[size],
        VARIANT_CLASS[variant],
        POSITION_CLASS[position],
        "ring-2 ring-background",
        className
      )}
      data-component="avatar-badge"
      aria-label={`${count} notifications`}
    >
      {displayCount}
    </span>
  );
}
