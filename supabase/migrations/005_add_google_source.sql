-- Add 'google' to the job_source enum for Google Jobs scraping
ALTER TYPE job_source ADD VALUE IF NOT EXISTS 'google';
