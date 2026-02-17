import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId, email } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing priceId" },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

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
    const message =
      err instanceof Error
        ? err.message
        : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
