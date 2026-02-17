"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/salaries", label: "Salaries" },
  { href: "/trends", label: "Trends" },
  { href: "/calculator", label: "Calculator" },
  { href: "/companies", label: "Companies" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-muted"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 border-b border-border bg-background p-4 animate-slide-in">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-muted",
                  pathname === link.href
                    ? "text-accent bg-accent/5"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/jobs"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-foreground"
            >
              Find Jobs
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
