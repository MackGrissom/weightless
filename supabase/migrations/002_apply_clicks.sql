-- Apply click tracking for monetization analytics
CREATE TABLE IF NOT EXISTS apply_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  email text,
  clicked_at timestamptz DEFAULT now(),
  user_agent text,
  referrer text
);

CREATE INDEX idx_apply_clicks_job_id ON apply_clicks(job_id);
CREATE INDEX idx_apply_clicks_email ON apply_clicks(email);

ALTER TABLE apply_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on apply_clicks"
  ON apply_clicks FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow service role full access on apply_clicks"
  ON apply_clicks FOR ALL TO service_role USING (true);
