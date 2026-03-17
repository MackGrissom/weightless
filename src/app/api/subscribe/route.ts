import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";

// Whitelist of allowed Stripe price IDs — update these when you
// configure real products in Stripe Dashboard.
const ALLOWED_PRICE_IDS = new Set([
  process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
  process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID,
].filter(Boolean));

const schema = z.object({
  priceId: z.string().min(1, "Missing priceId"),
  email: z.string().email().max(254).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const { success, response } = rateLimit(ip, { limit: 5, windowSeconds: 60 });
    if (!success) return response!;

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { priceId, email } = parsed.data;

    // Validate priceId against whitelist
    if (ALLOWED_PRICE_IDS.size > 0 && !ALLOWED_PRICE_IDS.has(priceId)) {
      return NextResponse.json(
        { error: "Invalid price selection" },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      ...(email ? { customer_email: email } : {}),
      success_url: `${siteUrl}/pricing?success=true`,
      cancel_url: `${siteUrl}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
