import type { JobWithCompany } from "@/types/database";

interface JobStructuredDataProps {
  job: JobWithCompany;
  siteUrl: string;
}

export function JobStructuredData({ job, siteUrl }: JobStructuredDataProps) {
  // validThrough: 30 days from posting
  const datePosted = new Date(job.date_posted);
  const validThrough = new Date(datePosted);
  validThrough.setDate(validThrough.getDate() + 30);

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description_plain || job.description || job.title,
    datePosted: job.date_posted,
    validThrough: validThrough.toISOString(),
    employmentType: mapJobType(job.job_type),
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: {
      "@type": "Country",
      name: job.location_requirements || "Worldwide",
    },
    hiringOrganization: {
      "@type": "Organization",
      name: job.company?.name,
      ...(job.company?.logo_url && { logo: job.company.logo_url }),
      ...(job.company?.website && { sameAs: job.company.website }),
    },
    identifier: {
      "@type": "PropertyValue",
      name: "Weightless",
      value: job.slug,
    },
    url: `${siteUrl}/jobs/${job.slug}`,
  };

  if (job.apply_url) {
    structuredData.directApply = true;
  }

  if (job.salary_min && job.salary_max) {
    structuredData.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.salary_currency || "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salary_min,
        maxValue: job.salary_max,
        unitText: "YEAR",
      },
    };
  } else if (job.salary_min || job.salary_max) {
    structuredData.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.salary_currency || "USD",
      value: {
        "@type": "QuantitativeValue",
        value: job.salary_min || job.salary_max,
        unitText: "YEAR",
      },
    };
  }

  if (job.experience_level) {
    structuredData.experienceRequirements = mapExperience(job.experience_level);
  }

  if (job.tech_stack && job.tech_stack.length > 0) {
    structuredData.skills = job.tech_stack.join(", ");
  }

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

function mapExperience(level: string): string {
  const map: Record<string, string> = {
    junior: "Entry level, no experience required",
    mid: "2-5 years of experience required",
    senior: "5+ years of experience required",
    lead: "7+ years of experience with leadership required",
    executive: "10+ years of experience at executive level required",
  };
  return map[level] || "";
}
