import Link from "next/link";
import { TrendingUp, Flame, ArrowRight } from "lucide-react";

interface RecentActivityProps {
  newJobsThisWeek: number;
  topCategories: { name: string; slug: string; job_count: number }[];
}

export function RecentActivity({
  newJobsThisWeek,
  topCategories,
}: RecentActivityProps) {
  // Take top 3 categories with the most jobs
  const top = topCategories.slice(0, 3);

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* New this week */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Flame className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New this week</p>
                <p className="text-2xl font-bold">
                  {newJobsThisWeek.toLocaleString()}{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    fresh remote jobs
                  </span>
                </p>
              </div>
            </div>

            {/* Trending categories */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trending now</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {top.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/jobs/category/${cat.slug}`}
                      className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
                    >
                      {cat.name}
                      <span className="text-xs text-accent font-medium">
                        {cat.job_count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 shrink-0"
            >
              Browse All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
