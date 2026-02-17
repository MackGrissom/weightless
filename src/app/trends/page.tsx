import type { Metadata } from "next";
import {
  Code,
  Palette,
  Megaphone,
  Package,
  Headphones,
  PenTool,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { getMarketSnapshots, getCategories } from "@/lib/supabase/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MarketSnapshot, Category } from "@/types/database";
import { TrendsContent } from "./trends-content";

const categoryIconMap: Record<string, React.ReactNode> = {
  engineering: <Code className="h-5 w-5" />,
  design: <Palette className="h-5 w-5" />,
  marketing: <Megaphone className="h-5 w-5" />,
  product: <Package className="h-5 w-5" />,
  support: <Headphones className="h-5 w-5" />,
  writing: <PenTool className="h-5 w-5" />,
  data: <BarChart3 className="h-5 w-5" />,
  education: <GraduationCap className="h-5 w-5" />,
};

export const revalidate = 3600; // ISR: 1 hour

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

export const metadata: Metadata = {
  title: "Remote Hiring Trends — Market Data for Digital Nomads",
  description:
    "Live remote hiring trends: job counts by category, top tech skills in demand, and salary benchmarks by experience level. Updated weekly from real job postings on Weightless.",
  openGraph: {
    title: "Remote Hiring Trends — Market Data for Digital Nomads | Weightless",
    description:
      "Live remote hiring trends: job counts by category, top tech skills, and salary benchmarks by experience level. Updated weekly.",
    url: `${siteUrl}/trends`,
    siteName: "Weightless",
  },
  alternates: { canonical: `${siteUrl}/trends` },
};

function formatSalary(value: number | null): string {
  if (value === null || value === 0) return "N/A";
  return `$${Math.round(value / 1000)}k`;
}

export default async function TrendsPage() {
  const [snapshots, categories] = await Promise.all([
    getMarketSnapshots(),
    getCategories(),
  ]);

  if (snapshots.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Hiring <span className="text-accent">Trends</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Trends data is being compiled. Check back soon — first report drops
            this Sunday.
          </p>
        </div>
      </div>
    );
  }

  // Build a slug-to-name lookup from categories
  const categoryMap = new Map<string, Category>();
  for (const cat of categories) {
    categoryMap.set(cat.slug, cat);
  }

  // --- Section 1: Hiring by Category ---
  const categorySnapshots = snapshots.filter(
    (s) => s.category_slug !== null
  );
  // Deduplicate by category_slug, keeping the most recent snapshot for each
  const latestByCategory = new Map<string, MarketSnapshot>();
  for (const s of categorySnapshots) {
    const existing = latestByCategory.get(s.category_slug!);
    if (!existing || s.snapshot_date > existing.snapshot_date) {
      latestByCategory.set(s.category_slug!, s);
    }
  }
  const categoryData = Array.from(latestByCategory.values()).sort(
    (a, b) => b.job_count - a.job_count
  );
  const maxCategoryJobs = Math.max(
    ...categoryData.map((s) => s.job_count),
    1
  );

  // --- Section 2: Top Tech Skills ---
  const techSnapshots = snapshots.filter(
    (s) => s.tech_skill !== null && s.job_count >= 3
  );
  // Deduplicate by tech_skill, keeping the most recent snapshot for each
  const latestByTech = new Map<string, MarketSnapshot>();
  for (const s of techSnapshots) {
    const existing = latestByTech.get(s.tech_skill!);
    if (!existing || s.snapshot_date > existing.snapshot_date) {
      latestByTech.set(s.tech_skill!, s);
    }
  }
  const techData = Array.from(latestByTech.values())
    .sort((a, b) => b.job_count - a.job_count)
    .slice(0, 15);
  const maxTechJobs = Math.max(...techData.map((s) => s.job_count), 1);

  // --- Section 3: Salary by Experience ---
  const experienceSnapshots = snapshots.filter(
    (s) => s.experience_level !== null
  );
  const latestByExperience = new Map<string, MarketSnapshot>();
  for (const s of experienceSnapshots) {
    const existing = latestByExperience.get(s.experience_level!);
    if (!existing || s.snapshot_date > existing.snapshot_date) {
      latestByExperience.set(s.experience_level!, s);
    }
  }
  const experienceOrder = ["junior", "mid", "senior", "lead", "executive"];
  const experienceLabels: Record<string, string> = {
    junior: "Junior",
    mid: "Mid-Level",
    senior: "Senior",
    lead: "Lead",
    executive: "Executive",
  };
  const experienceData = experienceOrder
    .map((level) => latestByExperience.get(level))
    .filter((s): s is MarketSnapshot => s !== undefined);

  // Find the latest snapshot date for the report timestamp
  const latestDate = snapshots.reduce(
    (latest, s) =>
      s.snapshot_date > latest ? s.snapshot_date : latest,
    snapshots[0].snapshot_date
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Hiring <span className="text-accent">Trends</span>
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Market data from real remote job postings. See which categories are
          hiring, what skills are in demand, and how salaries vary by experience
          level.
        </p>
        <p className="mt-1 text-sm text-muted-foreground/60">
          Last updated:{" "}
          {new Date(latestDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <TrendsContent
        freeSection={
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Hiring by Category</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryData.map((snapshot) => {
                const cat = categoryMap.get(snapshot.category_slug!);
                const barWidth = (snapshot.job_count / maxCategoryJobs) * 100;
                return (
                  <Card key={snapshot.category_slug}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {snapshot.category_slug && categoryIconMap[snapshot.category_slug] && (
                            <span className="text-accent">{categoryIconMap[snapshot.category_slug]}</span>
                          )}
                          {cat?.name || snapshot.category_slug}
                        </CardTitle>
                        {snapshot.median_salary !== null &&
                          snapshot.median_salary > 0 && (
                            <Badge variant="accent">
                              {formatSalary(snapshot.median_salary)}
                            </Badge>
                          )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>
                          {snapshot.job_count}{" "}
                          {snapshot.job_count === 1 ? "job" : "jobs"}
                        </span>
                        {snapshot.median_salary !== null &&
                          snapshot.median_salary > 0 && (
                            <span>median {formatSalary(snapshot.median_salary)}</span>
                          )}
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        }
        gatedSection={
          <>
            {/* Section 2: Top Tech Skills */}
            {techData.length > 0 && (
              <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Top Tech Skills</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {techData.map((snapshot, index) => {
                        const barWidth =
                          (snapshot.job_count / maxTechJobs) * 100;
                        return (
                          <div key={snapshot.tech_skill} className="group">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-mono text-muted-foreground w-5 text-right">
                                  {index + 1}
                                </span>
                                <span className="font-medium">
                                  {snapshot.tech_skill}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <span className="text-muted-foreground">
                                  {snapshot.job_count} jobs
                                </span>
                                {snapshot.median_salary !== null &&
                                  snapshot.median_salary > 0 && (
                                    <Badge variant="outline" className="font-mono">
                                      {formatSalary(snapshot.median_salary)}
                                    </Badge>
                                  )}
                              </div>
                            </div>
                            <div className="ml-8 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-accent transition-all duration-500"
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Section 3: Salary by Experience */}
            {experienceData.length > 0 && (
              <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Salary by Experience</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {experienceData.map((snapshot) => {
                    const label =
                      experienceLabels[snapshot.experience_level!] ||
                      snapshot.experience_level;
                    return (
                      <Card
                        key={snapshot.experience_level}
                        className="text-center"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            {label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-accent">
                            {formatSalary(snapshot.median_salary)}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            median salary
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground/60">
                            {snapshot.job_count}{" "}
                            {snapshot.job_count === 1 ? "job" : "jobs"} sampled
                          </p>
                          {snapshot.avg_salary_min !== null &&
                            snapshot.avg_salary_max !== null && (
                              <p className="mt-1 text-xs text-muted-foreground/60">
                                range {formatSalary(snapshot.avg_salary_min)} &ndash;{" "}
                                {formatSalary(snapshot.avg_salary_max)}
                              </p>
                            )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        }
      />
    </div>
  );
}
