"use client";

import { useState, useMemo } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CompanyCard } from "./company-card";
import type { Company } from "@/types/database";

interface CompanyWithMeta extends Company {
  _hasLogo: boolean;
  _hasRating: boolean;
}

interface CompanySearchProps {
  companies: CompanyWithMeta[];
}

type SortOption = "name" | "rating" | "tech";

export function CompanySearch({ companies }: CompanySearchProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("name");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let result = companies;

    if (q) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tech_stack.some((t) => t.toLowerCase().includes(q)) ||
          (c.headquarters && c.headquarters.toLowerCase().includes(q)) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sort === "rating") {
      result = [...result].sort(
        (a, b) => (b.glassdoor_rating ?? 0) - (a.glassdoor_rating ?? 0)
      );
    } else if (sort === "tech") {
      result = [...result].sort(
        (a, b) => b.tech_stack.length - a.tech_stack.length
      );
    }
    // "name" is default from server

    return result;
  }, [companies, query, sort]);

  return (
    <div>
      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search companies, tech stacks, locations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 pl-10 text-base"
          />
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-12 rounded-lg border border-border bg-input px-3 text-sm text-foreground"
          >
            <option value="name">A → Z</option>
            <option value="rating">Highest Rated</option>
            <option value="tech">Most Tech</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length === companies.length
          ? `${companies.length} companies`
          : `${filtered.length} of ${companies.length} companies`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            No companies match &ldquo;{query}&rdquo;. Try a different search.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
