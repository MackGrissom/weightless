import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, type PlanType } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, ...jobData } = body;

    if (!plan || !(plan in PLANS)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const selectedPlan = PLANS[plan as PlanType];
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

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
        company_website: jobData.company_website || "",
        company_email: jobData.company_email,
        job_type: jobData.job_type,
        experience_level: jobData.experience_level,
        salary_min: jobData.salary_min || "",
        salary_max: jobData.salary_max || "",
        location_requirements: jobData.location_requirements || "Worldwide",
        apply_url: jobData.apply_url,
        tech_stack: jobData.tech_stack || "",
      },
      // Store description separately since metadata has 500 char limit
      custom_fields: [],
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
