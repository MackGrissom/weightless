import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { JobDetailHeader } from "@/components/jobs/job-detail-header";
import { JobDetailBody } from "@/components/jobs/job-detail-body";
import { JobStructuredData } from "@/components/jobs/job-structured-data";
import { SalaryDisplay } from "@/components/jobs/salary-display";
import { TimezoneBadge } from "@/components/jobs/timezone-badge";
import { JobCard } from "@/components/jobs/job-card";
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

  return {
    title: `${job.title} at ${job.company?.name}`,
    description: job.description_plain?.slice(0, 160) || job.title,
    openGraph: {
      title: `${job.title} at ${job.company?.name}`,
      description: job.description_plain?.slice(0, 160) || job.title,
      type: "article",
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

  return (
    <>
      <JobStructuredData job={job} siteUrl={siteUrl} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <JobDetailHeader job={job} />
            <JobDetailBody job={job} />
          </div>

          <aside className="space-y-6">
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-4">
                {job.company?.logo_url ? (
                  <Image
                    src={job.company.logo_url}
                    alt={job.company.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-lg object-cover bg-muted"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
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
