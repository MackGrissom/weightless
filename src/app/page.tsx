import { Hero } from "@/components/landing/hero";
import { FeaturedJobs } from "@/components/landing/featured-jobs";
import { CategoriesGrid } from "@/components/landing/categories-grid";
import { ValueProps } from "@/components/landing/value-props";
import { StatsBar } from "@/components/landing/stats-bar";
import { TrustStrip } from "@/components/landing/trust-strip";
import { RecentActivity } from "@/components/landing/recent-activity";
import { NewsletterSignup } from "@/components/landing/newsletter-signup";
import {
  WebsiteStructuredData,
  OrganizationStructuredData,
} from "@/components/shared/structured-data";
import {
  getFeaturedJobs,
  getCategories,
  getStats,
  getTopHiringCompanies,
} from "@/lib/supabase/queries";

export const revalidate = 3600; // ISR: 1 hour

export default async function HomePage() {
  const [featuredJobs, categories, stats, topCompanies] = await Promise.all([
    getFeaturedJobs(6),
    getCategories(),
    getStats(),
    getTopHiringCompanies(10),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

  return (
    <>
      <WebsiteStructuredData siteUrl={siteUrl} />
      <OrganizationStructuredData siteUrl={siteUrl} />
      <Hero />
      <StatsBar
        jobCount={stats.jobCount}
        companyCount={stats.companyCount}
        applyCount={stats.applyCount}
        cityCount={stats.cityCount}
      />
      <TrustStrip companies={topCompanies} />
      <RecentActivity
        newJobsThisWeek={stats.newJobsThisWeek}
        topCategories={categories}
      />
      <FeaturedJobs jobs={featuredJobs} />
      <CategoriesGrid categories={categories} />
      <ValueProps />
      <NewsletterSignup />
    </>
  );
}
