import type { Metadata } from "next";
import { Building2, Briefcase, Globe } from "lucide-react";
import { CompanySearch } from "@/components/companies/company-search";
import { EmptyState } from "@/components/shared/empty-state";
import { getCompanies, getStats } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Remote Companies Hiring Digital Nomads",
  description:
    "Discover companies hiring remote workers and digital nomads worldwide. Browse company profiles, tech stacks, and open remote positions.",
  openGraph: {
    title: "Remote Companies Hiring Digital Nomads | Weightless",
    description:
      "Discover companies hiring remote workers and digital nomads worldwide.",
    siteName: "Weightless",
  },
};

export default async function CompaniesPage() {
  const [companies, stats] = await Promise.all([getCompanies(), getStats()]);

  // Pre-compute job counts per company for display
  // (company cards don't have this by default)
  const companiesWithMeta = companies.map((c) => ({
    ...c,
    _hasLogo: !!c.logo_url,
    _hasRating: !!c.glassdoor_rating,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Remote <span className="text-accent">Companies</span>
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Discover companies that hire remote workers and digital nomads. Browse
          profiles, tech stacks, ratings, and open positions.
        </p>

        {/* Stats strip */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-accent" />
            <span className="font-semibold text-foreground">{stats.companyCount.toLocaleString()}</span>{" "}
            companies
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-accent" />
            <span className="font-semibold text-foreground">{stats.jobCount.toLocaleString()}</span>{" "}
            open roles
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-accent" />
            <span className="font-semibold text-foreground">{stats.cityCount}</span>{" "}
            cities worldwide
          </span>
        </div>
      </div>

      {companies.length === 0 ? (
        <EmptyState
          title="No companies yet"
          description="Companies will appear here once jobs are scraped."
        />
      ) : (
        <CompanySearch companies={companiesWithMeta} />
      )}
    </div>
  );
}
