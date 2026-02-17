import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JobCard } from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import type { JobWithCompany } from "@/types/database";

interface FeaturedJobsProps {
  jobs: JobWithCompany[];
}

export function FeaturedJobs({ jobs }: FeaturedJobsProps) {
  if (jobs.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Featured Jobs</h2>
            <p className="mt-2 text-muted-foreground">
              Hand-picked remote opportunities from top companies
            </p>
          </div>
          <Link href="/jobs" className="hidden sm:block">
            <Button variant="ghost" className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/jobs">
            <Button variant="outline" className="gap-1">
              View all jobs <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
