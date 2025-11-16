import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";
import "@materia/tailwind-config/shared-styles.css";
import { Button } from "../button";
import { CardStackItem } from "./card-stack-item";
import { CardStack } from "./card-stack-root";

const meta = {
  title: "Card Stack",
  component: CardStack,
  tags: ["autodocs"],
  argTypes: {
    totalCards: {
      control: "number",
      description: "Total number of cards in the stack",
    },
    maxRotate: {
      control: "number",
      description: "Maximum rotation in degrees",
      defaultValue: 5,
    },
  },
} satisfies Meta<typeof CardStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCards = [
  { id: 1, color: "bg-blue-500", aspectRatio: 3 / 4 },
  { id: 2, color: "bg-purple-500", aspectRatio: 3 / 4 },
  { id: 3, color: "bg-pink-500", aspectRatio: 4 / 3 },
  { id: 4, color: "bg-orange-500", aspectRatio: 4 / 3 },
  { id: 5, color: "bg-green-500", aspectRatio: 4 / 3 },
];

export const Base: Story = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center">
      <CardStack totalCards={sampleCards.length}>
        {sampleCards.map((card) => (
          <CardStackItem key={card.id} aspectRatio={card.aspectRatio} className="h-[300px] w-[300px]">
            <div
              className={`flex h-full w-full items-center justify-center ${card.color} text-4xl font-bold text-white`}
            >
              {card.id}
            </div>
          </CardStackItem>
        ))}
      </CardStack>
    </div>
  ),
};

export const WithImages: Story = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center">
      <CardStack totalCards={3}>
        <CardStackItem aspectRatio={3 / 4} className="h-[400px] w-[300px]">
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-2xl font-semibold text-white">
            Card 1
          </div>
        </CardStackItem>
        <CardStackItem aspectRatio={3 / 4} className="h-[400px] w-[300px]">
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 text-2xl font-semibold text-white">
            Card 2
          </div>
        </CardStackItem>
        <CardStackItem aspectRatio={4 / 3} className="h-[300px] w-[400px]">
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-400 to-pink-600 text-2xl font-semibold text-white">
            Card 3
          </div>
        </CardStackItem>
      </CardStack>
    </div>
  ),
};

export const LargeStack: Story = {
  render: () => {
    const cards = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      color: `hsl(${(i * 360) / 10}, 70%, 60%)`,
    }));

    return (
      <div className="flex min-h-screen items-center justify-center">
        <CardStack totalCards={cards.length} maxRotate={8}>
          {cards.map((card) => (
            <CardStackItem key={card.id} aspectRatio={1} className="h-[250px] w-[250px]">
              <div
                className="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
                style={{ backgroundColor: card.color }}
              >
                {card.id}
              </div>
            </CardStackItem>
          ))}
        </CardStack>
      </div>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [cards, setCards] = useState([
      { id: "card-1", color: "hsl(200, 80%, 85%)", label: "Card 1" },
      { id: "card-2", color: "hsl(280, 80%, 85%)", label: "Card 2" },
      { id: "card-3", color: "hsl(340, 80%, 85%)", label: "Card 3" },
    ]);
    const nextIdRef = React.useRef(4);

    const addCard = () => {
      const colors = [
        "hsl(200, 80%, 85%)",
        "hsl(280, 80%, 85%)",
        "hsl(340, 80%, 85%)",
        "hsl(30, 80%, 85%)",
        "hsl(150, 80%, 85%)",
        "hsl(60, 80%, 85%)",
      ];
      const newCard = {
        id: `card-${nextIdRef.current}`,
        color: colors[(nextIdRef.current - 1) % colors.length],
        label: `Card ${nextIdRef.current}`,
      };
      setCards((prev) => [newCard, ...prev]);
      nextIdRef.current += 1;
    };

    const removeCard = (id: string) => {
      setCards((prev) => prev.filter((card) => card.id !== id));
    };

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8">
        <div className="flex gap-4">
          <Button size="sm" variant="primary" onClick={addCard}>
            Add Card to Top
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setCards([])}>
            Clear All
          </Button>
        </div>

        <div className="text-muted-foreground text-sm">
          Cards in stack: {cards.length}
        </div>

        {cards.length > 0 ? (
          <CardStack totalCards={cards.length}>
            {cards.map((card) => (
              <CardStackItem key={card.id} aspectRatio={1} className="h-[220px] w-[220px]">
                <div
                  className="relative flex h-full w-full flex-col items-center justify-center gap-2"
                  style={{ backgroundColor: card.color }}
                >
                  <span className="font-semibold text-2xl">{card.label}</span>
                  <Button
                    appearance="ghost"
                    aria-label="Remove card"
                    className="absolute right-2 top-2"
                    size="xs"
                    onClick={() => removeCard(card.id)}
                  >
                    ×
                  </Button>
                </div>
              </CardStackItem>
            ))}
          </CardStack>
        ) : (
          <div className="flex h-[220px] w-[220px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400">
            No cards
          </div>
        )}
      </div>
    );
  },
};
