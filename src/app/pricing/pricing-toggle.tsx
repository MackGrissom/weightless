"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PRICE_IDS = {
  monthly: "price_monthly_placeholder",
  annual: "price_annual_placeholder",
} as const;

const freeFeatures = [
  "Browse all remote jobs",
  "Basic salary ranges",
  "5-city COL comparison",
  "Job alerts via email",
  "Apply to unlimited jobs",
];

const proFeatures = [
  "Everything in Free",
  "Full salary explorer (all roles)",
  "All 30+ city comparisons",
  "Hiring trend reports",
  "CSV data export",
  "Priority support",
];

export function PricingToggle() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpgrade() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: PRICE_IDS[billing],
          email: undefined,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            billing === "monthly" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={billing === "annual"}
          onClick={() =>
            setBilling((prev) => (prev === "monthly" ? "annual" : "monthly"))
          }
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            billing === "annual" ? "bg-accent" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
              billing === "annual" ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            billing === "annual" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Annual
        </span>
        {billing === "annual" && (
          <Badge variant="accent" className="ml-1">
            Save 55%
          </Badge>
        )}
      </div>

      {/* Pricing cards */}
      <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
        {/* FREE tier */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Free</CardTitle>
            <CardDescription>
              Everything you need to start your remote job search.
            </CardDescription>
            <p className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground ml-1">/forever</span>
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {freeFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <a
              href="/jobs"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background border border-border bg-transparent hover:bg-muted hover:text-foreground h-12 rounded-lg px-8 text-base w-full"
            >
              Get Started
            </a>
          </CardFooter>
        </Card>

        {/* PRO tier */}
        <Card className="flex flex-col border-accent ring-2 ring-accent/20 relative">
          <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
            Pro
          </Badge>
          <CardHeader>
            <CardTitle className="text-xl">Pro</CardTitle>
            <CardDescription>
              Advanced tools for serious remote job seekers.
            </CardDescription>
            <p className="mt-4">
              <span className="text-4xl font-bold">
                {billing === "monthly" ? "$9" : "$49"}
              </span>
              <span className="text-muted-foreground ml-1">
                /{billing === "monthly" ? "month" : "year"}
              </span>
            </p>
            {billing === "annual" && (
              <p className="text-sm text-accent mt-1">
                $4.08/month &mdash; save 55%
              </p>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {proFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full"
              onClick={handleUpgrade}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
              ) : (
                "Upgrade to Pro"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
