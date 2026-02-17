"use client";

import { useState } from "react";
import { Check, ArrowRight, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PlanType = "standard" | "featured";

const plans = {
  standard: {
    name: "Standard",
    price: "$99",
    features: [
      "Listed for 30 days",
      "Full job description",
      "Company profile page",
      "Email applications",
    ],
  },
  featured: {
    name: "Featured",
    price: "$299",
    popular: true,
    features: [
      "Everything in Standard",
      "Featured badge on listing",
      "Pinned to top of results",
      "Homepage placement",
      "Social media promotion",
    ],
  },
};

export function PostJobForm() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("featured");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"plan" | "details">("plan");

  const [form, setForm] = useState({
    title: "",
    company_name: "",
    company_website: "",
    company_email: "",
    description: "",
    job_type: "full_time",
    experience_level: "mid",
    salary_min: "",
    salary_max: "",
    location_requirements: "Worldwide",
    apply_url: "",
    tech_stack: "",
  });

  function updateForm(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCheckout() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, ...form }),
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

  if (step === "plan") {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {(Object.entries(plans) as [PlanType, (typeof plans)[PlanType]][]).map(
            ([key, plan]) => (
              <Card
                key={key}
                className={cn(
                  "cursor-pointer transition-all relative",
                  selectedPlan === key
                    ? "border-accent ring-2 ring-accent/20"
                    : "hover:border-accent/30"
                )}
                onClick={() => setSelectedPlan(key)}
              >
                {"popular" in plan && plan.popular && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {key === "featured" ? (
                      <Star className="h-5 w-5 text-accent" />
                    ) : (
                      <Zap className="h-5 w-5 text-muted-foreground" />
                    )}
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <p className="text-3xl font-bold mt-2">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /30 days
                    </span>
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="h-4 w-4 text-accent shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          )}
        </div>

        <div className="text-center">
          <Button size="lg" onClick={() => setStep("details")} className="px-8">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => setStep("plan")}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Change plan ({plans[selectedPlan].name} — {plans[selectedPlan].price})
      </button>

      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Job Details</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Job Title *
              </label>
              <Input
                placeholder="Senior Frontend Engineer"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Company Name *
              </label>
              <Input
                placeholder="Acme Inc"
                value={form.company_name}
                onChange={(e) => updateForm("company_name", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Company Website
              </label>
              <Input
                placeholder="https://example.com"
                value={form.company_website}
                onChange={(e) => updateForm("company_website", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Contact Email *
              </label>
              <Input
                type="email"
                placeholder="hiring@example.com"
                value={form.company_email}
                onChange={(e) => updateForm("company_email", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Job Description *
            </label>
            <textarea
              className="flex min-h-[200px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Describe the role, responsibilities, requirements, and benefits..."
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Job Type
              </label>
              <Select
                value={form.job_type}
                onChange={(e) => updateForm("job_type", e.target.value)}
              >
                <option value="full_time">Full-Time</option>
                <option value="part_time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Experience Level
              </label>
              <Select
                value={form.experience_level}
                onChange={(e) => updateForm("experience_level", e.target.value)}
              >
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Location
              </label>
              <Input
                placeholder="Worldwide"
                value={form.location_requirements}
                onChange={(e) =>
                  updateForm("location_requirements", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Salary Min (USD/yr)
              </label>
              <Input
                type="number"
                placeholder="80000"
                value={form.salary_min}
                onChange={(e) => updateForm("salary_min", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Salary Max (USD/yr)
              </label>
              <Input
                type="number"
                placeholder="120000"
                value={form.salary_max}
                onChange={(e) => updateForm("salary_max", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Application URL *
            </label>
            <Input
              placeholder="https://example.com/careers/apply"
              value={form.apply_url}
              onChange={(e) => updateForm("apply_url", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              Tech Stack (comma-separated)
            </label>
            <Input
              placeholder="React, TypeScript, Node.js, PostgreSQL"
              value={form.tech_stack}
              onChange={(e) => updateForm("tech_stack", e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="text-center">
        <Button
          size="lg"
          onClick={handleCheckout}
          disabled={
            isLoading ||
            !form.title ||
            !form.company_name ||
            !form.company_email ||
            !form.description ||
            !form.apply_url
          }
          className="px-8"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
          ) : (
            <>
              Pay {plans[selectedPlan].price} &amp; Post Job
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Secure payment via Stripe. Your listing goes live within minutes.
        </p>
      </div>
    </div>
  );
}
