"use client";

import { Button } from "@repo/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/command";
import { Icon } from "@repo/ui/components/icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { cn } from "@repo/ui/utils/cn";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

export type ComboboxItem = { value: string; label: string };

export type ComboboxProps = {
  items: ComboboxItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  buttonClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  buttonWidth?: number | string; // e.g. 200 | "200px" | "100%"
};

export function Combobox({
  items,
  value,
  onValueChange,
  placeholder = "Select…",
  buttonClassName,
  contentClassName,
  disabled,
  buttonWidth = 200,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(value ?? "");

  // keep controlled in sync
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const selected = items.find((i) => i.value === internalValue);

  const widthStyle =
    typeof buttonWidth === "number"
      ? { width: `${buttonWidth}px"` }
      : { width: buttonWidth };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn("justify-between", buttonClassName)}
          data-component="combobox"
          disabled={disabled}
          role="combobox"
          style={widthStyle}
          variant="outline"
        >
          {selected ? selected.label : placeholder}
          <Icon className="opacity-50" icon={ChevronsUpDownIcon} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0", contentClassName)}
        style={widthStyle}
      >
        <Command>
          <CommandInput className="h-9" placeholder={"Search…"} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={(currentValue) => {
                    const next =
                      currentValue === internalValue ? "" : currentValue;
                    if (onValueChange) {
                      onValueChange(next);
                    }
                    setInternalValue(next);
                    setOpen(false);
                  }}
                  value={item.value}
                >
                  {item.label}
                  <Icon
                    className={cn(
                      "ml-auto",
                      internalValue === item.value ? "opacity-100" : "opacity-0"
                    )}
                    icon={CheckIcon}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
