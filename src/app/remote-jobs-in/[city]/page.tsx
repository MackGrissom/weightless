import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  Wifi,
  Shield,
  DollarSign,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import {
  getCityBySlug,
  getJobsForCity,
} from "@/lib/supabase/queries";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { JobCard } from "@/components/jobs/job-card";
import { BreadcrumbStructuredData } from "@/components/shared/structured-data";

export const revalidate = 3600; // ISR: 1 hour

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

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
 * Dynamic metadata
 * --------------------------------------------------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: { city: string };
}): Promise<Metadata> {
  const city = await getCityBySlug(params.city);
  if (!city) return { title: "City Not Found" };

  const title = `Remote Jobs for Nomads in ${city.city}, ${city.country}`;
  const description = `Find remote jobs and explore the cost of living in ${city.city}, ${city.country}. COL index: ${city.col_index}, avg monthly cost: ${formatCurrency(city.avg_monthly_cost_usd)}${city.nomad_score ? `, nomad score: ${city.nomad_score}` : ""}. Browse the latest remote positions.`;

  return {
    title,
    description,
    keywords: [
      `remote jobs ${city.city}`,
      `digital nomad ${city.city}`,
      `cost of living ${city.city}`,
      `work remotely ${city.country}`,
      `${city.city} nomad guide`,
      "remote work",
      "digital nomad jobs",
    ],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/remote-jobs-in/${params.city}`,
      siteName: "Weightless",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${siteUrl}/remote-jobs-in/${params.city}`,
    },
  };
}

/* ---------------------------------------------------------------------------
 * Sub-components
 * --------------------------------------------------------------------------- */

function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p
            className={`text-lg font-bold ${accent ? "text-accent" : "text-foreground"}`}
          >
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

function CostOfLivingBar({ colIndex }: { colIndex: number }) {
  // NYC baseline = 100
  const pct = Math.min(colIndex, 150); // cap visual at 150
  const cheaper = colIndex < 100;
  const diff = Math.abs(100 - colIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost of Living Compared to NYC</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* This city */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">This city</span>
            <span className={cheaper ? "text-green-400 font-semibold" : "text-foreground font-semibold"}>
              {colIndex}
            </span>
          </div>
          <div className="relative h-4 w-full rounded-full bg-muted/50">
            <div
              className={`h-full rounded-full ${cheaper ? "bg-green-500/60" : "bg-accent/40"}`}
              style={{ width: `${(pct / 150) * 100}%` }}
            />
          </div>
        </div>

        {/* NYC baseline */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">
              New York City (baseline)
            </span>
            <span className="text-muted-foreground font-semibold">100</span>
          </div>
          <div className="relative h-4 w-full rounded-full bg-muted/50">
            <div
              className="h-full rounded-full bg-muted-foreground/30"
              style={{ width: `${(100 / 150) * 100}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground pt-2">
          {cheaper
            ? `${diff}% cheaper than New York City. Your remote salary goes further here.`
            : colIndex === 100
              ? "Comparable cost of living to New York City."
              : `${diff}% more expensive than New York City.`}
        </p>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------------------------------------
 * Page
 * --------------------------------------------------------------------------- */

export default async function CityPage({
  params,
}: {
  params: { city: string };
}) {
  const [city, jobs] = await Promise.all([
    getCityBySlug(params.city),
    getJobsForCity(params.city, 10),
  ]);

  if (!city) notFound();

  const flag = countryFlag(city.country_code);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Structured data */}
      <BreadcrumbStructuredData
        siteUrl={siteUrl}
        items={[
          { name: "Home", url: "/" },
          { name: "Remote Jobs by City", url: "/remote-jobs-in" },
          {
            name: `${city.city}, ${city.country}`,
            url: `/remote-jobs-in/${params.city}`,
          },
        ]}
      />

      {/* Hero */}
      <header className="mb-12">
        <Link
          href="/remote-jobs-in"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          &larr; All cities
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl">{flag}</span>
          <div>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Remote Jobs in{" "}
              <span className="text-accent">{city.city}</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              {city.country}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          Explore the cost of living, nomad infrastructure, and the latest
          remote job opportunities for digital nomads considering{" "}
          {city.city}, {city.country}.
        </p>
      </header>

      {/* Key stats grid */}
      <section className="mb-12">
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            icon={DollarSign}
            label="COL Index"
            value={String(city.col_index)}
          />
          <StatCard
            icon={DollarSign}
            label="Avg. Monthly Cost"
            value={formatCurrency(city.avg_monthly_cost_usd)}
            accent
          />
          {city.nomad_score != null && (
            <StatCard
              icon={TrendingUp}
              label="Nomad Score"
              value={city.nomad_score.toFixed(1)}
            />
          )}
          {city.internet_speed_mbps != null && (
            <StatCard
              icon={Wifi}
              label="Internet Speed"
              value={`${city.internet_speed_mbps} Mbps`}
            />
          )}
          {city.safety_index != null && (
            <StatCard
              icon={Shield}
              label="Safety Index"
              value={String(city.safety_index)}
            />
          )}
        </div>
      </section>

      {/* Cost of living comparison */}
      <section className="mb-16 max-w-2xl">
        <CostOfLivingBar colIndex={city.col_index} />
      </section>

      {/* Latest remote jobs */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Latest <span className="text-accent">Remote Jobs</span>
          </h2>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
          >
            Browse all jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Globe className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No jobs available right now. Check back soon or browse all remote
              jobs.
            </p>
          </Card>
        )}
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-border bg-card p-8 sm:p-12 text-center">
        <h2 className="text-2xl font-bold">
          Ready to work from{" "}
          <span className="text-accent">{city.city}</span>?
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Browse thousands of remote positions and find the perfect role that
          lets you live and work in {city.city}.
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
