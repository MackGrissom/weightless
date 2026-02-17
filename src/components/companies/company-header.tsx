import {
  Globe,
  Users,
  Star,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { CompanyLogo } from "@/components/shared/company-logo";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/shared/tag";
import type { Company } from "@/types/database";

interface CompanyHeaderProps {
  company: Company;
  jobCount: number;
}

export function CompanyHeader({ company, jobCount }: CompanyHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <CompanyLogo
          src={company.logo_url}
          alt={company.name}
          size={80}
          className="rounded-xl"
        />
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{company.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {company.headquarters && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {company.headquarters}
              </span>
            )}
            {company.size && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {company.size}
              </span>
            )}
            {company.remote_policy && (
              <span className="inline-flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                {company.remote_policy}
              </span>
            )}
            {company.glassdoor_rating && (
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 text-yellow-400" />
                {company.glassdoor_rating} / 5.0
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="accent">{jobCount} open positions</Badge>
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Website
          </a>
        )}
      </div>

      {company.description && (
        <p className="text-muted-foreground">{company.description}</p>
      )}

      {company.tech_stack.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {company.tech_stack.map((tech) => (
              <Tag key={tech} className="text-sm px-3 py-1">
                {tech}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
