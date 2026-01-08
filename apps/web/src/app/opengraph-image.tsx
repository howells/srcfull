import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#08080a",
        color: "#fafafa",
        padding: 72,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 28,
              background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 54,
                fontWeight: 900,
                letterSpacing: -3,
                color: "#08080a",
                fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
                lineHeight: 1,
              }}
            >
              B
            </div>
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: -1,
              fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
            }}
          >
            Beeline
          </div>
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.05,
            fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
            maxWidth: 900,
          }}
        >
          Resolve image URLs to their highest-quality source versions.
        </div>

        <div
          style={{
            fontSize: 26,
            color: "rgba(250, 250, 250, 0.72)",
            fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
            maxWidth: 840,
            lineHeight: 1.4,
          }}
        >
          Paid API · API keys · Usage tracking · Learns patterns over time
        </div>
      </div>

      <div
        style={{
          alignSelf: "flex-end",
          padding: "20px 24px",
          borderRadius: 18,
          background: "rgba(245, 158, 11, 0.08)",
          border: "1px solid rgba(245, 158, 11, 0.25)",
          color: "rgba(250, 250, 250, 0.86)",
          fontSize: 22,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          whiteSpace: "pre",
        }}
      >
        {`POST /api/v1/transform\nAuthorization: Bearer sk_live_…\n\n{ "url": "https://…" }`}
      </div>
    </div>,
    size
  );
}
