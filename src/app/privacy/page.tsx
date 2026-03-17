import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Weightless collects, uses, and protects your personal information.",
  alternates: { canonical: `${siteUrl}/privacy` },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold sm:text-4xl mb-8">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: March 15, 2026
      </p>

      <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-accent">
        <h2>1. Introduction</h2>
        <p>
          Weightless (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
          operates the website at weightless.jobs. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when you
          visit our website and use our services.
        </p>

        <h2>2. Information We Collect</h2>
        <h3>Information you provide directly</h3>
        <ul>
          <li>
            <strong>Email address</strong> &mdash; when you subscribe to our
            newsletter, set up job alerts, or apply for a job through our
            platform.
          </li>
          <li>
            <strong>Payment information</strong> &mdash; when you purchase a job
            posting. Payments are processed securely by Stripe; we do not store
            your card details.
          </li>
          <li>
            <strong>Job posting details</strong> &mdash; company name, job
            title, description, and related metadata when employers post jobs.
          </li>
        </ul>

        <h3>Information collected automatically</h3>
        <ul>
          <li>
            <strong>Usage data</strong> &mdash; pages visited, time on site,
            referral source, and browser/device information via Vercel Analytics.
          </li>
          <li>
            <strong>IP address</strong> &mdash; used for rate limiting and
            security purposes. We do not store IP addresses long-term.
          </li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>Send weekly job digests and job alerts you have opted into.</li>
          <li>Process job posting payments.</li>
          <li>Track aggregate usage to improve the product.</li>
          <li>Prevent abuse, fraud, and spam.</li>
          <li>Comply with legal obligations.</li>
        </ul>

        <h2>4. Third-Party Services</h2>
        <p>We share data with the following processors, each bound by their own privacy policies:</p>
        <ul>
          <li>
            <strong>Supabase</strong> &mdash; database hosting and
            authentication.
          </li>
          <li>
            <strong>Stripe</strong> &mdash; payment processing.
          </li>
          <li>
            <strong>Resend</strong> &mdash; transactional and marketing email
            delivery.
          </li>
          <li>
            <strong>Vercel</strong> &mdash; website hosting and analytics.
          </li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>
          We retain your email address for as long as your subscription or alert
          is active. When you unsubscribe, we deactivate your record. You may
          request permanent deletion at any time (see Section 7). Job postings
          are automatically deactivated after 30 days.
        </p>

        <h2>6. Cookies &amp; Tracking</h2>
        <p>
          We use minimal cookies and local storage for essential site
          functionality:
        </p>
        <ul>
          <li>
            <strong>Theme preference</strong> &mdash; stored in local storage to
            remember your light/dark mode choice.
          </li>
          <li>
            <strong>Vercel Analytics</strong> &mdash; privacy-friendly analytics
            that do not use cookies for cross-site tracking.
          </li>
        </ul>
        <p>We do not use advertising cookies or sell your data to third parties.</p>

        <h2>7. Your Rights (GDPR &amp; CCPA)</h2>
        <p>You have the right to:</p>
        <ul>
          <li>
            <strong>Access</strong> &mdash; request a copy of the personal data
            we hold about you.
          </li>
          <li>
            <strong>Rectification</strong> &mdash; correct inaccurate data.
          </li>
          <li>
            <strong>Erasure</strong> &mdash; request deletion of your personal
            data.
          </li>
          <li>
            <strong>Portability</strong> &mdash; receive your data in a
            structured, machine-readable format.
          </li>
          <li>
            <strong>Withdraw consent</strong> &mdash; unsubscribe from emails at
            any time using the link in every email, or via our unsubscribe page.
          </li>
        </ul>
        <p>
          To exercise these rights, email us at{" "}
          <a href="mailto:privacy@weightless.jobs">privacy@weightless.jobs</a>.
          We will respond within 30 days.
        </p>

        <h2>8. Data Security</h2>
        <p>
          We use industry-standard security measures including HTTPS encryption,
          secure database hosting with row-level security policies, and access
          controls on all API endpoints. However, no method of electronic
          transmission is 100% secure.
        </p>

        <h2>9. Children&rsquo;s Privacy</h2>
        <p>
          Our services are not directed to individuals under the age of 16. We
          do not knowingly collect personal information from children.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          subscribers of material changes via email. The &ldquo;Last
          updated&rdquo; date at the top reflects the most recent revision.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, contact us at{" "}
          <a href="mailto:privacy@weightless.jobs">privacy@weightless.jobs</a>.
        </p>
      </div>
    </div>
  );
}
