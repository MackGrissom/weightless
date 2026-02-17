import type { Metadata } from "next";
import { Suspense } from "react";
import { JobSearch } from "@/components/jobs/job-search";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobList } from "@/components/jobs/job-list";
import { Pagination } from "@/components/shared/pagination";
import { JobListSkeleton } from "@/components/shared/loading-skeleton";
import { searchJobs, getCategories } from "@/lib/supabase/queries";
import type { JobType, ExperienceLevel } from "@/types/database";

const categoryMeta: Record<string, { title: string; description: string }> = {
  engineering: {
    title: "Remote Engineering Jobs",
    description: "Browse remote software engineering, developer, and DevOps jobs for digital nomads. Filter by timezone, salary, visa sponsorship, and tech stack.",
  },
  design: {
    title: "Remote Design Jobs",
    description: "Find remote UX, UI, and product design jobs for digital nomads. Work from anywhere with timezone-friendly roles.",
  },
  marketing: {
    title: "Remote Marketing Jobs",
    description: "Discover remote marketing, SEO, and growth jobs for digital nomads. Flexible roles with location independence.",
  },
  product: {
    title: "Remote Product Jobs",
    description: "Browse remote product manager and product owner roles for digital nomads. Work from anywhere in the world.",
  },
  data: {
    title: "Remote Data & Analytics Jobs",
    description: "Find remote data science, data engineering, and analytics jobs for digital nomads. ML, AI, and BI roles included.",
  },
  support: {
    title: "Remote Customer Support Jobs",
    description: "Browse remote customer success and support roles for digital nomads. Timezone-flexible positions available.",
  },
  writing: {
    title: "Remote Writing & Content Jobs",
    description: "Find remote content writing, copywriting, and editorial jobs for digital nomads. Create from anywhere.",
  },
  education: {
    title: "Remote Education Jobs",
    description: "Discover remote teaching, tutoring, and education roles for digital nomads. Teach from anywhere in the world.",
  },
};

export async function generateMetadata({ searchParams }: JobsPageProps): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";
  const cat = searchParams.category;

  if (cat && categoryMeta[cat]) {
    return {
      title: categoryMeta[cat].title,
      description: categoryMeta[cat].description,
      alternates: { canonical: `${siteUrl}/jobs?category=${cat}` },
      openGraph: {
        title: categoryMeta[cat].title,
        description: categoryMeta[cat].description,
        url: `${siteUrl}/jobs?category=${cat}`,
        siteName: "Weightless",
      },
    };
  }

  return {
    title: "Remote Jobs for Digital Nomads",
    description:
      "Browse 1,000+ remote jobs for digital nomads. Filter by category, timezone, visa sponsorship, salary, and tech stack. Updated every 6 hours.",
    alternates: { canonical: `${siteUrl}/jobs` },
    openGraph: {
      title: "Remote Jobs for Digital Nomads | Weightless",
      description:
        "Browse 1,000+ remote jobs with cost-of-living context, visa info, and timezone filtering. Free for job seekers.",
      url: `${siteUrl}/jobs`,
      siteName: "Weightless",
    },
  };
}

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
