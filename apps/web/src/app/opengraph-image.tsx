import { ImageResponse } from "next/og";

export const alt = "Srcfull - Find the source. Every time.";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

/**
 * Srcfull OpenGraph Image
 *
 * Design: Dark background with pixel grid pattern,
 * logo, tagline, and cyan glow effects
 *
 * To use: rename to opengraph-image.tsx
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        position: "relative",
      }}
    >
      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top gradient glow */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: "50%",
          width: 800,
          height: 400,
          background:
            "radial-gradient(ellipse at center, rgba(0, 212, 255, 0.15), transparent 70%)",
          transform: "translateX(-50%)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            position: "relative",
            width: 80,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Outer ring */}
          <div
            style={{
              position: "absolute",
              width: 80,
              height: 80,
              borderRadius: 16,
              border: "2px solid rgba(0, 212, 255, 0.3)",
            }}
          />
          {/* Middle ring */}
          <div
            style={{
              position: "absolute",
              width: 60,
              height: 60,
              borderRadius: 12,
              border: "2px solid rgba(0, 212, 255, 0.5)",
            }}
          />
          {/* Inner filled */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "linear-gradient(135deg, #00d4ff, #5ce5ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(0, 212, 255, 0.4)",
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#0a0a0f",
                fontFamily: "system-ui",
              }}
            >
              S
            </span>
          </div>
        </div>

        {/* Wordmark */}
        <span
          style={{
            fontSize: 56,
            fontWeight: 600,
            color: "#fafafa",
            fontFamily: "system-ui",
            letterSpacing: -2,
          }}
        >
          srcfull
        </span>
      </div>

      {/* Tagline */}
      <h1
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: "#fafafa",
          fontFamily: "system-ui",
          textAlign: "center",
          lineHeight: 1.1,
          letterSpacing: -3,
          margin: 0,
          marginBottom: 16,
        }}
      >
        Find the source.
      </h1>

      <h2
        style={{
          fontSize: 72,
          fontWeight: 700,
          background: "linear-gradient(135deg, #00d4ff, #5ce5ff)",
          backgroundClip: "text",
          color: "transparent",
          fontFamily: "system-ui",
          textAlign: "center",
          lineHeight: 1.1,
          letterSpacing: -3,
          margin: 0,
          marginBottom: 40,
        }}
      >
        Every time.
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: 28,
          color: "#94a3b8",
          fontFamily: "system-ui",
          textAlign: "center",
          maxWidth: 700,
          lineHeight: 1.4,
          margin: 0,
        }}
      >
        Resolve image URLs to their highest-quality source versions.
      </p>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, transparent, #00d4ff, transparent)",
        }}
      />
    </div>,
    size
  );
}
