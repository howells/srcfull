"use client";

import { Root as AvatarRootPrimitive } from "@radix-ui/react-avatar";
import { cn } from "@repo/ui/utils/cn";
import type { ComponentProps } from "react";
import type { ComponentSize } from "../../lib/size";

export const AVATAR_SIZE_CLASS: Record<ComponentSize, string> = {
  "2xs": "size-5",
  xs: "size-6",
  sm: "size-7",
  base: "size-8",
  lg: "size-10",
  xl: "size-12",
  "2xl": "size-14",
};

export const AVATAR_SIZE_PX: Record<ComponentSize, number> = {
  "2xs": 20,
  xs: 24,
  sm: 28,
  base: 32,
  lg: 40,
  xl: 48,
  "2xl": 56,
};

export type AvatarShape = "circle" | "square" | "rounded";

export type AvatarRootProps = ComponentProps<typeof AvatarRootPrimitive> & {
  size?: ComponentSize;
  shape?: AvatarShape;
  withRing?: boolean;
  ringColor?: string;
};

const SHAPE_CLASS: Record<AvatarShape, string> = {
  circle: "rounded-full",
  square: "rounded-none",
  rounded: "rounded-md",
};

export function AvatarRoot({
  className,
  size = "base",
  shape = "circle",
  withRing = false,
  ringColor,
  ...props
}: AvatarRootProps) {
  return (
    <AvatarRootPrimitive
      className={cn(
        "relative flex shrink-0 overflow-hidden",
        AVATAR_SIZE_CLASS[size],
        SHAPE_CLASS[shape],
        withRing && [
          "ring-2 ring-offset-2 ring-offset-background",
          ringColor || "ring-primary",
        ],
        className
      )}
      data-component="avatar"
      data-shape={shape}
      data-size={size}
      data-slot="avatar"
      {...props}
    />
  );
}
