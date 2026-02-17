import { Hero } from "@/components/landing/hero";
import { FeaturedJobs } from "@/components/landing/featured-jobs";
import { CategoriesGrid } from "@/components/landing/categories-grid";
import { ValueProps } from "@/components/landing/value-props";
import { StatsBar } from "@/components/landing/stats-bar";
import { NewsletterSignup } from "@/components/landing/newsletter-signup";
import { getFeaturedJobs, getCategories, getStats } from "@/lib/supabase/queries";

export const revalidate = 3600; // ISR: 1 hour

export default async function HomePage() {
  const [featuredJobs, categories, stats] = await Promise.all([
    getFeaturedJobs(6),
    getCategories(),
    getStats(),
  ]);

  return (
    <>
      <Hero />
      <StatsBar
        jobCount={stats.jobCount}
        companyCount={stats.companyCount}
        categoryCount={stats.categoryCount}
      />
      <FeaturedJobs jobs={featuredJobs} />
      <CategoriesGrid categories={categories} />
      <ValueProps />
      <NewsletterSignup />
    </>
  );
}
