"use client";

import { Input } from "@repo/ui/components/input";
import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
} from "@repo/ui/components/sidebar/sidebar-constants";
import { SIDEBAR_TRANSITION } from "@repo/ui/components/sidebar/sidebar-motion-config";
import { useSidebar } from "@repo/ui/components/sidebar/sidebar-provider";
import { motion } from "motion/react";
import { useMemo } from "react";

export function HeaderBar() {
  const { state, isMobile } = useSidebar();

  const leftOffset = useMemo(() => {
    if (isMobile) {
      return "0px";
    }
    return state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON;
  }, [isMobile, state]);

  return (
    <motion.header
      animate={{ left: leftOffset }}
      className="fixed top-0 right-0 z-10 flex h-14 w-auto items-center border-b bg-background px-4"
      initial={{ left: leftOffset }}
      transition={SIDEBAR_TRANSITION}
    >
      <Input className="max-w-md" placeholder="Search…" type="search" />
    </motion.header>
  );
}
