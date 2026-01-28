import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

/**
 * Srcfull Favicon
 *
 * Design: Concentric rounded squares converging on an "S"
 * representing the journey from thumbnail to source
 *
 * To use: rename to icon.tsx
 */
export default function Icon() {
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
          width: 420,
          height: 420,
          borderRadius: 80,
          border: "4px solid rgba(0, 212, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />

      {/* Middle ring */}
      <div
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: 60,
          border: "4px solid rgba(0, 212, 255, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />

      {/* Inner filled square with S */}
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: 44,
          background: "linear-gradient(135deg, #00d4ff 0%, #5ce5ff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 60px rgba(0, 212, 255, 0.4)",
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 700,
            color: "#0a0a0f",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: -4,
            lineHeight: 1,
            marginTop: -8,
          }}
        >
          S
        </div>
      </div>
    </div>,
    size
  );
}
