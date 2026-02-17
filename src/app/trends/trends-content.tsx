"use client";

import { type ReactNode } from "react";
import { DataGate } from "@/components/shared/data-gate";

interface TrendsContentProps {
  freeSection: ReactNode;
  gatedSection: ReactNode;
}

export function TrendsContent({ freeSection, gatedSection }: TrendsContentProps) {
  return (
    <DataGate
      preview={freeSection}
      headline="Unlock full trends report"
      subheadline="Enter your email to see top tech skills in demand, salary ranges by experience level, and weekly market updates — free."
    >
      {gatedSection}
    </DataGate>
  );
}
