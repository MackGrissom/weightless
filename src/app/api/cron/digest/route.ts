import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
  }

  const supabase = createAdminClient();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Weightless <hello@weightless.jobs>";

  // Get top 10 new jobs from the past week
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("title, slug, salary_min, salary_max, company:companies(name)")
    .eq("is_active", true)
    .gte("date_posted", oneWeekAgo)
    .order("is_featured", { ascending: false })
    .order("date_posted", { ascending: false })
    .limit(10);

  if (!jobs || jobs.length === 0) {
    return NextResponse.json({ message: "No new jobs this week" });
  }

  // Get active subscribers
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("email")
    .eq("is_active", true);

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ message: "No active subscribers" });
  }

  // Format salary
  function fmtSalary(min: number | null, max: number | null): string {
    if (!min && !max) return "";
    if (min && max) return ` — $${Math.round(min / 1000)}k-$${Math.round(max / 1000)}k`;
    if (min) return ` — From $${Math.round(min / 1000)}k`;
    return ` — Up to $${Math.round(max! / 1000)}k`;
  }

  // Build job list HTML
  const jobsHtml = jobs.map((job) => {
    const company = job.company as unknown as { name: string } | null;
    const companyName = company?.name || "Company";
    const salary = fmtSalary(job.salary_min, job.salary_max);
    return `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #262626;">
          <a href="${siteUrl}/jobs/${job.slug}" style="color: #ededed; text-decoration: none; font-weight: 600;">${job.title}</a>
          <br/>
          <span style="color: #a0a0a0; font-size: 13px;">${companyName}${salary}</span>
        </td>
      </tr>
    `;
  }).join("");

  const emailHtml = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 16px; background: #0a0a0a; color: #ededed;">
      <h1 style="font-size: 22px; margin-bottom: 4px;">This Week on Weightless</h1>
      <p style="color: #a0a0a0; margin-bottom: 24px;">${jobs.length} new remote jobs for digital nomads</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${jobsHtml}
      </table>
      <div style="margin-top: 24px;">
        <a href="${siteUrl}/jobs" style="display: inline-block; background: #c8ff00; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          See All Jobs
        </a>
      </div>
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #262626;">
        <p style="color: #666; font-size: 12px;">
          <a href="${siteUrl}/salaries" style="color: #c8ff00;">Salaries</a> ·
          <a href="${siteUrl}/trends" style="color: #c8ff00;">Trends</a> ·
          <a href="${siteUrl}/calculator" style="color: #c8ff00;">Calculator</a>
        </p>
        <p style="color: #666; font-size: 11px; margin-top: 8px;">
          You're getting this because you signed up at Weightless. <a href="${siteUrl}" style="color: #666;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `;

  // Send to all subscribers (batch)
  const emails = subscribers.map((sub) => sub.email);
  let sent = 0;

  // Resend batch API supports up to 100 per call
  for (let i = 0; i < emails.length; i += 100) {
    const batch = emails.slice(i, i + 100).map((to) => ({
      from: fromEmail,
      to,
      subject: `${jobs.length} new remote jobs this week — Weightless`,
      html: emailHtml,
    }));

    try {
      await resend.batch.send(batch);
      sent += batch.length;
    } catch (err) {
      console.error("Batch send error:", err);
    }
  }

  return NextResponse.json({
    message: `Digest sent to ${sent} subscribers with ${jobs.length} jobs`,
  });
}
