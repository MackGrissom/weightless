"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Briefcase,
  DollarSign,
  TrendingUp,
  Calculator,
  Building2,
  BookOpen,
  Home,
  PenTool,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/jobs", label: "Jobs", icon: Briefcase, accent: true },
  { href: "/salaries", label: "Salaries", icon: DollarSign },
  { href: "/trends", label: "Trends", icon: TrendingUp },
  { href: "/calculator", label: "Cost of Living", icon: Calculator },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/post-job", label: "Post a Job", icon: PenTool },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-foreground active:scale-90 transition-transform"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 z-40 bg-black/50 backdrop-blur-md animate-sheet-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div className="fixed left-0 right-0 top-16 z-50 bg-background/98 backdrop-blur-2xl border-b border-border animate-slide-in max-h-[calc(100dvh-4rem)] overflow-y-auto safe-area-bottom">
            <nav className="p-3">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-4 text-[15px] font-medium transition-all",
                      isActive
                        ? "text-accent bg-accent/10"
                        : "text-foreground active:bg-muted"
                    )}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      isActive ? "bg-accent/20" : "bg-muted"
                    )}>
                      <link.icon className={cn("h-[18px] w-[18px]", isActive ? "text-accent" : "text-muted-foreground")} />
                    </div>
                    <span className="flex-1">{link.label}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                  </Link>
                );
              })}
            </nav>

            {/* Bottom CTA */}
            <div className="p-3 pt-0">
              <Link
                href="/jobs"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-2xl bg-accent px-4 py-4 text-base font-semibold text-accent-foreground active:bg-accent/90 transition-all"
              >
                Find Remote Jobs
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
