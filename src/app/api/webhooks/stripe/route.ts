import { NextRequest, NextResponse } from "next/server";
import { stripe, type PlanType } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata!;
    const plan = metadata.plan as PlanType;
    const isFeatured = plan === "featured";

    const supabase = createAdminClient();

    // Create or find company
    const companySlug = slugify(metadata.company_name);
    let companyId: string;

    const { data: existingCompany } = await supabase
      .from("companies")
      .select("id")
      .eq("slug", companySlug)
      .single();

    if (existingCompany) {
      companyId = existingCompany.id;
    } else {
      const { data: newCompany } = await supabase
        .from("companies")
        .insert({
          name: metadata.company_name,
          slug: companySlug,
          website: metadata.company_website || null,
          remote_policy: "Remote",
        })
        .select("id")
        .single();
      companyId = newCompany!.id;
    }

    // Find category
    const title = metadata.title.toLowerCase();
    let categorySlug = "engineering";
    const categoryMap: Record<string, string[]> = {
      engineering: ["engineer", "developer", "devops"],
      design: ["designer", "ux", "ui"],
      marketing: ["marketing", "seo", "growth"],
      product: ["product manager", "product owner"],
      data: ["data", "analytics", "ml", "ai"],
    };
    for (const [cat, keywords] of Object.entries(categoryMap)) {
      if (keywords.some((k) => title.includes(k))) {
        categorySlug = cat;
        break;
      }
    }

    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    // Create job listing
    const jobSlug = slugify(`${metadata.title}-${metadata.company_name}`).slice(0, 80);
    const techStack = metadata.tech_stack
      ? metadata.tech_stack.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [];

    await supabase.from("jobs").insert({
      title: metadata.title,
      slug: jobSlug,
      company_id: companyId,
      description: metadata.title, // Minimal — full description via follow-up email
      description_plain: metadata.title,
      category_id: category?.id || null,
      job_type: metadata.job_type || "full_time",
      experience_level: metadata.experience_level || "mid",
      salary_min: metadata.salary_min ? Number(metadata.salary_min) : null,
      salary_max: metadata.salary_max ? Number(metadata.salary_max) : null,
      salary_currency: "USD",
      location_requirements: metadata.location_requirements || "Worldwide",
      apply_url: metadata.apply_url,
      tech_stack: techStack,
      source: "manual",
      source_id: session.id,
      is_featured: isFeatured,
      is_active: true,
      date_posted: new Date().toISOString(),
    });

    // Update category count
    if (category?.id) {
      const { count } = await supabase
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("category_id", category.id)
        .eq("is_active", true);
      await supabase
        .from("categories")
        .update({ job_count: count || 0 })
        .eq("id", category.id);
    }
  }

  return NextResponse.json({ received: true });
}
