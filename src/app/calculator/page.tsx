import type { Metadata } from "next";
import { getCostOfLiving } from "@/lib/supabase/queries";
import { CalculatorForm } from "./calculator-form";

export const metadata: Metadata = {
  title: "Where Should I Live? — Remote Salary Calculator",
  description:
    "Compare your remote salary's purchasing power across 30 cities worldwide. See how far your money goes in Lisbon, Bali, Bangkok, and more with real cost-of-living data.",
  openGraph: {
    title: "Where Should I Live? — Remote Salary Calculator",
    description:
      "Compare your remote salary's purchasing power across 30 cities worldwide. Real cost-of-living data for digital nomads.",
    siteName: "Weightless",
  },
};

export const revalidate = 3600;

export default async function CalculatorPage() {
  const costOfLivingData = await getCostOfLiving(30);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Where should I <span className="text-accent">live</span>?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Enter your remote salary and discover where your money goes the
          furthest. We compare purchasing power across 30 cities popular with
          digital nomads.
        </p>
      </div>

      <CalculatorForm data={costOfLivingData} />
    </div>
  );
}
