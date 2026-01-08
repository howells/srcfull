import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
          width: 380,
          height: 380,
          borderRadius: 120,
          background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            fontSize: 240,
            fontWeight: 800,
            letterSpacing: -12,
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
