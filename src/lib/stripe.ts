import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

export const PLANS = {
  standard: {
    name: "Standard Listing",
    price: 9900, // $99
    duration: 30, // days
    features: [
      "Listed for 30 days",
      "Full job description",
      "Company profile page",
      "Email applications",
    ],
  },
  featured: {
    name: "Featured Listing",
    price: 29900, // $299
    duration: 30,
    features: [
      "Everything in Standard",
      "Featured badge on listing",
      "Pinned to top of results",
      "Homepage placement",
      "Social media promotion",
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;
