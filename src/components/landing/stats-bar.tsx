interface StatsBarProps {
  jobCount: number;
  companyCount: number;
  categoryCount: number;
}

export function StatsBar({ jobCount, companyCount, categoryCount }: StatsBarProps) {
  const stats = [
    { label: "Remote Jobs", value: jobCount.toLocaleString() },
    { label: "Companies", value: companyCount.toLocaleString() },
    { label: "Categories", value: categoryCount.toLocaleString() },
    { label: "Countries", value: "40+" },
  ];

  return (
    <section className="border-y border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 py-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-accent sm:text-3xl">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
