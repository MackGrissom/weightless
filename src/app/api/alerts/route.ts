import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_CATEGORIES = [
  "engineering",
  "design",
  "marketing",
  "product",
  "support",
  "writing",
  "data",
  "education",
] as const;

const schema = z.object({
  email: z.string().email("Please provide a valid email address"),
  category: z
    .enum(VALID_CATEGORIES)
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  keywords: z
    .string()
    .max(200, "Keywords must be 200 characters or fewer")
    .nullable()
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : null)),
  frequency: z.enum(["daily", "weekly"]).optional().default("weekly"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, category, keywords, frequency } = schema.parse(body);

    const supabase = createAdminClient();

    const { error } = await supabase.from("job_alerts").upsert(
      {
        email,
        category_slug: category,
        keywords,
        frequency,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email,category_slug" }
    );

    if (error) {
      console.error("Job alert signup error:", error);

      // Fallback to insert if upsert conflict config doesn't match
      const { error: insertError } = await supabase
        .from("job_alerts")
        .insert({
          email,
          category_slug: category,
          keywords,
          frequency,
          is_active: true,
        });

      if (insertError) {
        console.error("Job alert insert fallback error:", insertError);
        return NextResponse.json(
          { error: "Failed to create alert. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
