"use client";

import { ScrollArea } from "@materia/ui/components/scroll-area";
import { Separator } from "@materia/ui/components/separator";
import { cn } from "@materia/ui/utils/cn";
import type * as React from "react";

export function DetailsPanelHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("border-b px-4 py-3", className)}
      data-component="details-panel-header"
      data-slot="details-panel-header"
      {...props}
    />
  );
}

export function DetailsPanelContent({
  className,
  children,
  noPadding = false,
  ...props
}: React.ComponentProps<"div"> & { noPadding?: boolean }) {
  return (
    <div
      className={cn("flex-1 overflow-hidden", className)}
      data-component="details-panel-content"
      data-slot="details-panel-content"
      {...props}
    >
      <ScrollArea className="h-full">
        <div className={cn(noPadding ? undefined : "p-4")}>{children}</div>
      </ScrollArea>
    </div>
  );
}

export function DetailsPanelFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto border-t p-4", className)}
      data-component="details-panel-footer"
      data-slot="details-panel-footer"
      {...props}
    />
  );
}

export function DetailsPanelSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn("my-3", className)}
      data-component="details-panel-separator"
      data-slot="details-panel-separator"
      {...props}
    />
  );
}
