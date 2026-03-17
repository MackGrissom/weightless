"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = "/jobs",
}: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function getPageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  }

  const pages: (number | "...")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 sm:gap-2" aria-label="Pagination">
      <Link
        href={getPageUrl(currentPage - 1)}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted active:bg-muted/80 transition-colors",
          currentPage <= 1 && "pointer-events-none opacity-50"
        )}
        aria-disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-1 text-muted-foreground">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-xl text-sm font-medium transition-colors active:bg-muted/80",
              page === currentPage
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={getPageUrl(currentPage + 1)}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted active:bg-muted/80 transition-colors",
          currentPage >= totalPages && "pointer-events-none opacity-50"
        )}
        aria-disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  );
}
