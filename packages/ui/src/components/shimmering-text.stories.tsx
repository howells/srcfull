import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { ShimmeringText } from "./shimmering-text";

const meta = {
  title: "ShimmeringText",
  component: ShimmeringText,
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Text to display with shimmer effect",
    },
    duration: {
      control: { type: "number", min: 0.5, max: 10, step: 0.5 },
      description: "Animation duration in seconds",
    },
    delay: {
      control: { type: "number", min: 0, max: 5, step: 0.1 },
      description: "Delay before starting animation",
    },
    repeat: {
      control: "boolean",
      description: "Whether to repeat the animation",
    },
    repeatDelay: {
      control: { type: "number", min: 0, max: 5, step: 0.1 },
      description: "Pause duration between repeats in seconds",
    },
    startOnView: {
      control: "boolean",
      description: "Whether to start animation when component enters viewport",
    },
    once: {
      control: "boolean",
      description: "Whether to animate only once",
    },
    spread: {
      control: { type: "number", min: 0.5, max: 5, step: 0.5 },
      description: "Shimmer spread multiplier",
    },
    color: {
      control: "color",
      description: "Base text color",
    },
    shimmerColor: {
      control: "color",
      description: "Shimmer gradient color",
    },
    className: {
      control: "text",
      description: "Custom className",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "An animated text component that creates a shimmering gradient effect. Perfect for headings, call-to-actions, or any text that needs emphasis.",
      },
    },
  },
} satisfies Meta<typeof ShimmeringText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    text: "Shimmering Text",
    duration: 2,
    delay: 0,
    repeat: true,
    repeatDelay: 0.5,
    startOnView: false,
    once: false,
    spread: 2,
  },
  render: (args) => (
    <div className="flex min-h-[200px] items-center justify-center">
      <ShimmeringText {...args} />
    </div>
  ),
};

export const Default: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Basic shimmering text with default settings.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[200px] items-center justify-center">
      <ShimmeringText text="Welcome to Materia" startOnView={false} />
    </div>
  ),
};

export const LargeHeading: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Shimmering effect applied to a large heading.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[200px] items-center justify-center">
      <h1 className="text-6xl font-bold">
        <ShimmeringText
          text="Beautiful Design"
          duration={3}
          startOnView={false}
        />
      </h1>
    </div>
  ),
};

export const CustomDuration: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Different animation speeds from fast to slow.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-8">
      <div className="text-center">
        <p className="mb-2 text-sm text-muted-foreground">Fast (1s)</p>
        <ShimmeringText
          text="Quick Shimmer"
          duration={1}
          startOnView={false}
          className="text-2xl font-semibold"
        />
      </div>
      <div className="text-center">
        <p className="mb-2 text-sm text-muted-foreground">Normal (2s)</p>
        <ShimmeringText
          text="Normal Shimmer"
          duration={2}
          startOnView={false}
          className="text-2xl font-semibold"
        />
      </div>
      <div className="text-center">
        <p className="mb-2 text-sm text-muted-foreground">Slow (4s)</p>
        <ShimmeringText
          text="Slow Shimmer"
          duration={4}
          startOnView={false}
          className="text-2xl font-semibold"
        />
      </div>
    </div>
  ),
};

export const NoRepeat: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Single animation that plays once without repeating. Refresh to see again.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[200px] items-center justify-center">
      <ShimmeringText
        text="One Time Only"
        repeat={false}
        startOnView={false}
        className="text-3xl font-bold"
      />
    </div>
  ),
};

export const WithDelay: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Animation starts after a 1 second delay.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[200px] items-center justify-center">
      <ShimmeringText
        text="Delayed Start"
        delay={1}
        startOnView={false}
        className="text-3xl font-bold"
      />
    </div>
  ),
};

export const CustomColors: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Custom base and shimmer colors for brand-specific effects.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-8 bg-neutral-950 p-8">
      <div className="text-center">
        <p className="mb-2 text-sm text-neutral-400">Blue Shimmer</p>
        <ShimmeringText
          text="Ocean Waves"
          color="#1e40af"
          shimmerColor="#3b82f6"
          startOnView={false}
          className="text-3xl font-bold"
        />
      </div>
      <div className="text-center">
        <p className="mb-2 text-sm text-neutral-400">Purple Shimmer</p>
        <ShimmeringText
          text="Cosmic Glow"
          color="#6b21a8"
          shimmerColor="#a855f7"
          startOnView={false}
          className="text-3xl font-bold"
        />
      </div>
      <div className="text-center">
        <p className="mb-2 text-sm text-neutral-400">Green Shimmer</p>
        <ShimmeringText
          text="Forest Light"
          color="#15803d"
          shimmerColor="#22c55e"
          startOnView={false}
          className="text-3xl font-bold"
        />
      </div>
    </div>
  ),
};

export const LongText: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Shimmer effect scales automatically with text length.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[200px] max-w-2xl items-center justify-center p-8">
      <ShimmeringText
        text="This is a much longer piece of text that demonstrates how the shimmer effect automatically scales to accommodate different text lengths while maintaining a smooth, elegant animation."
        duration={3}
        startOnView={false}
        className="text-xl leading-relaxed"
      />
    </div>
  ),
};

export const MultipleInstances: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Multiple shimmering text elements with staggered delays.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
      <ShimmeringText
        text="First Line"
        delay={0}
        startOnView={false}
        className="text-2xl font-semibold"
      />
      <ShimmeringText
        text="Second Line"
        delay={0.3}
        startOnView={false}
        className="text-2xl font-semibold"
      />
      <ShimmeringText
        text="Third Line"
        delay={0.6}
        startOnView={false}
        className="text-2xl font-semibold"
      />
    </div>
  ),
};

export const ViewportTrigger: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Scroll down to see the animation trigger when entering the viewport.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[200vh] flex-col">
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Scroll down to see the effect</p>
      </div>
      <div className="flex h-screen items-center justify-center">
        <ShimmeringText
          text="I animate on scroll!"
          startOnView={true}
          once={true}
          className="text-4xl font-bold"
        />
      </div>
    </div>
  ),
};
