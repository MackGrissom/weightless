/**
 * Backfill company logos using Clearbit Logo API.
 * Skips job board domains (indeed, linkedin, glassdoor, ziprecruiter)
 * and derives logos from company name when no real website exists.
 *
 * Usage: npx tsx scripts/backfill-logos.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Domains that are job boards, not company websites */
const JOB_BOARD_DOMAINS = new Set([
  "indeed.com",
  "linkedin.com",
  "glassdoor.com",
  "ziprecruiter.com",
  "ca.linkedin.com",
  "uk.linkedin.com",
  "fr.linkedin.com",
  "de.linkedin.com",
  "br.linkedin.com",
  "sg.linkedin.com",
  "in.linkedin.com",
  "it.linkedin.com",
  "es.linkedin.com",
  "pt.linkedin.com",
  "ar.linkedin.com",
  "au.linkedin.com",
  "dk.linkedin.com",
  "ie.linkedin.com",
  "sn.linkedin.com",
  "tr.linkedin.com",
  "ae.linkedin.com",
  "se.linkedin.com",
  "pa.linkedin.com",
]);

function extractDomain(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");
}

function isJobBoardDomain(domain: string): boolean {
  if (JOB_BOARD_DOMAINS.has(domain)) return true;
  // Catch any linkedin subdomain
  if (domain.endsWith(".linkedin.com") || domain === "linkedin.com") return true;
  if (domain.endsWith(".indeed.com") || domain === "indeed.com") return true;
  if (domain.endsWith(".glassdoor.com") || domain === "glassdoor.com") return true;
  return false;
}

/** Well-known company name → domain mappings */
const KNOWN_DOMAINS: Record<string, string> = {
  "airbnb": "airbnb.com",
  "stripe": "stripe.com",
  "coinbase": "coinbase.com",
  "doordash": "doordash.com",
  "cisco": "cisco.com",
  "webflow": "webflow.com",
  "deel": "deel.com",
  "samsara": "samsara.com",
  "deloitte": "deloitte.com",
  "wealthfront": "wealthfront.com",
  "bitpay": "bitpay.com",
  "meetup": "meetup.com",
  "sofi": "sofi.com",
  "headspace": "headspace.com",
  "square": "squareup.com",
  "experian": "experian.com",
  "fanatics": "fanatics.com",
  "hopper": "hopper.com",
  "elevenlabs": "elevenlabs.io",
  "shippo": "goshippo.com",
  "turing": "turing.com",
  "granicus": "granicus.com",
  "flexera": "flexera.com",
  "pathai": "pathai.com",
  "whatnot": "whatnot.com",
  "imply": "imply.io",
  "esusu": "esusu.org",
  "bestow": "bestow.com",
  "vultr": "vultr.com",
  "runpod": "runpod.io",
  "hirewell": "hirewell.com",
  "dataannotation": "dataannotation.tech",
  "viget": "viget.com",
  "flosum": "flosum.com",
  "nucleus security": "nucleussec.com",
  "everfox": "everfox.com",
  "crypto.com": "crypto.com",
};

function deriveLogoUrl(website: string | null, name: string): string | null {
  // 1. Try real website domain (skip job boards)
  if (website) {
    const domain = extractDomain(website);
    if (domain && !isJobBoardDomain(domain) && !domain.includes("example.com")) {
      return `https://logo.clearbit.com/${domain}`;
    }
  }

  // 2. Check known company mappings
  const lowerName = name.toLowerCase().trim();
  for (const [key, domain] of Object.entries(KNOWN_DOMAINS)) {
    if (lowerName.includes(key)) {
      return `https://logo.clearbit.com/${domain}`;
    }
  }

  // 3. Guess from company name — only for clean single-word names
  const cleanName = name.toLowerCase().replace(/[^\w]/g, "").replace(/\s+/g, "");
  if (cleanName && cleanName.length >= 3 && cleanName.length <= 20 && !/\s/.test(name.trim())) {
    return `https://logo.clearbit.com/${cleanName}.com`;
  }

  return null;
}

async function main() {
  console.log("Fetching ALL companies to fix/set logos...");

  // Fetch all companies (including ones with bad logos from previous run)
  const { data: companies, error } = await supabase
    .from("companies")
    .select("id, name, website, logo_url");

  if (error) {
    console.error("Error fetching companies:", error);
    process.exit(1);
  }

  if (!companies || companies.length === 0) {
    console.log("No companies found.");
    return;
  }

  console.log(`Found ${companies.length} companies. Processing...`);

  let updated = 0;
  let cleared = 0;
  for (const company of companies) {
    const currentLogo = company.logo_url || "";

    // Check if current logo is a bad job-board logo
    const isBadLogo = currentLogo.includes("logo.clearbit.com/indeed.com") ||
      currentLogo.includes("logo.clearbit.com/linkedin.com") ||
      currentLogo.includes("logo.clearbit.com/glassdoor.com") ||
      currentLogo.includes(".linkedin.com") && currentLogo.includes("logo.clearbit.com") ||
      currentLogo.includes("example.com");

    const needsLogo = !currentLogo || isBadLogo;
    if (!needsLogo) continue;

    const logoUrl = deriveLogoUrl(company.website, company.name);

    if (logoUrl) {
      const { error: updateError } = await supabase
        .from("companies")
        .update({ logo_url: logoUrl })
        .eq("id", company.id);

      if (!updateError) {
        console.log(`  Set: ${company.name} → ${logoUrl}`);
        updated++;
      }
    } else if (isBadLogo) {
      // Clear bad logo — let the frontend show the fallback icon
      const { error: clearError } = await supabase
        .from("companies")
        .update({ logo_url: null })
        .eq("id", company.id);

      if (!clearError) {
        console.log(`  Cleared bad logo: ${company.name}`);
        cleared++;
      }
    }
  }

  console.log(`\nDone. Set ${updated} logos, cleared ${cleared} bad logos.`);
}

main().catch(console.error);
