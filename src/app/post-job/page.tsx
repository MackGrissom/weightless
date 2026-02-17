import type { Metadata } from "next";
import { PostJobForm } from "./post-job-form";

export const metadata: Metadata = {
  title: "Post a Remote Job — Hire Digital Nomads",
  description:
    "Post your remote job listing on Weightless and reach thousands of digital nomads and remote workers. Standard listings from $99. Featured listings from $299.",
  openGraph: {
    title: "Post a Remote Job — Hire Digital Nomads | Weightless",
    description:
      "Reach thousands of skilled remote workers actively looking for their next opportunity. Post your job in minutes.",
    siteName: "Weightless",
  },
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
