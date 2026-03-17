import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
  email: z.string().email().max(254).nullable().optional(),
  salaryRange: z.string().max(50).nullable().optional(),
  userLocation: z.string().max(200).nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const { success, response } = rateLimit(ip, { limit: 20, windowSeconds: 60 });
    if (!success) return response!;

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { jobId, email, salaryRange, userLocation } = parsed.data;

    const supabase = createAdminClient();

    // Track the click + optional salary survey
    await supabase.from("apply_clicks").insert({
      job_id: jobId,
      email: email || null,
      salary_range: salaryRange || null,
      user_location: userLocation || null,
      user_agent: (req.headers.get("user-agent") || "").slice(0, 500),
      referrer: (req.headers.get("referer") || "").slice(0, 500),
    });

    // If email provided, also subscribe to newsletter
    if (email) {
      await supabase
        .from("newsletter_subscribers")
        .upsert({ email, is_active: true }, { onConflict: "email" });
    }

    // Get the apply URL
    const { data: job } = await supabase
      .from("jobs")
      .select("apply_url")
      .eq("id", jobId)
      .single();

    return NextResponse.json({ apply_url: job?.apply_url || null });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
