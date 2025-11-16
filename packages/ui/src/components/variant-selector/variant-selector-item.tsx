"use client";

import { InputCard } from "@materia/ui/components/input-card";
import { cn } from "@materia/ui/utils/cn";
import { focusInput } from "@materia/ui/utils/focus-input";
import { Item as RadioGroupItem } from "@radix-ui/react-radio-group";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { useVariantSelector } from "./variant-selector-context";

export type VariantSelectorItemProps = {
  value: string;
  label: string;
  color?: string;
  image?: ReactNode;
  disabled?: boolean;
  className?: string;
};

/**
 * Individual variant item that can display a color swatch or image.
 * Automatically adapts to single or multiple selection mode based on parent VariantSelector.
 */
export function VariantSelectorItem({
  value,
  label,
  color,
  image,
  disabled,
  className,
}: VariantSelectorItemProps) {
  const { mode, selectedValues, onValueChange } = useVariantSelector();
  const isSelected = selectedValues.has(value);

  const swatchStyle =
    color && !image
      ? {
          backgroundColor: color,
        }
      : undefined;

  const swatch = (
    <div
      className={cn(
        "relative aspect-square w-full rounded-xl",
        image ? "overflow-hidden" : "shadow-inner"
      )}
      style={swatchStyle}
    >
      {image}
      {isSelected && (
        <div
          className={cn(
            "absolute top-2 right-2",
            "flex items-center justify-center",
            "size-5",
            "bg-background text-foreground",
            "rounded-full",
            "ring-1 ring-foreground/15 ring-inset",
            "shadow-sm"
          )}
        >
          <Check className="size-3.5" />
        </div>
      )}
    </div>
  );

  const labelElement = (
    <span
      className={cn(
        "block text-center",
        "font-medium text-sm",
        "mt-2",
        "transition-colors",
        isSelected ? "text-foreground" : "text-muted-foreground",
        disabled && "opacity-50"
      )}
    >
      {label}
    </span>
  );

  if (mode === "single") {
    return (
      <InputCard
        asChild
        className={cn(
          "group flex h-full w-full cursor-pointer flex-col items-center rounded-2xl p-2 text-center",
          focusInput,
          "focus-visible:ring-offset-2",
          className
        )}
        disabled={disabled}
        selected={isSelected}
      >
        <RadioGroupItem
          className="flex h-full w-full flex-col items-center"
          data-component="variant-selector-item"
          data-slot="variant-selector-item"
          disabled={disabled}
          value={value}
        >
          {swatch}
          {labelElement}
        </RadioGroupItem>
      </InputCard>
    );
  }

  return (
    <InputCard
      asChild
      className={cn(
        "group flex h-full w-full cursor-pointer flex-col items-center rounded-2xl p-2 text-center",
        focusInput,
        "focus-visible:ring-offset-2",
        className
      )}
      disabled={disabled}
      selected={isSelected}
    >
      <button
        aria-pressed={isSelected}
        className="flex h-full w-full flex-col items-center"
        data-component="variant-selector-item"
        data-slot="variant-selector-item"
        disabled={disabled}
        onClick={() => !disabled && onValueChange(value)}
        type="button"
      >
        {swatch}
        {labelElement}
      </button>
    </InputCard>
  );
}
