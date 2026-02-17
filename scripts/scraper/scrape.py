"""
Weightless Job Scraper
Scrapes remote jobs from major job boards via JobSpy, transforms and loads into Supabase.
Run: python scripts/scraper/scrape.py
"""

import os
import re
import hashlib
from datetime import datetime, timedelta
from dotenv import load_dotenv
from jobspy import scrape_jobs
from supabase import create_client, Client

load_dotenv(".env.local")

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Search queries targeting remote/nomad jobs
SEARCH_QUERIES = [
    "remote software engineer",
    "remote developer",
    "remote frontend engineer",
    "remote backend engineer",
    "remote full stack developer",
    "remote devops engineer",
    "remote data scientist",
    "remote data analyst",
    "remote product manager",
    "remote product designer",
    "remote UX designer",
    "remote marketing manager",
    "remote content writer",
    "remote customer success",
    "remote technical writer",
    "work from anywhere developer",
    "work from anywhere engineer",
    "digital nomad friendly",
    "remote machine learning engineer",
    "remote cloud engineer",
]

TECH_KEYWORDS = [
    "React", "Next.js", "Vue", "Angular", "Svelte",
    "Node.js", "Express", "Django", "Flask", "FastAPI",
    "Python", "JavaScript", "TypeScript", "Go", "Rust", "Java", "C#", "Ruby",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
    "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform",
    "GraphQL", "REST", "gRPC",
    "TensorFlow", "PyTorch", "Pandas", "Spark",
    "Figma", "Sketch", "Adobe XD",
    "Git", "CI/CD", "Jenkins", "GitHub Actions",
    "Tailwind CSS", "SASS", "CSS",
    "Linux", "Nginx", "Apache",
    "Kafka", "RabbitMQ", "Celery",
    "Snowflake", "BigQuery", "Redshift",
]

CATEGORY_MAP = {
    "engineering": ["engineer", "developer", "devops", "sre", "architect", "programmer", "cto", "sysadmin", "qa "],
    "design": ["designer", "ux ", "ui ", "creative director", "illustrator", "design lead", "art director"],
    "marketing": ["marketing", " seo", "growth", "social media", "brand manager", "demand gen", "paid media"],
    "product": ["product manager", "product owner", "product lead", "product director", "program manager"],
    "support": ["customer support", "customer success", "account manager", "customer service", "helpdesk", "help desk"],
    "writing": ["writer", "copywriter", "technical writer", "content strategist", "content manager", "editor"],
    "data": ["data engineer", "data scientist", "data analyst", "machine learning", "ml engineer", "ai engineer", "analytics engineer", "bi analyst", "business intelligence"],
    "education": ["teacher", "tutor", "instructor", "professor", "curriculum", "teaching", "academic"],
}

EXPERIENCE_MAP = {
    "junior": ["junior", "entry level", "associate", "intern", "jr", "early career"],
    "mid": ["mid", "intermediate"],
    "senior": ["senior", "sr", "staff", "principal"],
    "lead": ["lead", "manager", "head of", "director", "vp"],
    "executive": ["cto", "ceo", "cfo", "coo", "c-level", "executive", "chief"],
}


def safe_str(val, default="") -> str:
    """Safely convert a value to string, handling NaN/None."""
    if val is None:
        return default
    s = str(val)
    if s in ("nan", "None", "NaT", ""):
        return default
    return s.strip()


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"^-+|-+$", "", text)
    return text


def extract_tech_stack(text: str) -> list[str]:
    if not text:
        return []
    found = []
    text_lower = text.lower()
    for tech in TECH_KEYWORDS:
        if tech.lower() in text_lower:
            found.append(tech)
    return found[:10]


def classify_category(title: str) -> str:
    title_lower = title.lower()
    # Priority order matters — check more specific categories first
    priority_order = ["data", "product", "education", "writing", "support", "design", "marketing", "engineering"]
    for category in priority_order:
        keywords = CATEGORY_MAP[category]
        for keyword in keywords:
            if keyword in title_lower:
                return category
    return "engineering"


def classify_experience(title: str, description: str = "") -> str:
    combined = f"{title} {description[:500]}".lower()
    for level, keywords in EXPERIENCE_MAP.items():
        for keyword in keywords:
            if keyword in combined:
                return level
    return "mid"


def normalize_salary(min_val, max_val, interval) -> tuple[int | None, int | None]:
    """Normalize salary to annual USD."""
    try:
        min_f = float(min_val) if min_val and safe_str(min_val) else None
        max_f = float(max_val) if max_val and safe_str(max_val) else None
    except (ValueError, TypeError):
        return None, None

    if min_f is None and max_f is None:
        return None, None

    multiplier = 1
    interval_str = safe_str(interval).lower()
    if "hour" in interval_str:
        multiplier = 2080
    elif "month" in interval_str:
        multiplier = 12

    sal_min = int(min_f * multiplier) if min_f else None
    sal_max = int(max_f * multiplier) if max_f else None

    # Sanity check: skip if < $10k or > $1M annual
    if sal_min and (sal_min < 10000 or sal_min > 1000000):
        sal_min = None
    if sal_max and (sal_max < 10000 or sal_max > 1000000):
        sal_max = None

    return sal_min, sal_max


def detect_visa_sponsorship(text: str) -> bool:
    if not text:
        return False
    keywords = ["visa sponsor", "visa sponsorship", "work permit", "relocation"]
    return any(k in text.lower() for k in keywords)


def detect_async_friendly(text: str) -> bool:
    if not text:
        return False
    keywords = ["async", "asynchronous", "flexible hours", "flexible schedule", "any timezone"]
    return any(k in text.lower() for k in keywords)


def generate_source_id(source: str, job_id: str, title: str, company: str) -> str:
    """Generate a unique source ID for deduplication."""
    if job_id and safe_str(job_id):
        return safe_str(job_id)[:64]
    raw = f"{source}:{title}:{company}".lower()
    return hashlib.md5(raw.encode()).hexdigest()[:16]


def get_or_create_company(name: str, logo_url: str = "", website: str = "", description: str = "", size: str = "") -> str:
    """Get existing company or create new one, return company ID."""
    slug = slugify(name)
    if not slug:
        slug = "unknown"

    result = supabase.table("companies").select("id").eq("slug", slug).execute()
    if result.data:
        # Update with new info if available
        updates = {}
        if logo_url:
            updates["logo_url"] = logo_url
        if website:
            updates["website"] = website
        if description:
            updates["description"] = description[:1000]
        if size:
            updates["size"] = size
        if updates:
            supabase.table("companies").update(updates).eq("id", result.data[0]["id"]).execute()
        return result.data[0]["id"]

    result = supabase.table("companies").insert({
        "name": name,
        "slug": slug,
        "logo_url": logo_url or None,
        "website": website or None,
        "description": (description[:1000]) if description else None,
        "size": size or None,
        "remote_policy": "Remote",
    }).execute()
    return result.data[0]["id"]


def get_category_id(slug: str) -> str | None:
    result = supabase.table("categories").select("id").eq("slug", slug).execute()
    return result.data[0]["id"] if result.data else None


def scrape_and_load():
    """Main scraping pipeline."""
    print(f"Starting scrape at {datetime.now().isoformat()}")
    total_new = 0
    total_skipped = 0
    total_errors = 0

    for query in SEARCH_QUERIES:
        print(f"\nSearching: '{query}'")
        try:
            jobs_df = scrape_jobs(
                site_name=["indeed", "linkedin", "glassdoor", "zip_recruiter"],
                search_term=query,
                location="remote",
                results_wanted=50,
                hours_old=168,  # 7 days
                is_remote=True,
                country_indeed="USA",
            )

            if jobs_df is None or jobs_df.empty:
                print(f"  No results for '{query}'")
                continue

            print(f"  Found {len(jobs_df)} results")

            for _, row in jobs_df.iterrows():
                try:
                    title = safe_str(row.get("title"))
                    company_name = safe_str(row.get("company"), "Unknown")

                    if not title or company_name == "Unknown":
                        continue

                    source = safe_str(row.get("site"), "manual").lower()
                    if source == "zip_recruiter":
                        source = "ziprecruiter"
                    job_id_raw = safe_str(row.get("id"))
                    source_id = generate_source_id(source, job_id_raw, title, company_name)

                    # Check for duplicates
                    valid_sources = ["indeed", "linkedin", "glassdoor", "ziprecruiter"]
                    db_source = source if source in valid_sources else "manual"
                    existing = (
                        supabase.table("jobs")
                        .select("id")
                        .eq("source", db_source)
                        .eq("source_id", source_id)
                        .execute()
                    )
                    if existing.data:
                        total_skipped += 1
                        continue

                    # Also check slug uniqueness
                    slug = slugify(f"{title}-{company_name}")[:80]
                    slug_exists = supabase.table("jobs").select("id").eq("slug", slug).execute()
                    if slug_exists.data:
                        slug = f"{slug}-{source_id[:6]}"

                    description = safe_str(row.get("description"))
                    description_plain = re.sub(r"<[^>]+>", "", description).strip() if description else ""

                    salary_min, salary_max = normalize_salary(
                        row.get("min_amount"),
                        row.get("max_amount"),
                        row.get("interval"),
                    )

                    # Company info
                    logo_url = safe_str(row.get("company_logo"))
                    company_url = safe_str(row.get("company_url"))
                    company_desc = safe_str(row.get("company_description"))
                    company_size = safe_str(row.get("company_num_employees"))
                    company_id = get_or_create_company(company_name, logo_url, company_url, company_desc, company_size)

                    category_slug = classify_category(title)
                    category_id = get_category_id(category_slug)

                    # Parse date
                    date_posted = datetime.now().isoformat()
                    try:
                        dp = row.get("date_posted")
                        if dp is not None and safe_str(dp):
                            date_posted = dp.isoformat() if hasattr(dp, 'isoformat') else str(dp)
                    except Exception:
                        pass

                    job_url = safe_str(row.get("job_url_direct")) or safe_str(row.get("job_url"))

                    job_data = {
                        "title": title,
                        "slug": slug,
                        "company_id": company_id,
                        "description": description[:50000] if description else title,
                        "description_plain": description_plain[:5000] if description_plain else None,
                        "category_id": category_id,
                        "job_type": "full_time",
                        "experience_level": classify_experience(title, description_plain),
                        "salary_min": salary_min,
                        "salary_max": salary_max,
                        "salary_currency": "USD",
                        "location_requirements": "Remote",
                        "is_async_friendly": detect_async_friendly(description),
                        "visa_sponsorship": detect_visa_sponsorship(description),
                        "tech_stack": extract_tech_stack(description),
                        "source": db_source,
                        "source_id": source_id,
                        "source_url": safe_str(row.get("job_url")) or None,
                        "apply_url": job_url or None,
                        "is_featured": False,
                        "is_active": True,
                        "date_posted": date_posted,
                    }

                    supabase.table("jobs").insert(job_data).execute()
                    total_new += 1

                    if total_new % 25 == 0:
                        print(f"    ... {total_new} new jobs inserted")

                except Exception as e:
                    total_errors += 1
                    if total_errors <= 10:
                        print(f"  Error processing job: {e}")
                    continue

        except Exception as e:
            print(f"  Error scraping '{query}': {e}")
            continue

    # Cleanup: mark old jobs inactive
    cutoff = (datetime.now() - timedelta(days=30)).isoformat()
    supabase.table("jobs").update({"is_active": False}).eq("is_active", True).lt("date_posted", cutoff).execute()

    # Update category counts
    categories = supabase.table("categories").select("id, slug").execute()
    for cat in categories.data:
        count_result = (
            supabase.table("jobs")
            .select("id", count="exact")
            .eq("category_id", cat["id"])
            .eq("is_active", True)
            .execute()
        )
        supabase.table("categories").update({"job_count": count_result.count or 0}).eq("id", cat["id"]).execute()

    print(f"\nScrape complete! New: {total_new}, Skipped (dupes): {total_skipped}, Errors: {total_errors}")


if __name__ == "__main__":
    scrape_and_load()
