import Link from "next/link";
import { ArrowRight, Globe, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs sm:text-sm text-accent mb-6 sm:mb-8">
            <Zap className="h-3.5 w-3.5 shrink-0" />
            Built for the location-independent workforce
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Work from{" "}
            <span className="text-accent">anywhere.</span>
            <br />
            Live{" "}
            <span className="text-accent">weightless.</span>
          </h1>

          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The job board built for digital nomads. Find remote roles with
            cost-of-living context, visa sponsorship info, and timezone
            filtering — so you can work where life takes you.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/jobs" className="w-full sm:w-auto">
              <Button size="lg" className="text-base px-8 w-full sm:w-auto h-12">
                Browse Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="text-base px-8 w-full sm:w-auto h-12">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="mt-10 sm:mt-16 flex items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Globe className="h-4 w-4 text-accent shrink-0" />
              <span>40+ countries</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Shield className="h-4 w-4 text-accent shrink-0" />
              <span>Visa-friendly</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Zap className="h-4 w-4 text-accent shrink-0" />
              <span>Updated daily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
