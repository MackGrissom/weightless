import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JobSearch } from "@/components/jobs/job-search";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobList } from "@/components/jobs/job-list";
import { Pagination } from "@/components/shared/pagination";
import { JobListSkeleton } from "@/components/shared/loading-skeleton";
import { JobAlertSignup } from "@/components/jobs/job-alert-signup";
import { BreadcrumbStructuredData } from "@/components/shared/structured-data";
import { searchJobs, getCategories } from "@/lib/supabase/queries";
import type { JobType, ExperienceLevel } from "@/types/database";

export const revalidate = 1800;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

const categoryData: Record<
  string,
  { name: string; title: string; description: string; hero: string }
> = {
  engineering: {
    name: "Engineering",
    title: "Remote Engineering Jobs for Digital Nomads",
    description:
      "Browse remote software engineering, developer, and DevOps jobs. Filter by timezone, salary, visa sponsorship, and tech stack. Updated every 6 hours.",
    hero: "Find remote engineering roles at top companies — from frontend and backend to DevOps, SRE, and mobile development.",
  },
  design: {
    name: "Design",
    title: "Remote Design Jobs for Digital Nomads",
    description:
      "Find remote UX, UI, product design, and graphic design jobs. Work from anywhere with timezone-friendly roles and visa sponsorship options.",
    hero: "Explore remote design roles — UX/UI, product design, brand design, and creative direction at distributed companies.",
  },
  marketing: {
    name: "Marketing",
    title: "Remote Marketing Jobs for Digital Nomads",
    description:
      "Discover remote marketing, SEO, content marketing, and growth roles. Flexible positions with location independence for digital nomads.",
    hero: "Land remote marketing roles — growth, SEO, content strategy, paid media, and brand marketing at remote-first companies.",
  },
  product: {
    name: "Product",
    title: "Remote Product Jobs for Digital Nomads",
    description:
      "Browse remote product manager, product owner, and product analyst roles. Work from anywhere with async-friendly teams.",
    hero: "Find remote product roles — product management, product ownership, and product strategy at distributed teams worldwide.",
  },
  data: {
    name: "Data & Analytics",
    title: "Remote Data & Analytics Jobs for Digital Nomads",
    description:
      "Find remote data science, data engineering, analytics, ML, and AI jobs. Work from anywhere with competitive salaries.",
    hero: "Explore remote data roles — data science, data engineering, machine learning, AI, and business intelligence positions.",
  },
  support: {
    name: "Customer Support",
    title: "Remote Customer Support Jobs for Digital Nomads",
    description:
      "Browse remote customer success, support, and service roles. Timezone-flexible positions for digital nomads worldwide.",
    hero: "Find remote support roles — customer success, technical support, and service positions with flexible hours and timezones.",
  },
  writing: {
    name: "Writing & Content",
    title: "Remote Writing & Content Jobs for Digital Nomads",
    description:
      "Find remote content writing, copywriting, technical writing, and editorial jobs. Create from anywhere in the world.",
    hero: "Explore remote writing roles — content strategy, copywriting, technical writing, and editorial positions at distributed companies.",
  },
  education: {
    name: "Education",
    title: "Remote Education Jobs for Digital Nomads",
    description:
      "Discover remote teaching, tutoring, curriculum design, and education technology roles. Teach from anywhere.",
    hero: "Find remote education roles — teaching, tutoring, instructional design, and EdTech positions with location flexibility.",
  },
};

interface CategoryPageProps {
  params: { slug: string };
  searchParams: {
    q?: string;
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
    sort?: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const cat = categoryData[params.slug];
  if (!cat) return { title: "Category Not Found" };

  return {
    title: cat.title,
    description: cat.description,
    alternates: { canonical: `${siteUrl}/jobs/category/${params.slug}` },
    openGraph: {
      title: cat.title,
      description: cat.description,
      url: `${siteUrl}/jobs/category/${params.slug}`,
      siteName: "Weightless",
    },
    twitter: {
      card: "summary_large_image",
      title: cat.title,
      description: cat.description,
    },
  };
}

const PER_PAGE = 20;

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const cat = categoryData[params.slug];
  if (!cat) notFound();

  const page = Number(searchParams.page) || 1;

  const [result, categories] = await Promise.all([
    searchJobs({
      q: searchParams.q,
      category: params.slug,
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
      async_friendly:
        searchParams.async_friendly === "true" ? true : undefined,
      tech: searchParams.tech,
      page,
      per_page: PER_PAGE,
    }),
    getCategories(),
  ]);

  const totalPages = Math.ceil(result.total_count / PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <BreadcrumbStructuredData
        siteUrl={siteUrl}
        items={[
          { name: "Home", url: "/" },
          { name: "Jobs", url: "/jobs" },
          { name: cat.name, url: `/jobs/category/${params.slug}` },
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          <li>
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
            >
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href="/jobs"
              className="hover:text-foreground transition-colors"
            >
              Jobs
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{cat.name}</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Remote <span className="text-accent">{cat.name}</span> Jobs
        </h1>
        <p className="mt-2 text-muted-foreground max-w-3xl">{cat.hero}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(categoryData)
            .filter(([slug]) => slug !== params.slug)
            .slice(0, 4)
            .map(([slug, data]) => (
              <Link
                key={slug}
                href={`/jobs/category/${slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                {data.name}
                <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
        </div>
      </div>

      <Suspense>
        <JobSearch />
      </Suspense>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-xl border border-border bg-card p-4">
              <Suspense>
                <JobFilters categories={categories} />
              </Suspense>
            </div>
            <JobAlertSignup />
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

          <div className="mt-8 lg:hidden">
            <JobAlertSignup />
          </div>
        </div>
      </div>
    </div>
  );
}
