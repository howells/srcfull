"use client";

import { Button } from "packages/ui/src/components/button";
import { ScrollArea } from "packages/ui/src/components/scroll-area";
import { Scrollspy } from "packages/ui/src/components/scrollspy";
import { useRef } from "react";

export default function Demo() {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const nav = [
    {
      id: "section-1",
      label: "Section 1",
    },
    {
      id: "section-2",
      label: "Section 2",
    },
    {
      id: "section-3",
      label: "Section 3",
    },
    {
      id: "section-4",
      label: "Section 4",
    },
    {
      id: "section-5",
      label: "Section 5",
    },
  ];

  return (
    <div className="flex grow gap-5">
      <div className="flex w-[150px] flex-col gap-2">
        <Scrollspy
          className="flex flex-col gap-2.5"
          offset={50}
          targetRef={parentRef}
        >
          {nav.map((item) => (
            <Button
              className={
                "data-[active=true]:bg-accent data-[active=true]:text-primary"
              }
              data-scrollspy-anchor={item.id}
              key={item.id}
              variant="outline"
            >
              {item.label}
            </Button>
          ))}
        </Scrollspy>
      </div>
      <div className="grow">
        <ScrollArea
          className="-me-5 h-[500px] grow pe-5"
          viewportRef={parentRef}
        >
          <div className="space-y-8">
            {nav.map((item) => (
              <div className="space-y-2.5" id={item.id} key={item.id}>
                <h3 className="text-base text-foreground">{item.label}</h3>
                <div className="h-[350px] rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
