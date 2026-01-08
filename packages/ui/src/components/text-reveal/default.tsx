import { TextReveal } from "packages/ui/src/components/text-reveal";

export default function Component() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <TextReveal className="font-bold text-foreground text-xl" variant="fade">
        Beautiful Text Reveal Animation
      </TextReveal>
    </div>
  );
}
