"use client";

import { type ReactNode } from "react";
import { DataGate } from "@/components/shared/data-gate";

interface SalariesContentProps {
  /** First category section (always visible) */
  freeSection: ReactNode;
  /** Remaining category sections + COL comparison + CTA (gated) */
  gatedSection: ReactNode;
}

export function SalariesContent({ freeSection, gatedSection }: SalariesContentProps) {
  return (
    <DataGate
      preview={freeSection}
      headline="Unlock all salary data"
      subheadline="Enter your email to see salary benchmarks across all categories, cost-of-living comparisons, and more — free."
    >
      {gatedSection}
    </DataGate>
  );
}
