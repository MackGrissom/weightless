import { createClient } from "./server";
import type {
  JobWithCompany,
  Category,
  Company,
  CostOfLiving,
  JobSearchParams,
  SearchJobsResult,
} from "@/types/database";

export async function searchJobs(
  params: JobSearchParams
): Promise<SearchJobsResult> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("search_jobs", {
    search_query: params.q || null,
    filter_category: params.category || null,
    filter_job_type: params.job_type || null,
    filter_experience: params.experience || null,
    filter_salary_min: params.salary_min || null,
    filter_salary_max: params.salary_max || null,
    filter_timezone_min: params.timezone_min || null,
    filter_timezone_max: params.timezone_max || null,
    filter_visa: params.visa || null,
    filter_async: params.async_friendly || null,
    filter_tech: params.tech || null,
    page_number: params.page || 1,
    page_size: params.per_page || 20,
  });

  if (error) {
    console.error("searchJobs error:", error);
    return { jobs: [], total_count: 0 };
  }

  return data as SearchJobsResult;
}

export async function getFeaturedJobs(limit = 6): Promise<JobWithCompany[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      company:companies(*),
      category:categories(*)
    `
    )
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("date_posted", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedJobs error:", error);
    return [];
  }

  return data as JobWithCompany[];
}

export async function getJobBySlug(
  slug: string
): Promise<JobWithCompany | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      company:companies(*),
      category:categories(*)
    `
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("getJobBySlug error:", error);
    return null;
  }

  return data as JobWithCompany;
}

export async function getSimilarJobs(
  job: JobWithCompany,
  limit = 4
): Promise<JobWithCompany[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      company:companies(*),
      category:categories(*)
    `
    )
    .eq("is_active", true)
    .neq("id", job.id)
    .eq("category_id", job.category_id)
    .order("date_posted", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getSimilarJobs error:", error);
    return [];
  }

  return data as JobWithCompany[];
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("job_count", { ascending: false });

  if (error) {
    console.error("getCategories error:", error);
    return [];
  }

  return data as Category[];
}

export async function getCompanies(): Promise<Company[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("getCompanies error:", error);
    return [];
  }

  return data as Company[];
}

export async function getCompanyBySlug(
  slug: string
): Promise<Company | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("getCompanyBySlug error:", error);
    return null;
  }

  return data as Company;
}

export async function getCompanyJobs(
  companyId: string
): Promise<JobWithCompany[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      company:companies(*),
      category:categories(*)
    `
    )
    .eq("company_id", companyId)
    .eq("is_active", true)
    .order("date_posted", { ascending: false });

  if (error) {
    console.error("getCompanyJobs error:", error);
    return [];
  }

  return data as JobWithCompany[];
}

export async function getCostOfLiving(limit = 30): Promise<CostOfLiving[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("cost_of_living")
    .select("*")
    .order("col_index", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("getCostOfLiving error:", error);
    return [];
  }

  return data as CostOfLiving[];
}

export async function getStats(): Promise<{
  jobCount: number;
  companyCount: number;
  categoryCount: number;
}> {
  const supabase = createClient();

  const [jobs, companies, categories] = await Promise.all([
    supabase
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("companies").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
  ]);

  return {
    jobCount: jobs.count || 0,
    companyCount: companies.count || 0,
    categoryCount: categories.count || 0,
  };
}
