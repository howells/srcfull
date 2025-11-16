import { Badge } from "@materia/ui/components/badge";
import { cn } from "@materia/ui/utils/cn";
import type { ComponentProps, HTMLAttributes } from "react";
import type { ComponentSize } from "../lib/size";

const DOT_SIZE: Record<ComponentSize, string> = {
  "2xs": "h-1.5 w-1.5",
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  base: "h-2 w-2",
  lg: "h-2.5 w-2.5",
  xl: "h-3 w-3",
  "2xl": "h-3.5 w-3.5",
};

export type StatusProps = ComponentProps<typeof Badge> & {
  status: "online" | "offline" | "maintenance" | "degraded";
  size?: ComponentSize;
};

export const Status = ({
  className,
  status,
  size = "base",
  ...props
}: StatusProps) => (
  <Badge
    className={cn("flex items-center gap-2", "group", status, className)}
    data-component="status"
    variant="secondary"
    {...props}
  />
);

export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  size?: ComponentSize;
};

export const StatusIndicator = ({
  className,
  size = "base",
  ...props
}: StatusIndicatorProps) => (
  <span className={cn("relative flex", DOT_SIZE[size])} data-component="status-indicator" {...props}>
    <span
      className={cn(
        "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
        "group-[.online]:bg-emerald-500",
        "group-[.offline]:bg-red-500",
        "group-[.maintenance]:bg-blue-500",
        "group-[.degraded]:bg-amber-500"
      )}
    />
    <span
      className={cn(
        "relative inline-flex rounded-full",
        DOT_SIZE[size],
        "group-[.online]:bg-emerald-500",
        "group-[.offline]:bg-red-500",
        "group-[.maintenance]:bg-blue-500",
        "group-[.degraded]:bg-amber-500"
      )}
    />
  </span>
);

export type StatusLabelProps = HTMLAttributes<HTMLSpanElement>;

export const StatusLabel = ({
  className,
  children,
  ...props
}: StatusLabelProps) => (
  <span className={cn("text-muted-foreground", className)} data-component="status-label" {...props}>
    {children ?? (
      <>
        <span className="hidden group-[.online]:block">Online</span>
        <span className="hidden group-[.offline]:block">Offline</span>
        <span className="hidden group-[.maintenance]:block">Maintenance</span>
        <span className="hidden group-[.degraded]:block">Degraded</span>
      </>
    )}
  </span>
);
