import { Tag } from "@/components/shared/tag";
import { ApplyGate } from "@/components/jobs/apply-gate";
import type { JobWithCompany } from "@/types/database";

interface JobDetailBodyProps {
  job: JobWithCompany;
}

export function JobDetailBody({ job }: JobDetailBodyProps) {
  return (
    <div className="space-y-8">
      {job.tech_stack.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.tech_stack.map((tech) => (
              <Tag key={tech} className="text-sm px-3 py-1">
                {tech}
              </Tag>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Job Description
        </h2>
        {job.description && job.description !== job.title && job.description.trim().length > 20 ? (
          <div
            className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-accent"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        ) : (
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <p className="text-muted-foreground mb-3">
              Full description not available. Apply directly to learn more about this role.
            </p>
            {job.apply_url && (
              <ApplyGate
                jobId={job.id}
                applyUrl={job.apply_url}
                jobTitle={job.title}
                companyName={job.company?.name || "this company"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
