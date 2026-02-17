import type { Metadata } from "next";
import { CompanyCard } from "@/components/companies/company-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getCompanies } from "@/lib/supabase/queries";

export const revalidate = 3600; // ISR: 1 hour

export const metadata: Metadata = {
  title: "Companies",
  description:
    "Discover companies hiring remote workers and digital nomads worldwide.",
};

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Companies</h1>
        <p className="mt-2 text-muted-foreground">
          Discover companies that hire remote workers and digital nomads.
        </p>
      </div>

      {companies.length === 0 ? (
        <EmptyState
          title="No companies yet"
          description="Companies will appear here once jobs are scraped."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
