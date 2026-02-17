import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Weightless — Remote Jobs for Digital Nomads";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            right: 0,
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle at top right, rgba(200, 255, 0, 0.06) 0%, transparent 70%)",
          }}
        />

        {/* Top: Branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "60px",
          }}
        >
          <span style={{ fontSize: 40 }}>🪶</span>
          <span
            style={{
              fontSize: 34,
              fontWeight: 700,
              color: "#ededed",
              letterSpacing: "-0.02em",
            }}
          >
            Weightless
          </span>
        </div>

        {/* Center: Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 700,
                color: "#ededed",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
              }}
            >
              Remote Jobs for
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 700,
                color: "#c8ff00",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
              }}
            >
              Digital Nomads
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: 24,
              color: "#a0a0a0",
              marginTop: "12px",
            }}
          >
            <span>Salary data</span>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#c8ff00",
              }}
            />
            <span>Hiring trends</span>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#c8ff00",
              }}
            />
            <span>Cost-of-living tools</span>
          </div>
        </div>

        {/* Bottom: Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {[
            "Timezone Filtering",
            "Visa Sponsorship",
            "Async-Friendly",
            "Free for Job Seekers",
          ].map((feature) => (
            <div
              key={feature}
              style={{
                display: "flex",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "9999px",
                padding: "10px 22px",
                fontSize: 18,
                color: "#ededed",
                fontWeight: 500,
              }}
            >
              {feature}
            </div>
          ))}
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "4px",
            backgroundColor: "#c8ff00",
            borderRadius: "2px",
            marginTop: "24px",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
