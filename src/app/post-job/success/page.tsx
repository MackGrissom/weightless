import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Job Posted Successfully",
};

export default function PostJobSuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-32 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
        <CheckCircle className="h-8 w-8 text-accent" />
      </div>
      <h1 className="text-2xl font-bold">Job Posted Successfully!</h1>
      <p className="mt-3 text-muted-foreground">
        Your listing is now live on Weightless and visible to thousands of
        digital nomads and remote workers. You&apos;ll receive a confirmation
        email shortly.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/jobs">
          <Button>View Job Board</Button>
        </Link>
        <Link href="/post-job">
          <Button variant="outline">Post Another</Button>
        </Link>
      </div>
    </div>
  );
}
