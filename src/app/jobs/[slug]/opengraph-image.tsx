import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export const alt = "Job listing on Weightless";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: job } = await supabase
    .from("jobs")
    .select(
      `
      *,
      company:companies(*),
      category:categories(*)
    `
    )
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!job) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#0a0a0a",
            color: "#ededed",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Job Not Found
        </div>
      ),
      { ...size }
    );
  }

  const salaryMin = job.salary_min
    ? `$${Math.round(job.salary_min / 1000)}k`
    : null;
  const salaryMax = job.salary_max
    ? `$${Math.round(job.salary_max / 1000)}k`
    : null;
  const salaryText =
    salaryMin && salaryMax ? `${salaryMin} - ${salaryMax}` : null;

  const techTags: string[] = (job.tech_stack || []).slice(0, 4);
  const location = job.location_requirements || "Remote";
  const companyName = job.company?.name || "Unknown Company";
  const categoryName = job.category?.name || null;

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
        }}
      >
        {/* Top bar: Branding + Location */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: 32 }}>🪶</span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#ededed",
                letterSpacing: "-0.02em",
              }}
            >
              Weightless
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#a0a0a0",
              fontSize: 22,
            }}
          >
            <span>📍</span>
            <span>{location}</span>
          </div>
        </div>

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: "16px",
          }}
        >
          {/* Category badge */}
          {categoryName && (
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  backgroundColor: "rgba(200, 255, 0, 0.12)",
                  border: "1px solid rgba(200, 255, 0, 0.3)",
                  borderRadius: "9999px",
                  padding: "6px 20px",
                  fontSize: 18,
                  color: "#c8ff00",
                  fontWeight: 600,
                }}
              >
                {categoryName}
              </div>
            </div>
          )}

          {/* Job title */}
          <div
            style={{
              display: "flex",
              fontSize: job.title.length > 40 ? 44 : 52,
              fontWeight: 700,
              color: "#ededed",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
            }}
          >
            {job.title}
          </div>

          {/* Company name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: 26,
              color: "#a0a0a0",
            }}
          >
            <span>at {companyName}</span>
          </div>

          {/* Salary */}
          {salaryText && (
            <div
              style={{
                display: "flex",
                marginTop: "8px",
                fontSize: 36,
                fontWeight: 700,
                color: "#c8ff00",
                letterSpacing: "-0.02em",
              }}
            >
              {salaryText}
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  color: "#a0a0a0",
                  marginLeft: "10px",
                  alignSelf: "flex-end",
                  marginBottom: "4px",
                }}
              >
                / year
              </span>
            </div>
          )}
        </div>

        {/* Bottom: Tech stack tags */}
        {techTags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            {techTags.map((tag: string) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "8px",
                  padding: "8px 18px",
                  fontSize: 18,
                  color: "#ededed",
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}

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
