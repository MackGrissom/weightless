import type { Metadata } from "next";
import { PostJobForm } from "./post-job-form";

export const metadata: Metadata = {
  title: "Post a Job",
  description:
    "Reach thousands of digital nomads and remote workers. Post your remote job listing on Weightless.",
};

export default function PostJobPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Hire the Best Remote Talent
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Reach thousands of skilled digital nomads and remote workers
          actively looking for their next opportunity.
        </p>
      </div>

      <PostJobForm />
    </div>
  );
}
