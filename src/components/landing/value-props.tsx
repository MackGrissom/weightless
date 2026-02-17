import {
  DollarSign,
  Globe,
  Plane,
  Clock,
  Wifi,
  Shield,
} from "lucide-react";

const props = [
  {
    icon: DollarSign,
    title: "Salary in Context",
    description:
      "See what your salary means in Bangkok, Lisbon, or Medellín — not just San Francisco.",
  },
  {
    icon: Globe,
    title: "Timezone Filtering",
    description:
      "Filter by timezone overlap so you find roles that match your lifestyle, not just your skills.",
  },
  {
    icon: Plane,
    title: "Visa Sponsorship",
    description:
      "Quickly identify companies that will sponsor your visa or hire you as a contractor anywhere.",
  },
  {
    icon: Clock,
    title: "Async-First",
    description:
      "Find companies that embrace async communication — work on your schedule, from any timezone.",
  },
  {
    icon: Wifi,
    title: "Nomad-Tested",
    description:
      "Every listing is verified remote-friendly. No 'remote but must be in California' surprises.",
  },
  {
    icon: Shield,
    title: "Free Forever",
    description:
      "No premium tiers for job seekers. Every feature, every filter, completely free.",
  },
];

export function ValueProps() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Built for Digital Nomads
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Not just another remote job board. Weightless gives you the context
            you need to make location-independent career decisions.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {props.map((prop) => (
            <div key={prop.title} className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <prop.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-semibold">{prop.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
