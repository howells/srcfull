import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#08080a",
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: 44,
          background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -6,
            color: "#08080a",
            fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
            lineHeight: 1,
          }}
        >
          B
        </div>
      </div>
    </div>,
    size
  );
}
