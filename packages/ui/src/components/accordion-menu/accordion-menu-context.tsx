"use client";

import { createContext } from "react";

export type AccordionMenuClassNames = {
  root?: string;
  group?: string;
  label?: string;
  separator?: string;
  item?: string;
  sub?: string;
  subTrigger?: string;
  subContent?: string;
  subWrapper?: string;
  indicator?: string;
};

export type AccordionMenuContextValue = {
  matchPath: (href: string) => boolean;
  selectedValue: string | undefined;
  setSelectedValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  classNames?: AccordionMenuClassNames;
  nestedStates: Record<string, string | string[]>;
  setNestedStates: React.Dispatch<
    React.SetStateAction<Record<string, string | string[]>>
  >;
  onItemClick?: (value: string, event: React.MouseEvent) => void;
};

export const AccordionMenuContext = createContext<AccordionMenuContextValue>({
  matchPath: () => false,
  selectedValue: "",
  setSelectedValue: () => {},
  nestedStates: {},
  setNestedStates: () => {},
});
