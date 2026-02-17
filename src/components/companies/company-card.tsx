import Image from "next/image";
import Link from "next/link";
import { Building2, Globe, Users, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/shared/tag";
import type { Company } from "@/types/database";

interface CompanyCardProps {
  company: Company;
  jobCount?: number;
}

export function CompanyCard({ company, jobCount }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.slug}`} className="block group">
      <Card className="p-6 h-full transition-colors hover:border-accent/30">
        <div className="flex items-start gap-3">
          {company.logo_url ? (
            <Image
              src={company.logo_url}
              alt={company.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover bg-muted"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold group-hover:text-accent transition-colors truncate">
              {company.name}
            </h3>
            {company.headquarters && (
              <p className="text-sm text-muted-foreground truncate">
                {company.headquarters}
              </p>
            )}
          </div>
        </div>

        {company.description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
            {company.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {company.size && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {company.size}
            </span>
          )}
          {company.remote_policy && (
            <span className="inline-flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              {company.remote_policy}
            </span>
          )}
          {company.glassdoor_rating && (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-400" />
              {company.glassdoor_rating}
            </span>
          )}
          {jobCount !== undefined && (
            <span className="text-accent font-medium">
              {jobCount} open position{jobCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {company.tech_stack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {company.tech_stack.slice(0, 4).map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
            {company.tech_stack.length > 4 && (
              <Tag>+{company.tech_stack.length - 4}</Tag>
            )}
          </div>
        )}
      </Card>
    </Link>
  );
}
