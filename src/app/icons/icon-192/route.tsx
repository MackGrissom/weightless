import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          borderRadius: 38,
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 108,
        }}
      >
        <span style={{ marginTop: -8 }}>🪶</span>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
