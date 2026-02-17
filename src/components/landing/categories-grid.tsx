import Link from "next/link";
import {
  Code,
  Palette,
  Megaphone,
  Package,
  Headphones,
  PenTool,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Category } from "@/types/database";

const iconMap: Record<string, React.ReactNode> = {
  engineering: <Code className="h-6 w-6" />,
  design: <Palette className="h-6 w-6" />,
  marketing: <Megaphone className="h-6 w-6" />,
  product: <Package className="h-6 w-6" />,
  support: <Headphones className="h-6 w-6" />,
  writing: <PenTool className="h-6 w-6" />,
  data: <BarChart3 className="h-6 w-6" />,
  education: <GraduationCap className="h-6 w-6" />,
};

interface CategoriesGridProps {
  categories: Category[];
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Browse by Category</h2>
          <p className="mt-2 text-muted-foreground">
            Find your niche in the remote work landscape
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.slug} href={`/jobs?category=${category.slug}`}>
              <Card className="p-5 text-center transition-colors hover:border-accent/30 hover:bg-card/80 h-full">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  {iconMap[category.slug] || <Code className="h-6 w-6" />}
                </div>
                <h3 className="font-medium text-sm">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {category.job_count} jobs
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
