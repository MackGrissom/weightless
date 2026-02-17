-- Market snapshot time-series for trend data
CREATE TABLE IF NOT EXISTS market_snapshots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date date NOT NULL,
  category_slug text,
  tech_skill text,
  experience_level text,
  job_count integer DEFAULT 0,
  avg_salary_min integer,
  avg_salary_max integer,
  median_salary integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_snapshots_date ON market_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_snapshots_category ON market_snapshots(category_slug, snapshot_date);
CREATE INDEX IF NOT EXISTS idx_snapshots_tech ON market_snapshots(tech_skill, snapshot_date);

ALTER TABLE market_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read market_snapshots" ON market_snapshots FOR SELECT TO anon USING (true);
CREATE POLICY "Service role full market_snapshots" ON market_snapshots FOR ALL TO service_role USING (true);

-- Salary benchmarks aggregation
CREATE TABLE IF NOT EXISTS salary_benchmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role_category text NOT NULL,
  normalized_title text NOT NULL,
  experience_level text,
  sample_size integer DEFAULT 0,
  p25_salary integer,
  p50_salary integer,
  p75_salary integer,
  avg_salary integer,
  min_salary integer,
  max_salary integer,
  top_companies text[],
  top_tech text[],
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_benchmarks_title ON salary_benchmarks(normalized_title);
CREATE INDEX IF NOT EXISTS idx_benchmarks_category ON salary_benchmarks(role_category);

ALTER TABLE salary_benchmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read salary_benchmarks" ON salary_benchmarks FOR SELECT TO anon USING (true);
CREATE POLICY "Service role full salary_benchmarks" ON salary_benchmarks FOR ALL TO service_role USING (true);

-- Add salary survey fields to apply_clicks
ALTER TABLE apply_clicks ADD COLUMN IF NOT EXISTS salary_range text;
ALTER TABLE apply_clicks ADD COLUMN IF NOT EXISTS user_location text;
