export type JobType = "full_time" | "part_time" | "contract" | "freelance" | "internship";
export type ExperienceLevel = "junior" | "mid" | "senior" | "lead" | "executive";
export type JobSource = "indeed" | "linkedin" | "glassdoor" | "ziprecruiter" | "google" | "manual";

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  size: string | null;
  remote_policy: string | null;
  headquarters: string | null;
  tech_stack: string[];
  glassdoor_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  job_count: number;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  company_id: string;
  description: string;
  description_plain: string | null;
  category_id: string | null;
  job_type: JobType;
  experience_level: ExperienceLevel | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  location_requirements: string | null;
  timezone_min: number | null;
  timezone_max: number | null;
  is_async_friendly: boolean;
  visa_sponsorship: boolean;
  tech_stack: string[];
  source: JobSource;
  source_url: string | null;
  apply_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  date_posted: string;
  created_at: string;
  updated_at: string;
}

export interface JobWithCompany extends Job {
  company: Company;
  category: Category | null;
}

export interface CostOfLiving {
  id: string;
  country: string;
  country_code: string;
  city: string;
  col_index: number;
  avg_monthly_cost_usd: number;
  nomad_score: number | null;
  internet_speed_mbps: number | null;
  safety_index: number | null;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface JobTag {
  job_id: string;
  tag_id: string;
}

export interface JobAlert {
  id: string;
  email: string;
  category_slug: string | null;
  keywords: string | null;
  frequency: 'daily' | 'weekly';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Search params for the jobs page
export interface JobSearchParams {
  q?: string;
  category?: string;
  job_type?: JobType;
  experience?: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  timezone_min?: number;
  timezone_max?: number;
  visa?: boolean;
  async_friendly?: boolean;
  tech?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}

// Response from the search_jobs RPC
export interface SearchJobsResult {
  jobs: JobWithCompany[];
  total_count: number;
}

// Data products
export interface SalaryBenchmark {
  id: string;
  role_category: string;
  normalized_title: string;
  experience_level: string | null;
  sample_size: number;
  p25_salary: number | null;
  p50_salary: number | null;
  p75_salary: number | null;
  avg_salary: number | null;
  min_salary: number | null;
  max_salary: number | null;
  top_companies: string[];
  top_tech: string[];
  updated_at: string;
}

export interface MarketSnapshot {
  id: string;
  snapshot_date: string;
  category_slug: string | null;
  tech_skill: string | null;
  experience_level: string | null;
  job_count: number;
  avg_salary_min: number | null;
  avg_salary_max: number | null;
  median_salary: number | null;
  created_at: string;
}
