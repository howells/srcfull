"use client";

import { cn } from "@repo/ui/utils/cn";
import { Check, type LucideIcon } from "lucide-react";
import type React from "react";
import { Icon } from "./icon";
import { Shimmer } from "./shimmer";
import { Spinner } from "./spinner";
import { HStack, VStack } from "./stack";
import { Text } from "./text";

export type ChainItemState = "pending" | "loading" | "complete";

export type ChainItem = {
  /** The label text for this item */
  label: string | React.ReactNode;
  /** Current state of the item */
  state: ChainItemState;
  /** Optional custom icon (overrides default state icons) */
  icon?: LucideIcon;
  /** Optional className for the label */
  className?: string;
};

export type ChainProps = {
  /** Array of items to display in the chain */
  items: ChainItem[];
  /** Optional className for the container */
  className?: string;
  /** Optional data-testid for testing */
  "data-testid"?: string;
};

function ChainItemIndicator({
  state,
  icon,
}: {
  state: ChainItemState;
  icon?: LucideIcon;
}) {
  // Custom icon takes precedence
  if (icon) {
    return <Icon className="text-muted-foreground" icon={icon} size="sm" />;
  }

  // State-based indicators
  switch (state) {
    case "loading":
      return <Spinner className="text-blue-500" size="sm" />;
    case "complete":
      return <Icon className="text-green-600" icon={Check} size="sm" />;
    default:
      return (
        <div className="size-2 rounded-full bg-gray-300 dark:bg-gray-600" />
      );
  }
}

export function Chain({
  items,
  className,
  "data-testid": dataTestId,
}: ChainProps) {
  return (
    <VStack
      className={cn("relative", className)}
      data-component="chain"
      data-testid={dataTestId}
      gap="sm"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div className="relative" key={index}>
            <HStack align="center" gap="sm">
              {/* Indicator */}
              <div className="relative flex size-5 shrink-0 items-center justify-center">
                <ChainItemIndicator icon={item.icon} state={item.state} />
              </div>

              {/* Label */}
              {typeof item.label === "string" ? (
                item.state === "loading" ? (
                  <Shimmer
                    as="span"
                    className={cn("text-sm", item.className)}
                    duration={2}
                  >
                    {item.label}
                  </Shimmer>
                ) : (
                  <Text
                    className={cn(
                      "text-sm",
                      item.state === "pending" && "text-muted-foreground",
                      item.className
                    )}
                  >
                    {item.label}
                  </Text>
                )
              ) : (
                item.label
              )}
            </HStack>

            {/* Connecting line */}
            {!isLast && (
              <div
                aria-hidden="true"
                className="absolute top-5 left-2.5 h-[calc(100%+0.5rem)] w-px bg-border"
              />
            )}
          </div>
        );
      })}
    </VStack>
  );
}
