import { createContext, useContext } from "react";

type AccordionContextType = {
  variant?: "default" | "outline" | "solid";
  indicator?: "arrow" | "plus" | "none";
  value?: string | string[];
  type?: "single" | "multiple";
};

type AccordionItemContextType = {
  value: string;
  isOpen: boolean;
};

const AccordionContext = createContext<AccordionContextType>({
  variant: "default",
  indicator: "arrow",
});

const AccordionItemContext = createContext<AccordionItemContextType | null>(
  null
);

function useAccordionContext() {
  return useContext(AccordionContext);
}

function useAccordionItem() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      "AccordionTrigger/Content must be used within AccordionItem"
    );
  }
  return context;
}

export {
  AccordionContext,
  AccordionItemContext,
  useAccordionContext,
  useAccordionItem,
};
export type { AccordionContextType, AccordionItemContextType };
