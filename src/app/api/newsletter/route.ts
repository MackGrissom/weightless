import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email, is_active: true }, { onConflict: "email" });

    if (error) {
      console.error("Newsletter signup error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    // Send welcome email via Resend (non-blocking)
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Weightless <hello@weightless.jobs>",
        to: email,
        subject: "Welcome to Weightless — Remote Jobs for Nomads",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 16px;">
            <h1 style="font-size: 24px; margin-bottom: 16px;">Welcome to Weightless</h1>
            <p style="color: #666; line-height: 1.6;">
              You're in. Every week, we'll send you the best new remote jobs — plus salary insights and nomad city data you won't find anywhere else.
            </p>
            <div style="margin: 24px 0;">
              <a href="${siteUrl}/jobs" style="display: inline-block; background: #c8ff00; color: #0a0a0a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Browse Jobs Now
              </a>
            </div>
            <p style="color: #666; line-height: 1.6;">Here's what you can explore:</p>
            <ul style="color: #666; line-height: 1.8;">
              <li><a href="${siteUrl}/salaries" style="color: #c8ff00;">Salary Explorer</a> — Real pay data by role</li>
              <li><a href="${siteUrl}/trends" style="color: #c8ff00;">Hiring Trends</a> — What skills are in demand</li>
              <li><a href="${siteUrl}/calculator" style="color: #c8ff00;">Where to Live?</a> — Cost-of-living calculator</li>
            </ul>
            <p style="color: #999; font-size: 12px; margin-top: 32px;">
              You received this because you signed up at Weightless. <a href="${siteUrl}" style="color: #999;">Unsubscribe</a>
            </p>
          </div>
        `,
      }).catch((err) => console.error("Resend error:", err));
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
