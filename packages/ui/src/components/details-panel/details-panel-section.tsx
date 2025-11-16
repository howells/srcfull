"use client";

import { cn } from "@repo/ui/utils/cn";
import type * as React from "react";

export function DetailsPanelSection({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("mb-6", className)}
      data-component="details-panel-section"
      data-slot="details-panel-section"
      {...props}
    />
  );
}

export function DetailsPanelSectionLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center justify-between font-medium text-foreground text-sm",
        className
      )}
      data-component="details-panel-section-label"
      data-slot="details-panel-section-label"
      {...props}
    />
  );
}

export function DetailsPanelSectionAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      data-component="details-panel-section-action"
      data-slot="details-panel-section-action"
      {...props}
    />
  );
}

export function DetailsPanelSectionContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-sm [&>*+*]:mt-2", className)}
      data-component="details-panel-section-content"
      data-slot="details-panel-section-content"
      {...props}
    />
  );
}
