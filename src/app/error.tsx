"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-6xl font-bold text-accent">500</p>
      <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground max-w-md">
        We hit an unexpected error. This has been logged and we&apos;re looking into it.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try Again</Button>
        <a href="/jobs">
          <Button variant="outline">Browse Jobs</Button>
        </a>
      </div>
    </div>
  );
}
