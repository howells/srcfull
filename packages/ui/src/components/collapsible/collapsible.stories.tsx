import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { cn } from "@repo/ui/utils/cn";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "../card";
import { Icon } from "../icon";
import { CollapsibleContent } from "./collapsible-content";
import { Collapsible } from "./collapsible-root";
import { CollapsibleTrigger } from "./collapsible-trigger";

const meta = {
  title: "Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An interactive component which expands and collapses content.",
      },
    },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story
export const Base: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible
        className="flex w-[350px] flex-col gap-2"
        defaultOpen={false}
        onOpenChange={setIsOpen}
        open={isOpen}
      >
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="font-semibold text-sm">Recent Projects</h4>
          <CollapsibleTrigger asChild>
            <Button className="size-8" size="icon" variant="ghost">
              <ChevronsUpDown className="size-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">
          Brand Guidelines 2024
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            Product Photography
          </div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            Marketing Campaign
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

// Controlled example
export const Controlled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Control the visibility state programmatically with state management.",
      },
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <Collapsible
          className="flex w-[350px] flex-col gap-2"
          defaultOpen={false}
          onOpenChange={setIsOpen}
          open={isOpen}
        >
          <div className="flex items-center justify-between gap-4 px-4">
            <h4 className="font-semibold text-sm">
              Can I use this in my project?
            </h4>
            <CollapsibleTrigger asChild>
              <Button className="size-8" size="icon" variant="ghost">
                <ChevronsUpDown className="size-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="rounded-md border px-4 py-3 text-sm">
              Yes. Free to use for personal and commercial projects. No
              attribution required.
            </div>
          </CollapsibleContent>
        </Collapsible>
        <div className="px-4 text-muted-foreground text-xs">
          State: {isOpen ? "Open" : "Closed"}
        </div>
      </div>
    );
  },
};

// Multiple independent sections
export const MultipleItems: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Multiple collapsible sections can be used independently. Each maintains its own state.",
      },
    },
  },
  render: () => (
    <div className="flex w-[350px] flex-col gap-4">
      <Collapsible className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="font-semibold text-sm">Marketing Assets</h4>
          <CollapsibleTrigger asChild>
            <Button className="size-8" size="icon" variant="ghost">
              <ChevronsUpDown className="size-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">
          brand-guidelines.pdf
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            logo-assets.zip
          </div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            templates.sketch
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="font-semibold text-sm">Product Images</h4>
          <CollapsibleTrigger asChild>
            <Button className="size-8" size="icon" variant="ghost">
              <ChevronsUpDown className="size-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">
          hero-banner.jpg
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            product-shot-01.jpg
          </div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">
            product-shot-02.jpg
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

// Inline text expansion
export const InlineExpansion: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Collapsible content can be used inline with text, with a show more/less link to toggle visibility.",
      },
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="w-[500px] rounded-lg border p-4 text-foreground text-sm">
        Materia is an open-source collection of UI components and design
        patterns built with React, TypeScript, Tailwind CSS, and Motion.
        <Collapsible onOpenChange={setIsOpen} open={isOpen}>
          <CollapsibleContent>
            {" "}
            Pairs beautifully with modern design systems. Save time and build
            your next project faster with pre-built, accessible components.
          </CollapsibleContent>
          <div className="text-end">
            <CollapsibleTrigger asChild>
              <Button size="sm" variant="link">
                {isOpen ? "Show less" : "Show more"}
              </Button>
            </CollapsibleTrigger>
          </div>
        </Collapsible>
      </div>
    );
  },
};

// Stats card with collapsible details
export const StatsCard: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "A card showing key metrics with collapsible detailed statistics. Useful for dashboards and analytics views.",
      },
    },
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    type StatItem = {
      label: string;
      value: number;
      change: string;
      changeType: "increase" | "decrease";
    };

    const stats: StatItem[] = [
      {
        label: "Added to Cart",
        value: 3842,
        change: "+1.8%",
        changeType: "increase",
      },
      {
        label: "Reached Checkout",
        value: 1256,
        change: "-1.2%",
        changeType: "decrease",
      },
      {
        label: "Purchased",
        value: 649,
        change: "+2.4%",
        changeType: "increase",
      },
    ];

    return (
      <Card className="w-[350px]">
        <Collapsible defaultOpen={false} onOpenChange={setIsOpen} open={isOpen}>
          <CardHeader>
            <CardTitle>
              <div className="flex flex-col gap-1">
                <div className="font-medium text-muted-foreground text-sm">
                  Conversion Rate
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-xl">
                    29.9%
                  </span>
                  <Badge size="sm" variant="default">
                    +4.5%
                  </Badge>
                </div>
              </div>
            </CardTitle>
            <CardAction>
              <CollapsibleTrigger asChild>
                <Button size="sm" variant="outline">
                  Details
                  <Icon icon={isOpen ? ChevronUp : ChevronDown} size="xs" />
                </Button>
              </CollapsibleTrigger>
            </CardAction>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-3 text-sm">
              {stats.map((stat, index) => (
                <div className="flex items-center justify-between" key={index}>
                  <span className="text-muted-foreground">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {stat.value.toLocaleString()}
                    </span>
                    <span
                      className={cn(
                        "flex min-w-20 items-center justify-end gap-0.5 font-medium text-sm",
                        stat.changeType === "increase"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      )}
                    >
                      <Icon
                        icon={
                          stat.changeType === "increase" ? ArrowUp : ArrowDown
                        }
                        size="2xs"
                      />
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  },
};
