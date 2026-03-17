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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/salaries", label: "Salaries", icon: DollarSign },
  { href: "/trends", label: "Trends", icon: TrendingUp },
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/post-job", label: "Post a Job", icon: PenTool },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
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
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-foreground hover:bg-muted active:bg-muted/80 transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu */}
          <div className="fixed left-0 right-0 top-16 z-50 border-b border-border bg-background/95 backdrop-blur-md p-4 animate-slide-in max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors active:bg-muted/80",
                    pathname === link.href
                      ? "text-accent bg-accent/10"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-border">
                <Link
                  href="/jobs"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-accent px-4 py-4 text-base font-semibold text-accent-foreground active:bg-accent/90 transition-colors"
                >
                  Find Remote Jobs
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
