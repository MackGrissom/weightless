import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          borderRadius: 96,
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 288,
        }}
      >
        <span style={{ marginTop: -20 }}>🪶</span>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
