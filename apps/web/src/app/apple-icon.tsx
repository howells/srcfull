import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

/**
 * Srcfull Apple Touch Icon
 *
 * Simplified version for smaller sizes
 * Single concentric ring + filled center with S
 *
 * To use: rename to apple-icon.tsx
 */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
      }}
    >
      {/* Outer ring */}
      <div
        style={{
          position: "absolute",
          width: 150,
          height: 150,
          borderRadius: 32,
          border: "3px solid rgba(0, 212, 255, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />

      {/* Inner filled square with S */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 22,
          background: "linear-gradient(135deg, #00d4ff 0%, #5ce5ff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 30px rgba(0, 212, 255, 0.3)",
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: "#0a0a0f",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          S
        </div>
      </div>
    </div>,
    size
  );
}
