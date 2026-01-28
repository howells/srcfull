/**
 * Srcfull Logo Component
 *
 * The logo represents the concept of "resolution" through concentric
 * squares converging on the center - like nested image sizes
 * (thumbnail > medium > original) or a camera focusing.
 *
 * Variants:
 * - mark: Icon only (concentric squares with S)
 * - wordmark: Icon + "srcfull" text
 * - full: Icon + "srcfull" + tagline
 */

import Link from "next/link";

type LogoVariant = "mark" | "wordmark" | "full";
type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  href?: string;
  className?: string;
  animate?: boolean;
}

const sizeConfig = {
  sm: {
    mark: 24,
    text: "text-sm",
    tagline: "text-[10px]",
    gap: "gap-2",
  },
  md: {
    mark: 32,
    text: "text-base",
    tagline: "text-xs",
    gap: "gap-2.5",
  },
  lg: {
    mark: 40,
    text: "text-lg",
    tagline: "text-xs",
    gap: "gap-3",
  },
  xl: {
    mark: 56,
    text: "text-2xl",
    tagline: "text-sm",
    gap: "gap-4",
  },
};

export function SrcfullLogo({
  variant = "wordmark",
  size = "md",
  href,
  className = "",
  animate = false,
}: LogoProps) {
  const config = sizeConfig[size];

  const content = (
    <div className={`flex items-center ${config.gap} ${className}`}>
      <LogoMark size={config.mark} animate={animate} />
      {variant !== "mark" && (
        <div className="flex flex-col">
          <span
            className={`font-display font-semibold tracking-tight ${config.text}`}
          >
            srcfull
          </span>
          {variant === "full" && (
            <span
              className={`text-[var(--text-muted)] ${config.tagline} leading-tight`}
            >
              Find the source
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}

/**
 * Logo Mark Component
 *
 * The icon portion of the logo - concentric rounded squares
 * converging on an "S" in the center.
 */
interface LogoMarkProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export function LogoMark({
  size = 32,
  animate = false,
  className = "",
}: LogoMarkProps) {
  // Calculate proportions based on size
  const outerRing = size;
  const middleRing = size * 0.75;
  const innerSquare = size * 0.5;
  const fontSize = size * 0.35;
  const borderRadius = size * 0.2;
  const middleRadius = size * 0.15;
  const innerRadius = size * 0.1;
  const borderWidth = Math.max(1, size * 0.04);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ring */}
      <div
        className={animate ? "animate-focus-pulse" : ""}
        style={{
          position: "absolute",
          width: outerRing,
          height: outerRing,
          borderRadius: borderRadius,
          border: `${borderWidth}px solid rgba(0, 212, 255, 0.3)`,
        }}
      />

      {/* Middle ring */}
      <div
        style={{
          position: "absolute",
          width: middleRing,
          height: middleRing,
          borderRadius: middleRadius,
          border: `${borderWidth}px solid rgba(0, 212, 255, 0.5)`,
        }}
      />

      {/* Inner filled square with S */}
      <div
        className="flex items-center justify-center"
        style={{
          width: innerSquare,
          height: innerSquare,
          borderRadius: innerRadius,
          background: "linear-gradient(135deg, #00d4ff 0%, #5ce5ff 100%)",
          boxShadow: animate
            ? "0 0 20px rgba(0, 212, 255, 0.3)"
            : "0 0 12px rgba(0, 212, 255, 0.2)",
        }}
      >
        <span
          className="font-display font-bold"
          style={{
            fontSize: fontSize,
            color: "#0a0a0f",
            lineHeight: 1,
          }}
        >
          S
        </span>
      </div>
    </div>
  );
}

/**
 * Monochrome Logo Mark
 *
 * For use on colored backgrounds or in contexts
 * where the cyan gradient isn't appropriate.
 */
interface MonoLogoMarkProps {
  size?: number;
  color?: "white" | "black" | "current";
  className?: string;
}

export function MonoLogoMark({
  size = 32,
  color = "white",
  className = "",
}: MonoLogoMarkProps) {
  const colorValue =
    color === "current"
      ? "currentColor"
      : color === "white"
      ? "#ffffff"
      : "#000000";

  const opacity30 = color === "white" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
  const opacity50 = color === "white" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";

  const borderRadius = size * 0.2;
  const middleRadius = size * 0.15;
  const innerRadius = size * 0.1;
  const borderWidth = Math.max(1, size * 0.04);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ring */}
      <div
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: borderRadius,
          border: `${borderWidth}px solid ${opacity30}`,
        }}
      />

      {/* Middle ring */}
      <div
        style={{
          position: "absolute",
          width: size * 0.75,
          height: size * 0.75,
          borderRadius: middleRadius,
          border: `${borderWidth}px solid ${opacity50}`,
        }}
      />

      {/* Inner filled square with S */}
      <div
        className="flex items-center justify-center"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: innerRadius,
          background: colorValue,
        }}
      >
        <span
          className="font-display font-bold"
          style={{
            fontSize: size * 0.35,
            color: color === "white" ? "#0a0a0f" : "#ffffff",
            lineHeight: 1,
          }}
        >
          S
        </span>
      </div>
    </div>
  );
}

export default SrcfullLogo;
