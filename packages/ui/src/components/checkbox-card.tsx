"use client";

import { InputCard } from "@materia/ui/components/input-card";
import { cn } from "@materia/ui/utils/cn";
import { focusInput } from "@materia/ui/utils/focus-input";
import { hasErrorInput } from "@materia/ui/utils/has-error-input";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import type React from "react";
import { createContext, useContext } from "react";
import { Icon } from "./icon";

type CheckboxCardContextValue = {
  showIndicator?: boolean;
};

const CheckboxCardContext = createContext<CheckboxCardContextValue>({
  showIndicator: true,
});

function CheckboxCardGroup({
  className,
  showIndicator = true,
  ...props
}: React.ComponentProps<"div"> & {
  showIndicator?: boolean;
}) {
  return (
    <CheckboxCardContext.Provider value={{ showIndicator }}>
      <div
        className={cn("grid gap-3", className)}
        data-component="checkbox-card-group"
        data-slot="checkbox-card-group"
        {...props}
      />
    </CheckboxCardContext.Provider>
  );
}

function CheckboxCardItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const { showIndicator } = useContext(CheckboxCardContext);

  return (
    <InputCard
      asChild
      className={cn(
        "group flex cursor-pointer items-start gap-4 rounded-xl bg-card p-5 text-card-foreground transition-[color,box-shadow,border-color]",
        "hover:shadow-md data-[state=checked]:bg-primary/[0.02]",
        focusInput,
        hasErrorInput,
        className
      )}
    >
      <CheckboxPrimitive.Root
        data-component="checkbox-card-item"
        data-slot="checkbox-card-item"
        {...props}
      >
        {showIndicator && <CheckboxCardIndicator />}
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </CheckboxPrimitive.Root>
    </InputCard>
  );
}

function CheckboxCardIndicator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative mt-0.5 aspect-square size-4 shrink-0 rounded-[4px] border border-border bg-card text-primary transition-[color,box-shadow,border-color] group-focus-visible:border-ring group-focus-visible:ring-[3px] group-focus-visible:ring-ring/50 group-aria-invalid:border-destructive group-aria-invalid:ring-destructive/20 group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary",
        className
      )}
      data-component="checkbox-card-indicator"
      data-slot="checkbox-card-indicator"
      {...props}
    >
      <CheckboxPrimitive.Indicator className="absolute inset-0 flex items-center justify-center">
        <Icon className="text-primary-foreground" icon={Check} size="xs" />
      </CheckboxPrimitive.Indicator>
    </div>
  );
}

function CheckboxCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 text-left", className)}
      data-component="checkbox-card-content"
      data-slot="checkbox-card-content"
      {...props}
    />
  );
}

function CheckboxCardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-medium text-sm leading-tight", className)}
      data-component="checkbox-card-title"
      data-slot="checkbox-card-title"
      {...props}
    />
  );
}

function CheckboxCardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-xs leading-relaxed", className)}
      data-component="checkbox-card-description"
      data-slot="checkbox-card-description"
      {...props}
    />
  );
}

function CheckboxCardIcon({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground transition-colors group-data-[state=checked]:border-primary/20 group-data-[state=checked]:bg-primary/10 group-data-[state=checked]:text-primary",
        className
      )}
      data-component="checkbox-card-icon"
      data-slot="checkbox-card-icon"
      {...props}
    />
  );
}

export {
  CheckboxCardGroup,
  CheckboxCardItem,
  CheckboxCardIndicator,
  CheckboxCardContent,
  CheckboxCardTitle,
  CheckboxCardDescription,
  CheckboxCardIcon,
};
