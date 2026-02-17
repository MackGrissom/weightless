import { Tag } from "@/components/shared/tag";
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
        <div
          className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-accent"
          dangerouslySetInnerHTML={{ __html: job.description }}
        />
      </div>
    </div>
  );
}
