import type { Feather } from "@expo/vector-icons";

export const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL || "https://weightless.jobs";

export interface CategoryDef {
  slug: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

export const CATEGORIES: CategoryDef[] = [
  { slug: "engineering", label: "Engineering", icon: "code" },
  { slug: "design", label: "Design", icon: "pen-tool" },
  { slug: "marketing", label: "Marketing", icon: "trending-up" },
  { slug: "product", label: "Product", icon: "box" },
  { slug: "data", label: "Data & AI", icon: "bar-chart-2" },
  { slug: "support", label: "Support", icon: "headphones" },
  { slug: "writing", label: "Writing", icon: "edit-3" },
  { slug: "education", label: "Education", icon: "book-open" },
];

export const JOB_TYPES = [
  { value: "", label: "All Types" },
  { value: "full_time", label: "Full-Time" },
  { value: "contract", label: "Contract" },
  { value: "part_time", label: "Part-Time" },
  { value: "freelance", label: "Freelance" },
] as const;

export const EXP_LEVELS = [
  { value: "", label: "All Levels" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
] as const;

export const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-Time",
  part_time: "Part-Time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
};

export const EXP_LABELS: Record<string, string> = {
  junior: "Junior",
  mid: "Mid-Level",
  senior: "Senior",
  lead: "Lead",
  executive: "Executive",
};

/** Validate a URL is http/https before opening */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Sanitize search query — strip dangerous chars for ilike patterns */
export function sanitizeSearchQuery(q: string): string {
  return q.replace(/[%_\\]/g, "").trim().slice(0, 200);
}
