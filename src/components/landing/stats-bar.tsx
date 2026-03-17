import { Briefcase, Building2, MousePointerClick, MapPin } from "lucide-react";

interface StatsBarProps {
  jobCount: number;
  companyCount: number;
  applyCount: number;
  cityCount: number;
}

export function StatsBar({
  jobCount,
  companyCount,
  applyCount,
  cityCount,
}: StatsBarProps) {
  const stats = [
    { icon: Briefcase, label: "Remote Jobs", value: jobCount.toLocaleString() },
    { icon: Building2, label: "Companies", value: companyCount.toLocaleString() },
    { icon: MousePointerClick, label: "Applications", value: applyCount.toLocaleString() },
    { icon: MapPin, label: "Nomad Cities", value: cityCount.toLocaleString() },
  ];

  return (
    <section className="border-y border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 gap-2 py-6 sm:gap-4 sm:py-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-0.5 sm:gap-1 text-center">
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-accent mb-0.5 sm:mb-1" />
              <p className="text-lg font-bold text-accent sm:text-3xl">
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-sm text-muted-foreground leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
