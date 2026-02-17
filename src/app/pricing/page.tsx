import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
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
import { PricingToggle } from "./pricing-toggle";
import { FaqAccordion, FaqStructuredData } from "@/components/shared/faq-accordion";

const faqItems = [
  {
    question: "Is Weightless free for job seekers?",
    answer:
      "Yes! Browsing jobs, applying, and setting up job alerts are completely free. We also offer a Pro plan with advanced salary data, city comparisons, trend reports, and CSV data export for power users.",
  },
  {
    question: "How much does it cost to post a job?",
    answer:
      "Standard job posts are $99 for a 30-day listing. Featured posts are $299 and include priority placement at the top of search results, homepage visibility, and social media promotion.",
  },
  {
    question: "How long does a job listing stay active?",
    answer:
      "All job listings are active for 30 days from the date of posting. After 30 days, the listing is automatically archived. You can re-post at any time.",
  },
  {
    question: "Can I edit my job listing after posting?",
    answer:
      "Yes, you can edit your job listing at any time while it's active. Changes are reflected immediately on the site.",
  },
  {
    question: "What's the difference between Standard and Featured posts?",
    answer:
      "Featured posts get a highlighted badge, are pinned to the top of search results, appear on the Weightless homepage, and are promoted on our social media channels. Standard posts are listed in normal search results order.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer full refunds within 48 hours of posting if your listing hasn't received any applications. After 48 hours, listings are non-refundable. Contact us at hello@weightless.jobs for refund requests.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) via Stripe. All payments are processed securely.",
  },
];

export const metadata: Metadata = {
  title: "Pricing — Weightless Pro",
  description:
    "Compare Weightless Free and Pro plans. Browse remote jobs for free or upgrade to Pro for full salary explorer, 30+ city comparisons, hiring trend reports, and CSV data export.",
  openGraph: {
    title: "Pricing — Weightless Pro",
    description:
      "Free remote job search or upgrade to Pro for advanced salary tools, city comparisons, and data export.",
    siteName: "Weightless",
  },
};

const employerPlans = [
  {
    name: "Standard Job Post",
    price: "$99",
    description: "30-day listing with full company profile and email applications.",
    features: [
      "Listed for 30 days",
      "Full job description",
      "Company profile page",
      "Email applications",
    ],
  },
  {
    name: "Featured Job Post",
    price: "$299",
    description:
      "Everything in Standard plus premium placement and promotion.",
    features: [
      "Everything in Standard",
      "Featured badge on listing",
      "Pinned to top of results",
      "Homepage placement",
      "Social media promotion",
    ],
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Simple, transparent{" "}
          <span className="text-accent">pricing</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Start free and upgrade when you need advanced salary tools, city
          comparisons, and data export.
        </p>
      </div>

      {/* Job seeker plans (client component with toggle) */}
      <PricingToggle />

      {/* Employer section */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            For Employers
          </Badge>
          <h2 className="text-3xl font-bold">
            Hire Remote Talent
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Post your remote job listing and reach thousands of digital nomads
            and location-independent workers.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
          {employerPlans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.highlighted
                  ? "flex flex-col border-accent ring-2 ring-accent/20 relative"
                  : "flex flex-col"
              }
            >
              {plan.highlighted && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <p className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/30 days</span>
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
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
                <Link
                  href="/post-job"
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background h-12 px-8 text-base w-full",
                    plan.highlighted
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "border border-border bg-transparent hover:bg-muted hover:text-foreground"
                  )}
                >
                  Post a Job
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-24">
        <FaqStructuredData items={faqItems} />
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            Frequently Asked <span className="text-accent">Questions</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about Weightless pricing and features.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </div>
  );
}
