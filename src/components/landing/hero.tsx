import Link from "next/link";
import { ArrowRight, Globe, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent mb-8">
            <Zap className="h-3.5 w-3.5" />
            Built for the location-independent workforce
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Work from{" "}
            <span className="text-accent">anywhere.</span>
            <br />
            Live{" "}
            <span className="text-accent">weightless.</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            The job board built for digital nomads. Find remote roles with
            cost-of-living context, visa sponsorship info, and timezone
            filtering — so you can work where life takes you.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/jobs">
              <Button size="lg" className="text-base px-8">
                Browse Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-base px-8">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-accent" />
              <span>Work from 40+ countries</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              <span>Visa-friendly roles</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              <span>Updated daily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
