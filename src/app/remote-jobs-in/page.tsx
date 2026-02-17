import type { Metadata } from "next";
import Link from "next/link";
import { Globe } from "lucide-react";
import { getAllCities, cityToSlug } from "@/lib/supabase/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/shared/tag";
import { BreadcrumbStructuredData } from "@/components/shared/structured-data";

export const revalidate = 3600; // ISR: 1 hour

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

export const metadata: Metadata = {
  title: "Remote Jobs by City — Best Cities for Digital Nomads",
  description:
    "Explore the best cities for digital nomads with cost-of-living data, nomad scores, internet speed, and safety indexes. Find remote jobs tailored to your next destination.",
  keywords: [
    "remote jobs by city",
    "best cities for digital nomads",
    "cost of living remote workers",
    "digital nomad cities",
    "work remotely abroad",
    "nomad score",
    "remote work destinations",
  ],
  openGraph: {
    title: "Remote Jobs by City — Best Cities for Digital Nomads",
    description:
      "Explore the best cities for digital nomads with cost-of-living data, nomad scores, and remote job listings.",
    url: `${siteUrl}/remote-jobs-in`,
    siteName: "Weightless",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Jobs by City — Best Cities for Digital Nomads",
    description:
      "Explore the best cities for digital nomads with cost-of-living data, nomad scores, and remote job listings.",
  },
  alternates: {
    canonical: `${siteUrl}/remote-jobs-in`,
  },
};

/* ---------------------------------------------------------------------------
 * Helpers
 * --------------------------------------------------------------------------- */

function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`;
}

/* ---------------------------------------------------------------------------
 * Page
 * --------------------------------------------------------------------------- */

export default async function RemoteJobsByCityPage() {
  const cities = await getAllCities();

  // Already sorted by nomad_score desc from the query, but ensure fallback
  const sorted = [...cities].sort(
    (a, b) => (b.nomad_score ?? 0) - (a.nomad_score ?? 0)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Structured data */}
      <BreadcrumbStructuredData
        siteUrl={siteUrl}
        items={[
          { name: "Home", url: "/" },
          { name: "Remote Jobs by City", url: "/remote-jobs-in" },
        ]}
      />

      {/* Header */}
      <div className="mb-12 max-w-3xl">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Remote Jobs by{" "}
          <span className="text-accent">City</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          The best cities for digital nomads, ranked by nomad score. Each city
          page includes cost-of-living data, internet speed, safety ratings,
          and the latest remote job listings.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">
              {sorted.length}
            </span>{" "}
            cities tracked
          </span>
          <span className="text-border">|</span>
          <span>Updated hourly</span>
        </div>
      </div>

      {/* City grid */}
      {sorted.length === 0 ? (
        <Card className="p-12 text-center">
          <Globe className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            City data will appear here once cost-of-living data is available.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((city) => {
            const slug = cityToSlug(city.city);
            const flag = countryFlag(city.country_code);

            return (
              <Link
                key={city.id}
                href={`/remote-jobs-in/${slug}`}
                className="block group"
              >
                <Card className="p-5 h-full transition-colors hover:border-accent/30 hover:bg-card/80">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{flag}</span>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                        {city.city}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {city.country}
                      </p>
                    </div>
                    {city.nomad_score != null && (
                      <Badge variant="accent" className="ml-auto shrink-0">
                        {city.nomad_score.toFixed(1)}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        COL Index
                      </p>
                      <p className="font-semibold">{city.col_index}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Avg/Month
                      </p>
                      <p className="font-semibold text-accent">
                        {formatCurrency(city.avg_monthly_cost_usd)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        vs NYC
                      </p>
                      <p
                        className={`font-semibold ${
                          city.col_index < 100
                            ? "text-green-400"
                            : "text-foreground"
                        }`}
                      >
                        {city.col_index < 100
                          ? `${100 - city.col_index}% less`
                          : city.col_index === 100
                            ? "Same"
                            : `${city.col_index - 100}% more`}
                      </p>
                    </div>
                  </div>

                  {(city.internet_speed_mbps != null ||
                    city.safety_index != null) && (
                    <div className="flex gap-2 mt-3">
                      {city.internet_speed_mbps != null && (
                        <Tag>{city.internet_speed_mbps} Mbps</Tag>
                      )}
                      {city.safety_index != null && (
                        <Tag>Safety: {city.safety_index}</Tag>
                      )}
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Bottom CTA */}
      <section className="mt-16 rounded-xl border border-border bg-card p-8 sm:p-12 text-center">
        <h2 className="text-2xl font-bold">
          Find your next{" "}
          <span className="text-accent">home base</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Compare cities, check salary purchasing power, and browse thousands
          of remote positions — all in one place.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/jobs"
            className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Browse Remote Jobs
          </Link>
          <Link
            href="/calculator"
            className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Salary Calculator
          </Link>
        </div>
      </section>
    </div>
  );
}
