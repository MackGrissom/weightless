import Image from "next/image";
import {
  Building2,
  Clock,
  DollarSign,
  MapPin,
  Globe,
  Plane,
  Zap,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatSalaryRange, timeAgo, formatTimezone } from "@/lib/utils";
import type { JobWithCompany } from "@/types/database";

const jobTypeLabels: Record<string, string> = {
  full_time: "Full-Time",
  part_time: "Part-Time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
};

const experienceLabels: Record<string, string> = {
  junior: "Junior",
  mid: "Mid-Level",
  senior: "Senior",
  lead: "Lead",
  executive: "Executive",
};

interface JobDetailHeaderProps {
  job: JobWithCompany;
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const salary = formatSalaryRange(job.salary_min, job.salary_max);
  const timezone = formatTimezone(job.timezone_min, job.timezone_max);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        {job.company?.logo_url ? (
          <Image
            src={job.company.logo_url}
            alt={job.company.name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-xl object-cover bg-muted"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {job.is_featured && <Badge variant="accent">Featured</Badge>}
            {job.category && (
              <Badge variant="secondary">{job.category.name}</Badge>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{job.title}</h1>
          <p className="mt-1 text-lg text-muted-foreground">
            {job.company?.name}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {jobTypeLabels[job.job_type] || job.job_type}
        </div>

        {job.experience_level && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Zap className="h-4 w-4" />
            {experienceLabels[job.experience_level] || job.experience_level}
          </div>
        )}

        {salary && (
          <div className="flex items-center gap-1.5 text-accent font-medium">
            <DollarSign className="h-4 w-4" />
            {salary}/yr
          </div>
        )}

        {job.location_requirements && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {job.location_requirements}
          </div>
        )}

        {timezone && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Globe className="h-4 w-4" />
            {timezone}
          </div>
        )}

        {job.visa_sponsorship && (
          <div className="flex items-center gap-1.5 text-green-400">
            <Plane className="h-4 w-4" />
            Visa Sponsorship
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        {job.apply_url && (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg">
              Apply Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        )}
        <span className="text-sm text-muted-foreground">
          Posted {timeAgo(job.date_posted)}
        </span>
      </div>
    </div>
  );
}
