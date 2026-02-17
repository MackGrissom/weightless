import type { Metadata } from "next";
import { Suspense } from "react";
import { JobSearch } from "@/components/jobs/job-search";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobList } from "@/components/jobs/job-list";
import { Pagination } from "@/components/shared/pagination";
import { JobListSkeleton } from "@/components/shared/loading-skeleton";
import { searchJobs, getCategories } from "@/lib/supabase/queries";
import type { JobType, ExperienceLevel } from "@/types/database";

export const metadata: Metadata = {
  title: "Remote Jobs",
  description:
    "Browse hundreds of remote jobs for digital nomads. Filter by timezone, visa sponsorship, salary, and more.",
};

interface JobsPageProps {
  searchParams: {
    q?: string;
    category?: string;
    job_type?: string;
    experience?: string;
    salary_min?: string;
    salary_max?: string;
    timezone_min?: string;
    timezone_max?: string;
    visa?: string;
    async_friendly?: string;
    tech?: string;
    page?: string;
  };
}

const PER_PAGE = 20;

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const page = Number(searchParams.page) || 1;

  const [result, categories] = await Promise.all([
    searchJobs({
      q: searchParams.q,
      category: searchParams.category,
      job_type: searchParams.job_type as JobType | undefined,
      experience: searchParams.experience as ExperienceLevel | undefined,
      salary_min: searchParams.salary_min
        ? Number(searchParams.salary_min)
        : undefined,
      salary_max: searchParams.salary_max
        ? Number(searchParams.salary_max)
        : undefined,
      timezone_min: searchParams.timezone_min
        ? Number(searchParams.timezone_min)
        : undefined,
      timezone_max: searchParams.timezone_max
        ? Number(searchParams.timezone_max)
        : undefined,
      visa: searchParams.visa === "true" ? true : undefined,
      async_friendly: searchParams.async_friendly === "true" ? true : undefined,
      tech: searchParams.tech,
      page,
      per_page: PER_PAGE,
    }),
    getCategories(),
  ]);

  const totalPages = Math.ceil(result.total_count / PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Remote Jobs</h1>
        <p className="mt-2 text-muted-foreground">
          Find your next remote role — filter by timezone, visa, salary, and
          more.
        </p>
      </div>

      <Suspense>
        <JobSearch />
      </Suspense>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-4">
            <Suspense>
              <JobFilters categories={categories} />
            </Suspense>
          </div>
        </aside>

        <div>
          <Suspense fallback={<JobListSkeleton />}>
            <JobList jobs={result.jobs} totalCount={result.total_count} />
          </Suspense>

          {totalPages > 1 && (
            <div className="mt-8">
              <Suspense>
                <Pagination currentPage={page} totalPages={totalPages} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
