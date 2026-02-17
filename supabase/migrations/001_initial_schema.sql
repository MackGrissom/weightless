-- Weightless: Digital Nomad Job Board — Initial Schema

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enums
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'freelance', 'internship');
CREATE TYPE experience_level AS ENUM ('junior', 'mid', 'senior', 'lead', 'executive');
CREATE TYPE job_source AS ENUM ('indeed', 'linkedin', 'glassdoor', 'ziprecruiter', 'manual');

-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  size TEXT,
  remote_policy TEXT,
  headquarters TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  glassdoor_rating NUMERIC(2,1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_companies_slug ON companies(slug);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  job_count INTEGER DEFAULT 0
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  description_plain TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  job_type job_type NOT NULL DEFAULT 'full_time',
  experience_level experience_level,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  location_requirements TEXT,
  timezone_min INTEGER,
  timezone_max INTEGER,
  is_async_friendly BOOLEAN DEFAULT FALSE,
  visa_sponsorship BOOLEAN DEFAULT FALSE,
  tech_stack TEXT[] DEFAULT '{}',
  source job_source NOT NULL DEFAULT 'manual',
  source_url TEXT,
  source_id TEXT,
  apply_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  date_posted TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Full-text search vector (auto-generated)
  fts TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description_plain, '')), 'B')
  ) STORED,
  -- Deduplication constraint
  CONSTRAINT unique_source_job UNIQUE (source, source_id)
);

CREATE INDEX idx_jobs_slug ON jobs(slug);
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_category ON jobs(category_id);
CREATE INDEX idx_jobs_active ON jobs(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_featured ON jobs(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_jobs_date ON jobs(date_posted DESC);
CREATE INDEX idx_jobs_fts ON jobs USING GIN(fts);
CREATE INDEX idx_jobs_tech_stack ON jobs USING GIN(tech_stack);
CREATE INDEX idx_jobs_type ON jobs(job_type);
CREATE INDEX idx_jobs_experience ON jobs(experience_level);
CREATE INDEX idx_jobs_salary ON jobs(salary_min, salary_max);

-- Cost of Living
CREATE TABLE cost_of_living (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  city TEXT NOT NULL,
  col_index INTEGER NOT NULL, -- NYC = 100
  avg_monthly_cost_usd INTEGER NOT NULL,
  nomad_score NUMERIC(3,1),
  internet_speed_mbps INTEGER,
  safety_index INTEGER,
  CONSTRAINT unique_city_country UNIQUE (city, country_code)
);

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- Job Tags (many-to-many)
CREATE TABLE job_tags (
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, tag_id)
);

CREATE INDEX idx_job_tags_tag ON job_tags(tag_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================
-- search_jobs RPC function
-- =============================================================
CREATE OR REPLACE FUNCTION search_jobs(
  search_query TEXT DEFAULT NULL,
  filter_category TEXT DEFAULT NULL,
  filter_job_type job_type DEFAULT NULL,
  filter_experience experience_level DEFAULT NULL,
  filter_salary_min INTEGER DEFAULT NULL,
  filter_salary_max INTEGER DEFAULT NULL,
  filter_timezone_min INTEGER DEFAULT NULL,
  filter_timezone_max INTEGER DEFAULT NULL,
  filter_visa BOOLEAN DEFAULT NULL,
  filter_async BOOLEAN DEFAULT NULL,
  filter_tech TEXT DEFAULT NULL,
  page_number INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 20
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  total INTEGER;
  offset_val INTEGER;
BEGIN
  offset_val := (page_number - 1) * page_size;

  -- Get total count
  SELECT COUNT(*) INTO total
  FROM jobs j
  LEFT JOIN categories c ON j.category_id = c.id
  WHERE j.is_active = TRUE
    AND (search_query IS NULL OR j.fts @@ websearch_to_tsquery('english', search_query))
    AND (filter_category IS NULL OR c.slug = filter_category)
    AND (filter_job_type IS NULL OR j.job_type = filter_job_type)
    AND (filter_experience IS NULL OR j.experience_level = filter_experience)
    AND (filter_salary_min IS NULL OR j.salary_max >= filter_salary_min)
    AND (filter_salary_max IS NULL OR j.salary_min <= filter_salary_max)
    AND (filter_timezone_min IS NULL OR j.timezone_max >= filter_timezone_min)
    AND (filter_timezone_max IS NULL OR j.timezone_min <= filter_timezone_max)
    AND (filter_visa IS NULL OR j.visa_sponsorship = filter_visa)
    AND (filter_async IS NULL OR j.is_async_friendly = filter_async)
    AND (filter_tech IS NULL OR j.tech_stack @> ARRAY[filter_tech]);

  -- Get paginated results
  SELECT json_build_object(
    'jobs', COALESCE(json_agg(row_to_json(t)), '[]'::json),
    'total_count', total
  ) INTO result
  FROM (
    SELECT
      j.id, j.title, j.slug, j.description, j.description_plain,
      j.job_type, j.experience_level,
      j.salary_min, j.salary_max, j.salary_currency,
      j.location_requirements,
      j.timezone_min, j.timezone_max,
      j.is_async_friendly, j.visa_sponsorship,
      j.tech_stack, j.source, j.source_url, j.apply_url,
      j.is_featured, j.is_active, j.date_posted,
      j.created_at, j.updated_at,
      json_build_object(
        'id', co.id,
        'name', co.name,
        'slug', co.slug,
        'logo_url', co.logo_url,
        'website', co.website,
        'description', co.description,
        'size', co.size,
        'remote_policy', co.remote_policy,
        'headquarters', co.headquarters,
        'tech_stack', co.tech_stack,
        'glassdoor_rating', co.glassdoor_rating
      ) AS company,
      CASE WHEN c.id IS NOT NULL THEN
        json_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'icon', c.icon,
          'job_count', c.job_count
        )
      ELSE NULL END AS category,
      CASE
        WHEN search_query IS NOT NULL THEN ts_rank(j.fts, websearch_to_tsquery('english', search_query))
        ELSE 0
      END AS rank
    FROM jobs j
    JOIN companies co ON j.company_id = co.id
    LEFT JOIN categories c ON j.category_id = c.id
    WHERE j.is_active = TRUE
      AND (search_query IS NULL OR j.fts @@ websearch_to_tsquery('english', search_query))
      AND (filter_category IS NULL OR c.slug = filter_category)
      AND (filter_job_type IS NULL OR j.job_type = filter_job_type)
      AND (filter_experience IS NULL OR j.experience_level = filter_experience)
      AND (filter_salary_min IS NULL OR j.salary_max >= filter_salary_min)
      AND (filter_salary_max IS NULL OR j.salary_min <= filter_salary_max)
      AND (filter_timezone_min IS NULL OR j.timezone_max >= filter_timezone_min)
      AND (filter_timezone_max IS NULL OR j.timezone_min <= filter_timezone_max)
      AND (filter_visa IS NULL OR j.visa_sponsorship = filter_visa)
      AND (filter_async IS NULL OR j.is_async_friendly = filter_async)
      AND (filter_tech IS NULL OR j.tech_stack @> ARRAY[filter_tech])
    ORDER BY
      j.is_featured DESC,
      CASE WHEN search_query IS NOT NULL THEN ts_rank(j.fts, websearch_to_tsquery('english', search_query)) ELSE 0 END DESC,
      j.date_posted DESC
    LIMIT page_size
    OFFSET offset_val
  ) t;

  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================================
-- Row Level Security
-- =============================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_of_living ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_tags ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read active jobs" ON jobs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read cost_of_living" ON cost_of_living FOR SELECT USING (true);
CREATE POLICY "Public read tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Public read job_tags" ON job_tags FOR SELECT USING (true);

-- Newsletter: public insert only
CREATE POLICY "Public insert newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
