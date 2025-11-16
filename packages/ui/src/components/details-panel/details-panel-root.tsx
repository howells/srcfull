"use client";

import { Sheet, SheetContent } from "@repo/ui/components/sheet";
import { cn } from "@repo/ui/utils/cn";
import type { ReactNode } from "react";
import React, { useContext, useEffect, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";
import type { StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";

import {
  DETAILS_PANEL_MEDIA_QUERY,
  DETAILS_PANEL_WIDTH_PX,
  DETAILS_PANEL_Z_INDEX,
} from "./details-panel-constants";

type DetailsPanelState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

export type DetailsPanelStore = UseBoundStore<StoreApi<DetailsPanelState>>;

const DetailsPanelContext = React.createContext<DetailsPanelStore | null>(null);

export function useDetailsPanel(): DetailsPanelStore {
  const ctx = useContext(DetailsPanelContext);
  if (!ctx) {
    throw new Error(
      "useDetailsPanel must be used within a <DetailsPanelProvider>"
    );
  }
  return ctx;
}

export function DetailsPanelProvider({
  children,
  defaultOpen,
}: {
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const isDesktop = useMediaQuery(DETAILS_PANEL_MEDIA_QUERY);
  const storeRef = useRef<DetailsPanelStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = create<DetailsPanelState>((set) => ({
      open: defaultOpen ?? false,
      setOpen: (open) => set({ open }),
      toggle: () => set((prev) => ({ open: !prev.open })),
    }));
  }

  useEffect(() => {
    // Default open on desktop, closed on smaller screens
    if (isDesktop) {
      storeRef.current?.setState({ open: true });
    } else {
      storeRef.current?.setState({ open: false });
    }
  }, [isDesktop]);

  return (
    <DetailsPanelContext.Provider value={storeRef.current}>
      {children}
    </DetailsPanelContext.Provider>
  );
}

export function DetailsPanel({
  children,
  className,
  side = "right",
  widthPx = DETAILS_PANEL_WIDTH_PX,
  ariaLabel = "Details panel",
}: {
  children: ReactNode;
  className?: string;
  side?: "right" | "left";
  widthPx?: number;
  ariaLabel?: string;
}) {
  const isDesktop = useMediaQuery(DETAILS_PANEL_MEDIA_QUERY);
  const store = useDetailsPanel();
  const open = store((s) => s.open);
  const setOpen = store((s) => s.setOpen);

  if (isDesktop) {
    if (!open) return null;
    const sideClasses =
      side === "right" ? "right-0 border-l" : "left-0 border-r";
    return (
      <div
        aria-label={ariaLabel}
        className={cn(
          "fixed inset-y-0 flex h-full flex-col border bg-background shadow-lg",
          sideClasses,
          className
        )}
        data-component="details-panel"
        data-slot="details-panel"
        data-state={open ? "open" : "closed"}
        role="complementary"
        style={{ width: widthPx, zIndex: DETAILS_PANEL_Z_INDEX }}
      >
        {children}
      </div>
    );
  }

  // Mobile / smaller screens: use a Sheet
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetContent className={cn("p-0")} side={side}>
        {children}
      </SheetContent>
    </Sheet>
  );
}
