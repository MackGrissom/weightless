import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch active job slugs
  const { data: jobs } = await supabase
    .from("jobs")
    .select("slug, updated_at")
    .eq("is_active", true)
    .order("date_posted", { ascending: false })
    .limit(5000);

  // Fetch company slugs
  const { data: companies } = await supabase
    .from("companies")
    .select("slug, updated_at")
    .limit(1000);

  // Fetch categories for category landing pages
  const { data: categories } = await supabase
    .from("categories")
    .select("slug")
    .gt("job_count", 0);

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/jobs`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteUrl}/companies`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/post-job`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
    url: `${siteUrl}/jobs?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  const jobPages: MetadataRoute.Sitemap = (jobs || []).map((job) => ({
    url: `${siteUrl}/jobs/${job.slug}`,
    lastModified: new Date(job.updated_at),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const companyPages: MetadataRoute.Sitemap = (companies || []).map((company) => ({
    url: `${siteUrl}/companies/${company.slug}`,
    lastModified: new Date(company.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...jobPages, ...companyPages];
}
