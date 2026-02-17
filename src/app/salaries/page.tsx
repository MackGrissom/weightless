import type { Metadata } from "next";
import { getSalaryBenchmarks, getCostOfLiving } from "@/lib/supabase/queries";
import type { SalaryBenchmark, CostOfLiving } from "@/types/database";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/shared/tag";

export const revalidate = 3600; // ISR: 1 hour

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

export const metadata: Metadata = {
  title: "Remote Salary Explorer — What Do Remote Workers Earn?",
  description:
    "Explore real salary benchmarks for remote jobs. See p25/p50/p75 salary ranges for engineering, design, product, marketing, and more — plus what your salary buys in top digital nomad cities worldwide.",
  keywords: [
    "remote salary",
    "remote job salary",
    "digital nomad salary",
    "remote engineer salary",
    "remote developer salary",
    "remote work compensation",
    "salary benchmarks",
    "cost of living comparison",
    "remote salary by experience",
  ],
  openGraph: {
    title: "Remote Salary Explorer — What Do Remote Workers Earn?",
    description:
      "Real salary benchmarks for remote jobs. See p25–p75 ranges by role and experience, plus what your pay buys in top nomad cities.",
    url: `${siteUrl}/salaries`,
    siteName: "Weightless",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Salary Explorer — What Do Remote Workers Earn?",
    description:
      "Real salary benchmarks for remote jobs. See p25–p75 ranges by role and experience level.",
  },
  alternates: {
    canonical: `${siteUrl}/salaries`,
  },
};

/* ---------------------------------------------------------------------------
 * Helpers
 * --------------------------------------------------------------------------- */

function formatSalary(value: number | null): string {
  if (value == null) return "--";
  const k = Math.round(value / 1000);
  return `$${k}k`;
}

function experienceLabel(level: string | null): string {
  if (!level) return "All Levels";
  const map: Record<string, string> = {
    junior: "Junior",
    mid: "Mid-Level",
    senior: "Senior",
    lead: "Lead",
    executive: "Executive",
  };
  return map[level] ?? level;
}

function experienceVariant(
  level: string | null
): "default" | "secondary" | "outline" | "accent" {
  if (!level) return "secondary";
  const map: Record<string, "default" | "secondary" | "outline" | "accent"> = {
    junior: "outline",
    mid: "secondary",
    senior: "accent",
    lead: "default",
    executive: "default",
  };
  return map[level] ?? "secondary";
}

/** Group benchmarks by role_category, preserving insertion order. */
function groupByCategory(
  benchmarks: SalaryBenchmark[]
): Record<string, SalaryBenchmark[]> {
  const groups: Record<string, SalaryBenchmark[]> = {};
  for (const b of benchmarks) {
    const key = b.role_category;
    if (!groups[key]) groups[key] = [];
    groups[key].push(b);
  }
  return groups;
}

/** Country-code to flag emoji helper */
function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

/* ---------------------------------------------------------------------------
 * Sub-components (server components, no "use client" needed)
 * --------------------------------------------------------------------------- */

function SalaryBar({
  p25,
  p50,
  p75,
  globalMax,
}: {
  p25: number | null;
  p50: number | null;
  p75: number | null;
  globalMax: number;
}) {
  if (p25 == null || p50 == null || p75 == null || globalMax === 0) {
    return (
      <div className="text-xs text-muted-foreground italic">
        Insufficient data
      </div>
    );
  }

  const leftPct = (p25 / globalMax) * 100;
  const widthPct = ((p75 - p25) / globalMax) * 100;
  const medianPct = (p50 / globalMax) * 100;

  return (
    <div className="space-y-1.5">
      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatSalary(p25)}</span>
        <span className="font-semibold text-accent">{formatSalary(p50)}</span>
        <span>{formatSalary(p75)}</span>
      </div>
      {/* Bar */}
      <div className="relative h-3 w-full rounded-full bg-muted/50">
        {/* Range band */}
        <div
          className="absolute top-0 h-full rounded-full bg-accent/20"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
        {/* Median marker */}
        <div
          className="absolute top-0 h-full w-1 rounded-full bg-accent"
          style={{ left: `${medianPct}%` }}
        />
      </div>
      {/* Legend */}
      <div className="flex justify-between text-[10px] text-muted-foreground/60">
        <span>25th pctl</span>
        <span>median</span>
        <span>75th pctl</span>
      </div>
    </div>
  );
}

function SalaryCard({
  benchmark,
  globalMax,
}: {
  benchmark: SalaryBenchmark;
  globalMax: number;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="leading-snug">
            {benchmark.normalized_title}
          </CardTitle>
          <Badge variant={experienceVariant(benchmark.experience_level)}>
            {experienceLabel(benchmark.experience_level)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {benchmark.sample_size} job{benchmark.sample_size !== 1 ? "s" : ""}{" "}
          sampled
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Salary range bar */}
        <SalaryBar
          p25={benchmark.p25_salary}
          p50={benchmark.p50_salary}
          p75={benchmark.p75_salary}
          globalMax={globalMax}
        />

        {/* Top companies */}
        {benchmark.top_companies.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Top Companies
            </p>
            <div className="flex flex-wrap gap-1">
              {benchmark.top_companies.slice(0, 5).map((company) => (
                <Tag key={company}>{company}</Tag>
              ))}
            </div>
          </div>
        )}

        {/* Top tech */}
        {benchmark.top_tech.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Top Tech
            </p>
            <div className="flex flex-wrap gap-1">
              {benchmark.top_tech.slice(0, 6).map((tech) => (
                <Tag key={tech} className="bg-accent/10 text-accent">
                  {tech}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CityComparison({
  city,
  medianSalary,
}: {
  city: CostOfLiving;
  medianSalary: number;
}) {
  const monthsOfRunway = medianSalary / 12 / city.avg_monthly_cost_usd;
  const monthlyTakeHome = Math.round(medianSalary / 12);

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{countryFlag(city.country_code)}</span>
            <div>
              <p className="font-semibold text-sm">{city.city}</p>
              <p className="text-xs text-muted-foreground">{city.country}</p>
            </div>
          </div>
          {city.nomad_score != null && (
            <Badge variant="accent">{city.nomad_score.toFixed(1)} Nomad Score</Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Avg. Monthly Cost</p>
            <p className="font-semibold">
              ${city.avg_monthly_cost_usd.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Monthly Take-Home</p>
            <p className="font-semibold text-accent">
              ${monthlyTakeHome.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Effective Multiplier</p>
            <p className="font-semibold">
              {monthsOfRunway.toFixed(1)}x
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Monthly Savings</p>
            <p className="font-semibold">
              ${(monthlyTakeHome - city.avg_monthly_cost_usd).toLocaleString()}
            </p>
          </div>
        </div>

        {(city.internet_speed_mbps != null || city.safety_index != null) && (
          <div className="flex gap-2 pt-1">
            {city.internet_speed_mbps != null && (
              <Tag>{city.internet_speed_mbps} Mbps</Tag>
            )}
            {city.safety_index != null && (
              <Tag>Safety: {city.safety_index}</Tag>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------------------------------------
 * Page
 * --------------------------------------------------------------------------- */

export default async function SalariesPage() {
  const [benchmarks, costOfLiving] = await Promise.all([
    getSalaryBenchmarks(),
    getCostOfLiving(30),
  ]);

  // Global max salary for consistent bar scaling
  const globalMax = benchmarks.reduce((max, b) => {
    const val = b.p75_salary ?? b.max_salary ?? 0;
    return val > max ? val : max;
  }, 0);

  // Group benchmarks by category
  const grouped = groupByCategory(benchmarks);
  const categories = Object.keys(grouped);

  // Compute overall median salary for COL comparisons
  const medians = benchmarks
    .map((b) => b.p50_salary)
    .filter((v): v is number => v != null);
  const overallMedian =
    medians.length > 0
      ? medians.sort((a, b) => a - b)[Math.floor(medians.length / 2)]
      : 80000;

  // Top 5 nomad cities by nomad_score (descending)
  const topCities = [...costOfLiving]
    .filter((c) => c.nomad_score != null)
    .sort((a, b) => (b.nomad_score ?? 0) - (a.nomad_score ?? 0))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 max-w-3xl">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Remote <span className="text-accent">Salary</span> Explorer
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Real compensation data from thousands of remote job listings. See
          25th, 50th, and 75th percentile salary ranges broken down by role and
          experience level — then find out what that salary actually buys in the
          world&apos;s top nomad cities.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">
              {benchmarks.length}
            </span>{" "}
            salary benchmarks
          </span>
          <span className="text-border">|</span>
          <span>
            <span className="font-semibold text-foreground">
              {categories.length}
            </span>{" "}
            categories
          </span>
          <span className="text-border">|</span>
          <span>
            <span className="font-semibold text-foreground">
              {costOfLiving.length}
            </span>{" "}
            cities tracked
          </span>
        </div>
      </div>

      {/* Salary benchmarks by category */}
      {categories.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Salary data will appear here once benchmarks are computed.
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {categories.map((category) => (
            <section key={category} id={category}>
              <h2 className="text-2xl font-bold capitalize mb-6">
                {category.replace(/_/g, " ")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[category].map((benchmark) => (
                  <SalaryCard
                    key={benchmark.id}
                    benchmark={benchmark}
                    globalMax={globalMax}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Cost-of-living comparison */}
      {topCities.length > 0 && (
        <section className="mt-20">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-3xl font-bold">
              What does your salary{" "}
              <span className="text-accent">buy</span>?
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The median remote salary across all roles is{" "}
              <span className="font-semibold text-accent">
                {formatSalary(overallMedian)}
              </span>
              . Here&apos;s how far that goes in the top-rated digital nomad
              cities.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topCities.map((city) => (
              <CityComparison
                key={city.id}
                city={city}
                medianSalary={overallMedian}
              />
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="mt-20 rounded-xl border border-border bg-card p-8 sm:p-12 text-center">
        <h2 className="text-2xl font-bold">
          Know your worth. Work from{" "}
          <span className="text-accent">anywhere</span>.
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Salary data is refreshed weekly from active remote job listings. Pair
          it with our cost-of-living tools and start planning your next move.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="/jobs"
            className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Browse Remote Jobs
          </a>
          <a
            href="/about"
            className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Learn More
          </a>
        </div>
      </section>
    </div>
  );
}
