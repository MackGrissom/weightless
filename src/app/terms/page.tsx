import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions for using the Weightless remote job board.",
  alternates: { canonical: `${siteUrl}/terms` },
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold sm:text-4xl mb-8">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: March 15, 2026
      </p>

      <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-accent">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Weightless (&ldquo;the Service&rdquo;), you
          agree to be bound by these Terms of Service. If you do not agree, do
          not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Weightless is a remote job board that connects job seekers with
          employers offering remote and location-independent work. The Service
          includes job listings, salary data, cost-of-living tools, hiring
          trends, and related content.
        </p>

        <h2>3. User Accounts &amp; Registration</h2>
        <p>
          Job seekers can browse and apply for jobs without creating an account.
          Certain features (newsletter, job alerts) require providing an email
          address. Employers must provide valid contact and payment information
          to post jobs.
        </p>

        <h2>4. Job Seekers</h2>
        <ul>
          <li>
            The Service is free for job seekers. We do not charge fees for
            browsing, searching, or applying to jobs.
          </li>
          <li>
            Job listings are provided &ldquo;as is.&rdquo; We aggregate listings
            from multiple sources and cannot guarantee the accuracy,
            completeness, or currency of any listing.
          </li>
          <li>
            We are not a party to any employment agreement between you and an
            employer.
          </li>
        </ul>

        <h2>5. Employers &amp; Job Postings</h2>
        <ul>
          <li>
            Job postings are subject to our review. We reserve the right to
            remove listings that are misleading, discriminatory, or violate
            applicable laws.
          </li>
          <li>
            Payment for job postings is non-refundable once the listing has been
            published, unless otherwise agreed in writing.
          </li>
          <li>
            Employers must provide accurate information about the role,
            compensation, and company. Misleading listings may be removed without
            refund.
          </li>
        </ul>

        <h2>6. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            Use the Service for any unlawful purpose or to solicit illegal
            activity.
          </li>
          <li>
            Scrape, crawl, or systematically extract data from the Service
            without written permission.
          </li>
          <li>
            Submit false, misleading, or spam content through any form or API.
          </li>
          <li>
            Attempt to interfere with the security, integrity, or availability
            of the Service.
          </li>
          <li>
            Impersonate another person or entity.
          </li>
        </ul>

        <h2>7. Intellectual Property</h2>
        <p>
          The Service, including its design, code, content, and branding, is
          owned by Weightless and protected by intellectual property laws. Job
          listings submitted by employers remain the property of the respective
          employers.
        </p>

        <h2>8. Payments &amp; Refunds</h2>
        <p>
          Payments are processed securely through Stripe. By making a purchase,
          you agree to Stripe&rsquo;s terms of service. Refund requests must be
          made within 7 days of purchase and before the listing has been
          published.
        </p>

        <h2>9. Disclaimer of Warranties</h2>
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; without warranties of any kind, express or implied. We
          do not warrant that the Service will be uninterrupted, error-free, or
          secure.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Weightless shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages arising from your use of the Service, including but not limited
          to loss of profits, data, or employment opportunities.
        </p>

        <h2>11. Newsletter &amp; Communications</h2>
        <p>
          By providing your email address, you consent to receive job-related
          emails from us. You can unsubscribe at any time using the link in every
          email. See our{" "}
          <a href="/privacy">Privacy Policy</a> for details on how we handle
          your data.
        </p>

        <h2>12. Termination</h2>
        <p>
          We reserve the right to suspend or terminate access to the Service at
          our discretion, without notice, for conduct that we believe violates
          these Terms or is harmful to other users.
        </p>

        <h2>13. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the
          Service after changes constitutes acceptance of the revised Terms.
        </p>

        <h2>14. Contact</h2>
        <p>
          Questions about these Terms? Email us at{" "}
          <a href="mailto:legal@weightless.jobs">legal@weightless.jobs</a>.
        </p>
      </div>
    </div>
  );
}
