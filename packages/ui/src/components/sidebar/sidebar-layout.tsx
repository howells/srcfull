"use client";

import { Input } from "@materia/ui/components/input";
import { Separator } from "@materia/ui/components/separator";
import { cn } from "@materia/ui/utils/cn";
import type React from "react";
import { SidebarTrigger } from "./sidebar-trigger";

export function SidebarLayout({
  children,
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      className={cn("flex min-h-svh w-full flex-col", className)}
      {...props}
    >
      {/* Mobile top bar with right-aligned trigger */}
      <div className="sticky top-0 z-20 flex h-12 items-center justify-end border-b bg-background px-3 md:hidden">
        <SidebarTrigger />
      </div>
      {/* Rounded gray content area */}
      <div className="m-3 mt-[3.5rem] flex-1 rounded-2xl bg-neutral-50 p-6 md:mt-3">
        {children}
      </div>
    </main>
  );
}

export function SidebarInset({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm",
        className
      )}
      data-component="sidebar-inset"
      data-slot="sidebar-inset"
      {...props}
    />
  );
}

export function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn("w-full bg-background shadow-none", className)}
      data-sidebar="input"
      data-component="sidebar-input"
      data-slot="sidebar-input"
      {...props}
    />
  );
}

export function SidebarHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 p-2", className)}
      data-sidebar="header"
      data-component="sidebar-header"
      data-slot="sidebar-header"
      {...props}
    >
      <div className="relative">
        {children}
        <div className="absolute top-0 right-0 hidden transition-opacity group-hover/sidebar-wrapper:pointer-events-auto group-hover/sidebar-wrapper:opacity-100 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0 md:block">
          <SidebarTrigger />
        </div>
      </div>
    </div>
  );
}

export function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      data-sidebar="footer"
      data-component="sidebar-footer"
      data-slot="sidebar-footer"
      {...props}
    />
  );
}

export function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn("w-auto bg-sidebar-border", className)}
      data-sidebar="separator"
      data-component="sidebar-separator"
      data-slot="sidebar-separator"
      {...props}
    />
  );
}

export function SidebarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-1 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      data-sidebar="content"
      data-component="sidebar-content"
      data-slot="sidebar-content"
      {...props}
    />
  );
}
