"""
Weekly data aggregation pipeline.
Computes salary benchmarks and market snapshots from active job listings.
Run: python scripts/aggregate.py
Cron: Every Sunday at midnight UTC via GitHub Actions.
"""

import os
import re
import statistics
from datetime import date
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(".env.local")

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Normalized role titles mapped from common title patterns
ROLE_NORMALIZATIONS = {
    "software engineer": [r"software engineer", r"software developer", r"swe\b"],
    "frontend engineer": [r"frontend", r"front-end", r"front end", r"react developer", r"react engineer"],
    "backend engineer": [r"backend", r"back-end", r"back end"],
    "full stack engineer": [r"full.?stack", r"fullstack"],
    "devops engineer": [r"devops", r"dev ops", r"site reliability", r"sre\b", r"platform engineer"],
    "data scientist": [r"data scientist"],
    "data engineer": [r"data engineer"],
    "data analyst": [r"data analyst", r"business analyst", r"bi analyst"],
    "machine learning engineer": [r"machine learning", r"ml engineer", r"ai engineer"],
    "product manager": [r"product manager", r"product owner"],
    "product designer": [r"product designer"],
    "ux designer": [r"ux designer", r"ux researcher", r"user experience"],
    "ui designer": [r"ui designer", r"visual designer"],
    "marketing manager": [r"marketing manager", r"growth manager", r"head of marketing"],
    "content writer": [r"content writer", r"copywriter", r"technical writer"],
    "customer success": [r"customer success", r"customer support", r"account manager"],
    "engineering manager": [r"engineering manager", r"eng manager", r"tech lead"],
    "cloud engineer": [r"cloud engineer", r"aws engineer", r"gcp engineer", r"azure engineer"],
    "qa engineer": [r"qa engineer", r"quality assurance", r"test engineer", r"sdet"],
    "security engineer": [r"security engineer", r"infosec", r"cybersecurity"],
}

TOP_TECH_SKILLS = [
    "React", "Python", "TypeScript", "JavaScript", "Node.js", "AWS", "Docker",
    "Kubernetes", "Go", "Rust", "Java", "PostgreSQL", "MongoDB", "GraphQL",
    "Next.js", "Vue", "Angular", "Django", "Ruby", "Terraform", "GCP", "Azure",
    "TensorFlow", "PyTorch", "Figma", "Tailwind CSS",
]


def normalize_title(title: str) -> str | None:
    """Map a job title to a normalized role name."""
    title_lower = title.lower()
    for normalized, patterns in ROLE_NORMALIZATIONS.items():
        for pattern in patterns:
            if re.search(pattern, title_lower):
                return normalized
    return None


def percentile(values: list[int], p: int) -> int:
    """Calculate percentile from a sorted list."""
    if not values:
        return 0
    sorted_vals = sorted(values)
    k = (len(sorted_vals) - 1) * p / 100
    f = int(k)
    c = f + 1
    if c >= len(sorted_vals):
        return sorted_vals[f]
    return int(sorted_vals[f] + (k - f) * (sorted_vals[c] - sorted_vals[f]))


def compute_salary_benchmarks():
    """Aggregate salary data by normalized role title and experience level."""
    print("Computing salary benchmarks...")

    # Fetch all active jobs with salary data
    result = supabase.table("jobs").select(
        "title, experience_level, salary_min, salary_max, company_id, tech_stack"
    ).eq("is_active", True).not_.is_("salary_min", "null").not_.is_("salary_max", "null").execute()

    if not result.data:
        print("  No jobs with salary data found")
        return

    # Group by normalized title + experience level
    groups: dict[tuple[str, str], list[dict]] = {}
    for job in result.data:
        normalized = normalize_title(job["title"])
        if not normalized:
            continue
        exp = job.get("experience_level") or "mid"
        key = (normalized, exp)
        if key not in groups:
            groups[key] = []
        groups[key].append(job)

    # Get category mapping for each normalized title
    title_to_category = {}
    categories_result = supabase.table("categories").select("id, slug").execute()
    cat_map = {c["id"]: c["slug"] for c in categories_result.data}

    # Clear old benchmarks
    supabase.table("salary_benchmarks").delete().gte("id", "00000000-0000-0000-0000-000000000000").execute()

    benchmarks = []
    for (title, exp), jobs in groups.items():
        if len(jobs) < 3:
            continue  # Need at least 3 data points

        # Calculate midpoint salaries
        midpoints = [int((j["salary_min"] + j["salary_max"]) / 2) for j in jobs]

        # Get top companies
        company_ids = [j["company_id"] for j in jobs if j.get("company_id")]
        company_freq: dict[str, int] = {}
        for cid in company_ids:
            company_freq[cid] = company_freq.get(cid, 0) + 1
        top_company_ids = sorted(company_freq, key=company_freq.get, reverse=True)[:5]

        top_companies = []
        if top_company_ids:
            comp_result = supabase.table("companies").select("name").in_("id", top_company_ids).execute()
            top_companies = [c["name"] for c in comp_result.data]

        # Get top tech
        all_tech: dict[str, int] = {}
        for j in jobs:
            for t in (j.get("tech_stack") or []):
                all_tech[t] = all_tech.get(t, 0) + 1
        top_tech = sorted(all_tech, key=all_tech.get, reverse=True)[:5]

        # Determine category
        role_category = "engineering"
        cat_keywords = {
            "data": ["data", "machine learning", "ml", "ai"],
            "design": ["designer", "ux", "ui"],
            "product": ["product manager", "product owner"],
            "marketing": ["marketing"],
            "writing": ["writer", "content"],
            "support": ["customer"],
        }
        for cat, kws in cat_keywords.items():
            if any(kw in title for kw in kws):
                role_category = cat
                break

        benchmarks.append({
            "role_category": role_category,
            "normalized_title": title,
            "experience_level": exp,
            "sample_size": len(jobs),
            "p25_salary": percentile(midpoints, 25),
            "p50_salary": percentile(midpoints, 50),
            "p75_salary": percentile(midpoints, 75),
            "avg_salary": int(statistics.mean(midpoints)),
            "min_salary": min(midpoints),
            "max_salary": max(midpoints),
            "top_companies": top_companies,
            "top_tech": top_tech,
        })

    if benchmarks:
        supabase.table("salary_benchmarks").insert(benchmarks).execute()
        print(f"  Inserted {len(benchmarks)} salary benchmarks")
    else:
        print("  No benchmarks to insert (not enough data)")


def compute_market_snapshots():
    """Create weekly snapshots of job market data."""
    print("Computing market snapshots...")
    today = date.today().isoformat()

    # Check if snapshot already exists for today
    existing = supabase.table("market_snapshots").select("id").eq("snapshot_date", today).limit(1).execute()
    if existing.data:
        print(f"  Snapshot for {today} already exists, skipping")
        return

    snapshots = []

    # By category
    categories = supabase.table("categories").select("slug").execute()
    for cat in categories.data:
        slug = cat["slug"]
        jobs = supabase.table("jobs").select(
            "salary_min, salary_max"
        ).eq("is_active", True).eq(
            "category_id",
            supabase.table("categories").select("id").eq("slug", slug).execute().data[0]["id"]
        ).execute()

        salaries = [
            int((j["salary_min"] + j["salary_max"]) / 2)
            for j in jobs.data
            if j.get("salary_min") and j.get("salary_max")
        ]

        snapshots.append({
            "snapshot_date": today,
            "category_slug": slug,
            "tech_skill": None,
            "experience_level": None,
            "job_count": len(jobs.data),
            "avg_salary_min": int(statistics.mean([j["salary_min"] for j in jobs.data if j.get("salary_min")])) if any(j.get("salary_min") for j in jobs.data) else None,
            "avg_salary_max": int(statistics.mean([j["salary_max"] for j in jobs.data if j.get("salary_max")])) if any(j.get("salary_max") for j in jobs.data) else None,
            "median_salary": int(statistics.median(salaries)) if salaries else None,
        })

    # By top tech skills
    for tech in TOP_TECH_SKILLS:
        jobs = supabase.table("jobs").select(
            "salary_min, salary_max"
        ).eq("is_active", True).contains("tech_stack", [tech]).execute()

        salaries = [
            int((j["salary_min"] + j["salary_max"]) / 2)
            for j in jobs.data
            if j.get("salary_min") and j.get("salary_max")
        ]

        if len(jobs.data) >= 3:
            snapshots.append({
                "snapshot_date": today,
                "category_slug": None,
                "tech_skill": tech,
                "experience_level": None,
                "job_count": len(jobs.data),
                "avg_salary_min": int(statistics.mean([j["salary_min"] for j in jobs.data if j.get("salary_min")])) if any(j.get("salary_min") for j in jobs.data) else None,
                "avg_salary_max": int(statistics.mean([j["salary_max"] for j in jobs.data if j.get("salary_max")])) if any(j.get("salary_max") for j in jobs.data) else None,
                "median_salary": int(statistics.median(salaries)) if salaries else None,
            })

    # By experience level
    for exp in ["junior", "mid", "senior", "lead", "executive"]:
        jobs = supabase.table("jobs").select(
            "salary_min, salary_max"
        ).eq("is_active", True).eq("experience_level", exp).execute()

        salaries = [
            int((j["salary_min"] + j["salary_max"]) / 2)
            for j in jobs.data
            if j.get("salary_min") and j.get("salary_max")
        ]

        snapshots.append({
            "snapshot_date": today,
            "category_slug": None,
            "tech_skill": None,
            "experience_level": exp,
            "job_count": len(jobs.data),
            "avg_salary_min": int(statistics.mean([j["salary_min"] for j in jobs.data if j.get("salary_min")])) if any(j.get("salary_min") for j in jobs.data) else None,
            "avg_salary_max": int(statistics.mean([j["salary_max"] for j in jobs.data if j.get("salary_max")])) if any(j.get("salary_max") for j in jobs.data) else None,
            "median_salary": int(statistics.median(salaries)) if salaries else None,
        })

    if snapshots:
        supabase.table("market_snapshots").insert(snapshots).execute()
        print(f"  Inserted {len(snapshots)} snapshots for {today}")


if __name__ == "__main__":
    compute_salary_benchmarks()
    compute_market_snapshots()
    print("Aggregation complete!")
