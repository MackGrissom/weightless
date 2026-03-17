import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe, PLANS, type PlanType } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeUrl } from "@/lib/security";

const checkoutSchema = z.object({
  plan: z.enum(["standard", "featured"]),
  title: z.string().min(1).max(200),
  company_name: z.string().min(1).max(200),
  company_website: z.string().max(500).optional().default(""),
  company_email: z.string().email().max(254),
  description: z.string().max(10000).optional().default(""),
  job_type: z.enum(["full_time", "part_time", "contract", "freelance", "internship"]).default("full_time"),
  experience_level: z.enum(["junior", "mid", "senior", "lead", "executive"]).default("mid"),
  salary_min: z.string().max(20).optional().default(""),
  salary_max: z.string().max(20).optional().default(""),
  location_requirements: z.string().max(200).optional().default("Worldwide"),
  apply_url: z.string().min(1).max(500),
  tech_stack: z.string().max(500).optional().default(""),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const { success, response } = rateLimit(ip, { limit: 5, windowSeconds: 60 });
    if (!success) return response!;

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { plan, ...jobData } = parsed.data;

    // Validate apply_url is a real URL (prevents javascript: URIs)
    const safeApplyUrl = sanitizeUrl(jobData.apply_url);
    if (!safeApplyUrl) {
      return NextResponse.json(
        { error: "Apply URL must be a valid http or https URL" },
        { status: 400 }
      );
    }

    // Validate company_website if provided
    if (jobData.company_website) {
      const safeWebsite = sanitizeUrl(jobData.company_website);
      if (!safeWebsite) {
        return NextResponse.json(
          { error: "Company website must be a valid http or https URL" },
          { status: 400 }
        );
      }
      jobData.company_website = safeWebsite;
    }

    const selectedPlan = PLANS[plan as PlanType];
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${selectedPlan.name} — Weightless Job Board`,
              description: `${selectedPlan.duration}-day job listing on Weightless`,
            },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl}/post-job/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/post-job`,
      metadata: {
        plan,
        title: jobData.title,
        company_name: jobData.company_name,
        company_website: jobData.company_website,
        company_email: jobData.company_email,
        job_type: jobData.job_type,
        experience_level: jobData.experience_level,
        salary_min: jobData.salary_min,
        salary_max: jobData.salary_max,
        location_requirements: jobData.location_requirements,
        apply_url: safeApplyUrl,
        tech_stack: jobData.tech_stack,
      },
      custom_fields: [],
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
