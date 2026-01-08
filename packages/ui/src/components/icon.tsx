import { cn } from "@repo/ui/utils/cn";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import type { ComponentSize } from "../lib/size";

const ICON_SIZE_CLASS: Record<ComponentSize, string> = {
  "2xs": "size-3", // 12px
  xs: "size-4", // 16px
  sm: "size-4.5", // 18px
  base: "size-5", // 20px
  lg: "size-6", // 24px
  xl: "size-7", // 28px
  "2xl": "size-8", // 32px
};

function sizeToIconClass(size: ComponentSize | undefined): string {
  return ICON_SIZE_CLASS[size ?? "base"];
}

/**
 * A thin wrapper that renders a given SVG/Lucide icon with consistent sizing
 * and stroke width across the design system.
 *
 * Usage:
 *   <Icon icon={ArrowRight} />
 *   <Icon icon={ArrowRight} size="lg" className="text-neutral-500" />
 */
export interface IconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "strokeWidth"> {
  /** Icon component from lucide-react or any SVG React component. */
  icon: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Shared size scale for UI components. Defaults to `base` (20px). */
  size?: ComponentSize;
}

export function Icon({
  icon: IconComp,
  size = "base",
  className,
  ...props
}: IconProps) {
  return (
    <IconComp
      aria-hidden
      className={cn("stroke-[1.5]", sizeToIconClass(size), className)}
      data-component="icon"
      focusable={false}
      strokeWidth={1.5}
      {...props}
    />
  );
}
