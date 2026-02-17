import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { jobId, email } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: "Job ID required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Track the click
    await supabase.from("apply_clicks").insert({
      job_id: jobId,
      email: email || null,
      user_agent: req.headers.get("user-agent"),
      referrer: req.headers.get("referer"),
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
