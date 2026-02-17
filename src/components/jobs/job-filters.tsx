"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/database";

interface JobFiltersProps {
  categories: Category[];
}

export function JobFilters({ categories }: JobFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    const q = searchParams.get("q");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [router, pathname, searchParams]);

  const hasFilters =
    searchParams.has("category") ||
    searchParams.has("job_type") ||
    searchParams.has("experience") ||
    searchParams.has("visa") ||
    searchParams.has("async_friendly");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            <ArrowUpDown className="h-3 w-3 inline mr-1" />
            Sort By
          </label>
          <Select
            value={searchParams.get("sort") ?? ""}
            onChange={(e) => updateFilter("sort", e.target.value)}
          >
            <option value="">Newest First</option>
            <option value="salary_desc">Salary: High to Low</option>
            <option value="salary_asc">Salary: Low to High</option>
          </Select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Category
          </label>
          <Select
            value={searchParams.get("category") ?? ""}
            onChange={(e) => updateFilter("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name} ({cat.job_count})
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Job Type
          </label>
          <Select
            value={searchParams.get("job_type") ?? ""}
            onChange={(e) => updateFilter("job_type", e.target.value)}
          >
            <option value="">All Types</option>
            <option value="full_time">Full-Time</option>
            <option value="part_time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Internship</option>
          </Select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Experience
          </label>
          <Select
            value={searchParams.get("experience") ?? ""}
            onChange={(e) => updateFilter("experience", e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-Level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="executive">Executive</option>
          </Select>
        </div>

        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={searchParams.get("visa") === "true"}
              onChange={(e) =>
                updateFilter("visa", e.target.checked ? "true" : "")
              }
              className="rounded border-border bg-input accent-accent"
            />
            Visa Sponsorship
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={searchParams.get("async_friendly") === "true"}
              onChange={(e) =>
                updateFilter("async_friendly", e.target.checked ? "true" : "")
              }
              className="rounded border-border bg-input accent-accent"
            />
            Async-Friendly
          </label>
        </div>
      </div>

      {isPending && (
        <div className="flex justify-center pt-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      )}
    </div>
  );
}
