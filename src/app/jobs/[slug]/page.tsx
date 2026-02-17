import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CompanyLogo } from "@/components/shared/company-logo";
import { JobDetailHeader } from "@/components/jobs/job-detail-header";
import { JobDetailBody } from "@/components/jobs/job-detail-body";
import { JobStructuredData } from "@/components/jobs/job-structured-data";
import { SalaryDisplay } from "@/components/jobs/salary-display";
import { TimezoneBadge } from "@/components/jobs/timezone-badge";
import { JobCard } from "@/components/jobs/job-card";
import { NomadToolkit } from "@/components/jobs/nomad-toolkit";
import { BreadcrumbStructuredData } from "@/components/shared/structured-data";
import { Card } from "@/components/ui/card";
import {
  getJobBySlug,
  getSimilarJobs,
  getCostOfLiving,
} from "@/lib/supabase/queries";

export const revalidate = 1800; // ISR: 30 min

interface JobPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const job = await getJobBySlug(params.slug);
  if (!job) return { title: "Job Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";
  const salaryPart =
    job.salary_min && job.salary_max
      ? ` | $${Math.round(job.salary_min / 1000)}k-$${Math.round(job.salary_max / 1000)}k`
      : "";
  const description = `${job.title} at ${job.company?.name}${salaryPart} — Remote. Apply now on Weightless, the job board for digital nomads.`;

  return {
    title: `${job.title} at ${job.company?.name}`,
    description,
    alternates: {
      canonical: `${siteUrl}/jobs/${job.slug}`,
    },
    openGraph: {
      title: `${job.title} at ${job.company?.name}${salaryPart}`,
      description,
      type: "article",
      url: `${siteUrl}/jobs/${job.slug}`,
      siteName: "Weightless",
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} at ${job.company?.name}`,
      description,
    },
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const job = await getJobBySlug(params.slug);
  if (!job) notFound();

  const [similarJobs, colData] = await Promise.all([
    getSimilarJobs(job, 4),
    getCostOfLiving(5),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Jobs", url: "/jobs" },
    { name: job.title, url: `/jobs/${job.slug}` },
  ];

  return (
    <>
      <JobStructuredData job={job} siteUrl={siteUrl} />
      <BreadcrumbStructuredData items={breadcrumbs} siteUrl={siteUrl} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/jobs" className="hover:text-foreground transition-colors">Jobs</Link></li>
            <li>/</li>
            <li className="text-foreground truncate max-w-[200px]">{job.title}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <JobDetailHeader job={job} />
            <JobDetailBody job={job} />
          </div>

          <aside className="space-y-6">
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <CompanyLogo
                  src={job.company?.logo_url ?? null}
                  alt={job.company?.name ?? "Company"}
                  size={40}
                />
                <div>
                  <Link
                    href={`/companies/${job.company?.slug}`}
                    className="font-semibold hover:text-accent transition-colors"
                  >
                    {job.company?.name}
                  </Link>
                  {job.company?.remote_policy && (
                    <p className="text-xs text-muted-foreground">
                      {job.company.remote_policy}
                    </p>
                  )}
                </div>
              </div>
              {job.company?.description && (
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {job.company.description}
                </p>
              )}
            </Card>

            <Card className="p-5">
              <SalaryDisplay
                salaryMin={job.salary_min}
                salaryMax={job.salary_max}
                currency={job.salary_currency}
                colData={colData}
              />
            </Card>

            <TimezoneBadge
              timezoneMin={job.timezone_min}
              timezoneMax={job.timezone_max}
              isAsyncFriendly={job.is_async_friendly}
              className="w-full justify-center py-2"
            />

            <NomadToolkit />
          </aside>
        </div>

        {similarJobs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-6">Similar Jobs</h2>
            <div className="space-y-3">
              {similarJobs.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
