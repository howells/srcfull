"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { InputCard } from "@repo/ui/components/input-card";
import { cn } from "@repo/ui/utils/cn";
import { focusInput } from "@repo/ui/utils/focus-input";
import { hasErrorInput } from "@repo/ui/utils/has-error-input";
import { Circle } from "lucide-react";
import type React from "react";
import { createContext, useContext } from "react";
import type { ComponentSize } from "../lib/size";
import { Icon } from "./icon";

type RadioCardContextValue = {
  showIndicator?: boolean;
  size?: ComponentSize;
};

const RadioCardContext = createContext<RadioCardContextValue>({
  showIndicator: true,
  size: "base",
});

const ITEM_SIZE_CLASS: Record<ComponentSize, string> = {
  "2xs": "gap-2 p-3",
  xs: "gap-3 p-4",
  sm: "gap-3 p-4",
  base: "gap-4 p-5",
  lg: "gap-4 p-6",
  xl: "gap-5 p-6",
  "2xl": "gap-5 p-7",
};

const INDICATOR_SIZE_CLASS: Record<ComponentSize, string> = {
  "2xs": "size-3",
  xs: "size-3.5",
  sm: "size-4",
  base: "size-4",
  lg: "size-5",
  xl: "size-5",
  "2xl": "size-6",
};

const ICON_CONTAINER_SIZE_CLASS: Record<ComponentSize, string> = {
  "2xs": "size-8",
  xs: "size-9",
  sm: "size-9",
  base: "size-10",
  lg: "size-11",
  xl: "size-12",
  "2xl": "size-14",
};

const TITLE_SIZE_CLASS: Record<ComponentSize, string> = {
  "2xs": "text-xs",
  xs: "text-xs",
  sm: "text-sm",
  base: "text-sm",
  lg: "text-base",
  xl: "text-base",
  "2xl": "text-lg",
};

const DESCRIPTION_SIZE_CLASS: Record<ComponentSize, string> = {
  "2xs": "text-xs",
  xs: "text-xs",
  sm: "text-xs",
  base: "text-xs",
  lg: "text-sm",
  xl: "text-sm",
  "2xl": "text-base",
};

function RadioCardGroup({
  className,
  showIndicator = true,
  size = "base",
  layout = "grid",
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  showIndicator?: boolean;
  size?: ComponentSize;
  layout?: "grid" | "inline";
}) {
  return (
    <RadioCardContext.Provider value={{ showIndicator, size }}>
      <RadioGroupPrimitive.Root
        className={cn(
          layout === "inline" ? "flex flex-wrap gap-3" : "grid gap-3",
          className
        )}
        data-component="radio-card-group"
        data-slot="radio-card-group"
        {...props}
      />
    </RadioCardContext.Provider>
  );
}

function RadioCardItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const { showIndicator, size = "base" } = useContext(RadioCardContext);

  return (
    <InputCard
      asChild
      className={cn(
        "group flex cursor-pointer items-start rounded-xl bg-card text-card-foreground transition-[color,box-shadow,border-color]",
        "data-[state=checked]:bg-primary/[0.02]",
        ITEM_SIZE_CLASS[size],
        focusInput,
        hasErrorInput,
        className
      )}
    >
      <RadioGroupPrimitive.Item
        data-component="radio-card-item"
        data-slot="radio-card-item"
        {...props}
      >
        {showIndicator && <RadioCardIndicator />}
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </RadioGroupPrimitive.Item>
    </InputCard>
  );
}

function RadioCardIndicator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { size = "base" } = useContext(RadioCardContext);
  return (
    <div
      className={cn(
        "relative mt-0.5 aspect-square shrink-0 rounded-full border border-border bg-card text-primary transition-[color,box-shadow,border-color] group-focus-visible:border-ring group-focus-visible:ring-[3px] group-focus-visible:ring-ring/50 group-aria-invalid:border-destructive group-aria-invalid:ring-destructive/20 group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary",
        INDICATOR_SIZE_CLASS[size],
        className
      )}
      data-component="radio-card-indicator"
      data-slot="radio-card-indicator"
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center">
        <Icon className="fill-primary-foreground" icon={Circle} size="2xs" />
      </RadioGroupPrimitive.Indicator>
    </div>
  );
}

function RadioCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 text-left", className)}
      data-component="radio-card-content"
      data-slot="radio-card-content"
      {...props}
    />
  );
}

function RadioCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  const { size = "base" } = useContext(RadioCardContext);
  return (
    <div
      className={cn(
        "font-medium leading-tight",
        TITLE_SIZE_CLASS[size],
        className
      )}
      data-component="radio-card-title"
      data-slot="radio-card-title"
      {...props}
    />
  );
}

function RadioCardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { size = "base" } = useContext(RadioCardContext);
  return (
    <div
      className={cn(
        "text-muted-foreground leading-relaxed",
        DESCRIPTION_SIZE_CLASS[size],
        className
      )}
      data-component="radio-card-description"
      data-slot="radio-card-description"
      {...props}
    />
  );
}

function RadioCardIcon({ className, ...props }: React.ComponentProps<"div">) {
  const { size = "base" } = useContext(RadioCardContext);
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground transition-colors group-data-[state=checked]:border-primary/20 group-data-[state=checked]:bg-primary/10 group-data-[state=checked]:text-primary",
        ICON_CONTAINER_SIZE_CLASS[size],
        className
      )}
      data-component="radio-card-icon"
      data-slot="radio-card-icon"
      {...props}
    />
  );
}

export {
  RadioCardGroup,
  RadioCardItem,
  RadioCardIndicator,
  RadioCardContent,
  RadioCardTitle,
  RadioCardDescription,
  RadioCardIcon,
};
