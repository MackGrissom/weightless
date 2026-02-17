import Link from "next/link";
import { Feather } from "lucide-react";

const footerLinks = {
  "Job Seekers": [
    { href: "/jobs", label: "Browse Jobs" },
    { href: "/salaries", label: "Salary Explorer" },
    { href: "/calculator", label: "Where to Live?" },
    { href: "/trends", label: "Hiring Trends" },
  ],
  Explore: [
    { href: "/companies", label: "Companies" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About Us" },
    { href: "/post-job", label: "Post a Job" },
  ],
  Categories: [
    { href: "/jobs?category=engineering", label: "Engineering" },
    { href: "/jobs?category=design", label: "Design" },
    { href: "/jobs?category=marketing", label: "Marketing" },
    { href: "/jobs?category=data", label: "Data & Analytics" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Feather className="h-5 w-5 text-accent" />
              <span className="font-bold">Weightless</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              The job board built for digital nomads. Find remote work that
              travels with you.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-foreground">
                {category}
              </h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Weightless. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for the location-independent workforce.
          </p>
        </div>
      </div>
    </footer>
  );
}
