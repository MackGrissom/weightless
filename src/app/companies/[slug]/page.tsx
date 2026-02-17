import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CompanyHeader } from "@/components/companies/company-header";
import { JobCard } from "@/components/jobs/job-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getCompanyBySlug, getCompanyJobs } from "@/lib/supabase/queries";

export const revalidate = 1800; // ISR: 30 min

interface CompanyPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: CompanyPageProps): Promise<Metadata> {
  const company = await getCompanyBySlug(params.slug);
  if (!company) return { title: "Company Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";
  const description =
    company.description?.slice(0, 155) ||
    `View open remote positions at ${company.name}. Browse jobs, tech stack, and company info on Weightless.`;

  return {
    title: `${company.name} — Remote Jobs & Company Profile`,
    description,
    alternates: {
      canonical: `${siteUrl}/companies/${company.slug}`,
    },
    openGraph: {
      title: `${company.name} — Remote Jobs | Weightless`,
      description,
      url: `${siteUrl}/companies/${company.slug}`,
      siteName: "Weightless",
      ...(company.logo_url && {
        images: [{ url: company.logo_url, alt: company.name }],
      }),
    },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const company = await getCompanyBySlug(params.slug);
  if (!company) notFound();

  const jobs = await getCompanyJobs(company.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/companies"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to companies
      </Link>

      <CompanyHeader company={company} jobCount={jobs.length} />

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">
          Open Positions ({jobs.length})
        </h2>
        {jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No open positions"
            description="This company doesn't have any active job listings right now."
          />
        )}
      </div>
    </div>
  );
}
