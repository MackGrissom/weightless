import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/lib/blog-content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — Remote Work Insights | Weightless",
  description:
    "Expert guides on remote job salaries, digital nomad cities, visa sponsorship, interview tips, and cost-of-living comparisons for location-independent workers.",
  openGraph: {
    title: "Blog — Remote Work Insights | Weightless",
    description:
      "Expert guides on remote job salaries, digital nomad cities, visa sponsorship, interview tips, and cost-of-living comparisons.",
    siteName: "Weightless",
  },
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Remote Work <span className="text-accent">Insights</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Salary guides, nomad city rankings, visa breakdowns, and career advice
          for the location-independent workforce.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <Card className="h-full transition-colors hover:border-accent/40">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="accent">{post.category}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min read
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </CardTitle>
                <CardDescription className="mt-2 line-clamp-3">
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </CardContent>
              <CardFooter>
                <span className="text-sm font-medium text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read article
                  <ArrowRight className="h-4 w-4" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
