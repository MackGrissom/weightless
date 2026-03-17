import Link from "next/link";
import Image from "next/image";

interface TrustStripProps {
  companies: {
    name: string;
    slug: string;
    logo_url: string | null;
    jobCount: number;
  }[];
}

export function TrustStrip({ companies }: TrustStripProps) {
  if (companies.length === 0) return null;

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Trusted by teams hiring remotely worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {companies.map((company) => (
            <Link
              key={company.slug}
              href={`/companies/${company.slug}`}
              className="group relative flex items-center gap-2 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
              title={`${company.name} — ${company.jobCount} open ${company.jobCount === 1 ? "role" : "roles"}`}
            >
              {company.logo_url ? (
                <Image
                  src={company.logo_url}
                  alt={company.name}
                  width={28}
                  height={28}
                  className="rounded"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">
                  {company.name.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {company.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
