-- Job alerts subscription table
CREATE TABLE job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  category_slug TEXT REFERENCES categories(slug),
  keywords TEXT,
  frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_alerts_email ON job_alerts(email);
CREATE INDEX idx_job_alerts_active ON job_alerts(is_active) WHERE is_active = true;

ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON job_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role full access" ON job_alerts FOR ALL USING (auth.role() = 'service_role');
