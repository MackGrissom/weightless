-- ============================================
-- Profiles, Applications, Saved Jobs
-- ============================================

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  headline TEXT,
  location TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  avatar_url TEXT,
  user_role TEXT DEFAULT 'seeker' CHECK (user_role IN ('seeker', 'employer')),
  company_name TEXT,
  company_website TEXT,
  is_profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Employers can view applicant profiles (via applications)
CREATE POLICY "Employers can view applicant profiles"
  ON profiles FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON j.id = a.job_id
      WHERE a.user_id = profiles.id
      AND j.posted_by = auth.uid()
    )
  );

-- 2. Saved jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved jobs"
  ON saved_jobs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save jobs"
  ON saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave jobs"
  ON saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- 3. Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'viewed', 'shortlisted', 'rejected', 'withdrawn')),
  cover_letter TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can submit applications"
  ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can withdraw applications"
  ON applications FOR UPDATE USING (auth.uid() = user_id);

-- Employers can view applications for their jobs
CREATE POLICY "Employers can view job applications"
  ON applications FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.posted_by = auth.uid()
    )
  );

-- Employers can update application status
CREATE POLICY "Employers can update application status"
  ON applications FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.posted_by = auth.uid()
    )
  );

-- 4. Add posted_by column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS posted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job ON saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs(posted_by) WHERE posted_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(user_role);

-- 6. Auto-create profile on user signup (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
