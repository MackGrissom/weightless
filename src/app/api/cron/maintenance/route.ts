import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { safeCompare } from "@/lib/security";

// Vercel cron: runs daily to expire old jobs and update category counts
export async function GET(req: NextRequest) {
  // Verify cron secret (timing-safe comparison)
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!authHeader || !safeCompare(authHeader, expected)) {
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

  // Update category job counts in batch (avoids N+1 queries)
  const { data: counts } = await supabase
    .from("jobs")
    .select("category_id")
    .eq("is_active", true);

  const { data: allCategories } = await supabase
    .from("categories")
    .select("id");

  if (allCategories) {
    const countMap = new Map<string, number>();
    for (const cat of allCategories) {
      countMap.set(cat.id, 0);
    }
    if (counts) {
      for (const job of counts) {
        if (job.category_id) {
          countMap.set(job.category_id, (countMap.get(job.category_id) || 0) + 1);
        }
      }
    }

    await Promise.all(
      Array.from(countMap.entries()).map(([id, count]) =>
        supabase.from("categories").update({ job_count: count }).eq("id", id)
      )
    );
  }

  return NextResponse.json({ success: true });
}
