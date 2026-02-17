import type { Metadata } from "next";
import { Globe, Heart, Zap, Users } from "lucide-react";
import { FAQStructuredData } from "@/components/shared/structured-data";

export const metadata: Metadata = {
  title: "About Weightless — The Digital Nomad Job Board",
  description:
    "Weightless is the job board built for digital nomads and location-independent workers. Free remote job search with cost-of-living context, visa info, and timezone filtering.",
  openGraph: {
    title: "About Weightless — The Digital Nomad Job Board",
    description:
      "The job board built for digital nomads. Free remote job search with salary-in-context and visa filtering.",
    siteName: "Weightless",
  },
};

const faqs = [
  {
    question: "What is Weightless?",
    answer:
      "Weightless is a free job board built specifically for digital nomads and remote workers. We aggregate remote job listings from major job boards and enrich them with cost-of-living comparisons, visa sponsorship info, and timezone filtering.",
  },
  {
    question: "Is Weightless free for job seekers?",
    answer:
      "Yes, Weightless is completely free for job seekers. Every job listing, every filter, and every feature is available at no cost. No premium tiers, no paywalls.",
  },
  {
    question: "How often are jobs updated?",
    answer:
      "Jobs are scraped and updated every 6 hours from major job boards including Indeed, LinkedIn, and Glassdoor. Old listings are automatically expired after 30 days to keep results fresh.",
  },
  {
    question: "How does the salary-in-context feature work?",
    answer:
      "We compare job salaries against the cost of living in popular digital nomad cities worldwide. This helps you understand what a salary actually means in cities like Lisbon, Bali, or Bangkok — not just in San Francisco.",
  },
  {
    question: "Can I post a job on Weightless?",
    answer:
      "Yes, employers can post remote jobs on Weightless. Standard listings are $99 for 30 days, and featured listings (pinned to the top with a badge) are $299 for 30 days.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <FAQStructuredData faqs={faqs} />
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Work from anywhere.
          <br />
          Live <span className="text-accent">weightless</span>.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          We built the job board we wished existed when we started working
          remotely from around the world.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Weightless exists to make location-independent work accessible to
            everyone. Most remote job boards treat &ldquo;remote&rdquo; as an
            afterthought — a checkbox on a traditional job listing. We think
            differently. Every feature we build starts with the question:
            &ldquo;How does this help someone working from a cafe in Lisbon, a
            co-working space in Bali, or a quiet apartment in Tbilisi?&rdquo;
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Why Weightless?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Traditional job boards show you a salary number and a
            &ldquo;remote&rdquo; tag. But for digital nomads, that&apos;s not
            enough. You need to know: Does this salary stretch further in your
            current city? Will the timezone requirements work with your
            lifestyle? Does the company actually sponsor visas, or is that just
            marketing speak? Weightless answers all of these questions.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 pt-8">
          {[
            {
              icon: Globe,
              title: "Nomad-First Design",
              description:
                "Every feature is designed for people who work from different locations — cost-of-living context, timezone filtering, visa info.",
            },
            {
              icon: Heart,
              title: "Free for Everyone",
              description:
                "No premium tiers, no paywalls. Every job, every filter, every feature is free for job seekers.",
            },
            {
              icon: Zap,
              title: "Always Fresh",
              description:
                "Jobs are scraped and updated every 6 hours from major job boards. No stale listings from months ago.",
            },
            {
              icon: Users,
              title: "Community-Driven",
              description:
                "Built by digital nomads, for digital nomads. Our priorities come from the community.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 mb-3">
                <item.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-16">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-semibold text-lg">{faq.question}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
