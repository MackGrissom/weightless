import Link from "next/link";
import {
  MapPin,
  Clock,
  DollarSign,
  Globe,
  Plane,
} from "lucide-react";
import { CompanyLogo } from "@/components/shared/company-logo";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/shared/tag";
import { formatSalaryRange, timeAgo, formatTimezone } from "@/lib/utils";
import type { JobWithCompany } from "@/types/database";

interface JobCardProps {
  job: JobWithCompany;
}

const jobTypeLabels: Record<string, string> = {
  full_time: "Full-Time",
  part_time: "Part-Time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
};

export function JobCard({ job }: JobCardProps) {
  const salary = formatSalaryRange(job.salary_min, job.salary_max);
  const timezone = formatTimezone(job.timezone_min, job.timezone_max);

  return (
    <Link href={`/jobs/${job.slug}`} className="block group">
      <Card className="p-5 transition-colors hover:border-accent/30 hover:bg-card/80">
        <div className="flex items-start gap-4">
          <CompanyLogo
            src={job.company?.logo_url ?? null}
            alt={job.company?.name ?? "Company"}
            size={48}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {job.company?.name}
                </p>
              </div>
              {job.is_featured && <Badge variant="accent">Featured</Badge>}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {jobTypeLabels[job.job_type] || job.job_type}
              </span>

              {salary && (
                <span className="inline-flex items-center gap-1 text-accent">
                  <DollarSign className="h-3.5 w-3.5" />
                  {salary}
                </span>
              )}

              {job.location_requirements && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location_requirements}
                </span>
              )}

              {timezone && (
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  {timezone}
                </span>
              )}

              {job.visa_sponsorship && (
                <span className="inline-flex items-center gap-1 text-green-400">
                  <Plane className="h-3.5 w-3.5" />
                  Visa Sponsor
                </span>
              )}
            </div>

            {job.tech_stack.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.tech_stack.slice(0, 5).map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
                {job.tech_stack.length > 5 && (
                  <Tag>+{job.tech_stack.length - 5}</Tag>
                )}
              </div>
            )}
          </div>

          <span className="shrink-0 text-xs text-muted-foreground">
            {timeAgo(job.date_posted)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
