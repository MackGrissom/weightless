import { JobCard } from "./job-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { JobWithCompany } from "@/types/database";

interface JobListProps {
  jobs: JobWithCompany[];
  totalCount: number;
}

export function JobList({ jobs, totalCount }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No jobs found"
        description="Try adjusting your search or filters to find what you're looking for."
      />
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        {totalCount} job{totalCount !== 1 ? "s" : ""} found
      </p>
      <div className="space-y-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
