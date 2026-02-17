import type { JobWithCompany } from "@/types/database";

interface JobStructuredDataProps {
  job: JobWithCompany;
  siteUrl: string;
}

export function JobStructuredData({ job, siteUrl }: JobStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description_plain || job.description,
    datePosted: job.date_posted,
    employmentType: mapJobType(job.job_type),
    jobLocationType: "TELECOMMUTE",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company?.name,
      ...(job.company?.logo_url && { logo: job.company.logo_url }),
      ...(job.company?.website && { sameAs: job.company.website }),
    },
    ...(job.salary_min &&
      job.salary_max && {
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: job.salary_currency || "USD",
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salary_min,
            maxValue: job.salary_max,
            unitText: "YEAR",
          },
        },
      }),
    ...(job.apply_url && { directApply: true }),
    url: `${siteUrl}/jobs/${job.slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

function mapJobType(type: string): string {
  const map: Record<string, string> = {
    full_time: "FULL_TIME",
    part_time: "PART_TIME",
    contract: "CONTRACTOR",
    freelance: "CONTRACTOR",
    internship: "INTERN",
  };
  return map[type] || "OTHER";
}
