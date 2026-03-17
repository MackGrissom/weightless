"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { JobFilters } from "./job-filters";
import type { Category } from "@/types/database";

interface MobileFiltersProps {
  categories: Category[];
}

export function MobileFilters({ categories }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-accent/30 active:bg-muted transition-colors w-full justify-center"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters & Sort
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border bg-background p-6 pb-8 animate-slide-in safe-area-bottom">
            {/* Drag handle */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <JobFilters categories={categories} />

            <div className="mt-6 pt-4 border-t border-border">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-xl bg-accent px-4 py-3.5 text-base font-semibold text-accent-foreground active:bg-accent/90 transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
