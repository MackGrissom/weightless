import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Vercel cron: runs daily to expire old jobs and update category counts
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Mark jobs older than 30 days as inactive
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { error: expireError } = await supabase
    .from("jobs")
    .update({ is_active: false })
    .eq("is_active", true)
    .lt("date_posted", thirtyDaysAgo.toISOString());

  if (expireError) {
    console.error("Error expiring jobs:", expireError);
  }

  // Update category job counts
  const { data: categories } = await supabase
    .from("categories")
    .select("id");

  if (categories) {
    for (const cat of categories) {
      const { count } = await supabase
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("category_id", cat.id)
        .eq("is_active", true);

      await supabase
        .from("categories")
        .update({ job_count: count || 0 })
        .eq("id", cat.id);
    }
  }

  return NextResponse.json({ success: true });
}
