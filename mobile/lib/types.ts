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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  company_id: string;
  description: string;
  category_id: string | null;
  job_type: string;
  experience_level: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  location_requirements: string | null;
  timezone_min: number | null;
  timezone_max: number | null;
  is_async_friendly: boolean;
  visa_sponsorship: boolean;
  tech_stack: string[];
  apply_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  date_posted: string;
  posted_by: string | null;
  company: Company;
  category: Category | null;
}

export type UserRole = "seeker" | "employer";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  headline: string | null;
  location: string | null;
  bio: string | null;
  skills: string[];
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  avatar_url: string | null;
  user_role: UserRole;
  company_name: string | null;
  company_website: string | null;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus =
  | "submitted"
  | "viewed"
  | "shortlisted"
  | "rejected"
  | "withdrawn";

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
  job?: Job;
  profile?: Profile;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
  job?: Job;
}
