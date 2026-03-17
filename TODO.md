# Weightless — Production Launch Checklist

All code changes are done. This is your manual checklist to get live and start making money.

---

## PHASE 1: GO LIVE (Do This Week)

### Domain & DNS
- [ ] Register `weightless.jobs` (if not done)
- [ ] Add domain in Vercel Dashboard > Settings > Domains
- [ ] Verify HTTPS works on the custom domain

### Vercel Environment Variables
Set all of these in Vercel Dashboard > Settings > Environment Variables:
```
NEXT_PUBLIC_SITE_URL=https://weightless.jobs
NEXT_PUBLIC_SUPABASE_URL=<your project url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
SUPABASE_SERVICE_ROLE_KEY=<your service role key>
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
CRON_SECRET=<run: openssl rand -hex 32>
RESEND_API_KEY=<from resend.com>
RESEND_FROM_EMAIL=Weightless <hello@weightless.jobs>
```

### Stripe (Payments)
- [ ] Create account at stripe.com, complete business verification
- [ ] Switch to **live mode**
- [ ] Create webhook: `https://weightless.jobs/api/webhooks/stripe`
  - Subscribe to event: `checkout.session.completed`
  - Copy signing secret → `STRIPE_WEBHOOK_SECRET`
- [ ] Test: buy a $99 Standard job post end-to-end, verify job appears in DB

### Email (Resend)
- [ ] Create account at resend.com
- [ ] Verify `weightless.jobs` domain (add SPF, DKIM, DMARC DNS records they give you)
- [ ] Create API key → `RESEND_API_KEY`
- [ ] Set up email addresses (or forwarding aliases):
  - `hello@weightless.jobs` — sender address for newsletters
  - `privacy@weightless.jobs` — referenced in Privacy Policy
  - `legal@weightless.jobs` — referenced in Terms of Service
- [ ] Test: subscribe to newsletter, verify welcome email arrives

### Database (Supabase)
- [ ] Run all migrations in `supabase/migrations/`
- [ ] Verify `search_jobs` RPC function is deployed
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Add database indexes if missing:
  - `jobs.slug` (unique)
  - `companies.slug` (unique)
  - `jobs.is_active + jobs.date_posted` (composite)
  - `jobs.category_id` where `is_active = true`
- [ ] Seed data if empty: `npx tsx scripts/seed.ts`
- [ ] Enable automatic backups (Supabase > Settings > Database > Backups)
- [ ] Verify scraper has populated jobs, companies, categories, cost_of_living

### Legal
- [ ] Review `/privacy` and `/terms` — update email addresses if yours differ
- [ ] Consider a 30-min lawyer review if targeting EU users (GDPR)

### Scraper
- [ ] Verify GitHub Actions scraper runs every 6 hours
- [ ] Verify aggregation workflow runs weekly
- [ ] Confirm fresh jobs appear in the database

---

## PHASE 2: MONETIZATION (Week 1-2 After Launch)

### Fix Pro Subscription — Currently Broken
The Pro plan ($9/mo or $49/yr) is displayed on the pricing page but uses placeholder Stripe price IDs. You need to:

- [ ] Go to Stripe Dashboard > Products > Create Product
  - Name: "Weightless Pro"
  - Add two prices:
    - Monthly: $9/month recurring
    - Annual: $49/year recurring
- [ ] Copy the price IDs and set in Vercel env vars:
  ```
  NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
  NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID=price_xxx
  ```
- [ ] Test: complete a Pro subscription checkout end-to-end
- [ ] **Decision needed:** Right now Pro features (full salary data, all city comparisons, CSV export, trend reports) are NOT gated in code — everything is free. You have two options:
  - **Option A:** Keep everything free for now, use Pro as a "support us" tier (lower friction, build audience first)
  - **Option B:** Build auth + feature gating to enforce Pro-only access (more dev work, but real recurring revenue)
  - My recommendation: **Option A for launch**, then gate features once you have 1,000+ newsletter subscribers

### Employer Value Proposition
Your employer pricing ($99/$299) is competitive but needs proof of value:
- [ ] Add proof points to the pricing page once you have data:
  - "Featured listings get Xx more applications"
  - "Average time to first application: X days"
- [ ] Collect 2-3 testimonials from employers who posted jobs
- [ ] Track job views per listing (add to a future employer dashboard)

### Revenue Opportunities You're Missing
Ranked by effort vs. impact:

| Opportunity | Revenue Potential | Effort | Priority |
|---|---|---|---|
| Fix Pro subscription (above) | $20-30k/yr | Low (config only) | Now |
| Newsletter sponsor slots | $24-60k/yr | Low (manual outreach) | Month 1 |
| Bulk employer pricing (5-pack, 10-pack) | +30% employer revenue | Low (Stripe products) | Month 1 |
| "Upgrade to Featured" upsell for Standard buyers | +15% employer revenue | Medium | Month 2 |
| Employer analytics dashboard | Higher retention, justify $299 | High | Month 2-3 |
| Recruiter/Agency tier ($1,499/mo unlimited) | $15-30k/yr per agency | Medium | Month 3 |
| Salary report PDF downloads ($29) | $5-15k/yr | Medium | Month 3 |

---

## PHASE 3: SEO & ORGANIC GROWTH (Ongoing)

### Google Search Console (Do Immediately After Launch)
- [ ] Go to search.google.com/search-console
- [ ] Add property: `https://weightless.jobs`
- [ ] Verify ownership (DNS TXT record)
- [ ] Submit sitemap: `https://weightless.jobs/sitemap.xml`
- [ ] Request indexing: `/`, `/jobs`, `/blog`, `/salaries`, `/remote-jobs-in`
- [ ] Monitor Coverage tab weekly for crawl errors

### Google Analytics 4 (When Ready)
- [ ] Create GA4 property at analytics.google.com
- [ ] Get Measurement ID (G-XXXXXXXXXX)
- [ ] Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel env vars
- [ ] Set up conversion events: `apply_click`, `newsletter_signup`, `job_post_purchase`
- [ ] Link GA4 to Search Console

### Content Strategy
Your blog is your biggest SEO lever. Aim for 2-4 posts/month:
- [ ] "Best remote [role] jobs in 2026" (repeat per category)
- [ ] "Digital nomad guide to [city]" (cross-link to your city pages)
- [ ] "Remote salary negotiation: how to get paid fairly from [country]"
- [ ] "Remote work visa guide for [country]" (cross-link to visa filter)
- [ ] Cross-link every blog post to your tools (salary explorer, calculator, city pages)
- [ ] Submit RSS feed (`/blog/feed.xml`) to Feedly, Inoreader, etc.

### Link Building
- [ ] Launch on Product Hunt
- [ ] Submit to "best remote job boards" directories (Remote.co, FlexJobs alternatives lists)
- [ ] Reach out to "best remote job boards in 2026" blog authors for inclusion
- [ ] Guest post on digital nomad blogs (Nomad List, Remote Year, etc.)
- [ ] Share salary/city data as embeddable widgets for backlinks

### Social Media
- [ ] Create: Twitter/X, LinkedIn company page
- [ ] Join and engage: r/digitalnomad, r/remotework, Nomad List community
- [ ] Share weekly job market insights from your data (trending skills, salary changes)

---

## PHASE 4: MONITORING & RELIABILITY

### Error Tracking
- [ ] Sign up for Sentry free tier (sentry.io)
- [ ] Install `@sentry/nextjs` and configure
- [ ] Replaces all `console.error` logging with proper error tracking + alerts

### Uptime Monitoring
- [ ] Set up Betterstack (betterstack.com) or UptimeRobot
- [ ] Monitor: homepage, `/jobs`, `/api/newsletter`, `/api/checkout`
- [ ] Set up Slack/email alerts for downtime

### Performance Monitoring
- [ ] Check Core Web Vitals in Vercel Analytics dashboard
- [ ] Run Lighthouse on key pages monthly (homepage, /jobs, /jobs/[slug])
- [ ] Target: LCP < 2.5s, CLS < 0.1, INP < 200ms

---

## PHASE 5: PAID MARKETING (When Organic Is Working)

### When to start
Don't pay for traffic until:
- [ ] 500+ active jobs in the database
- [ ] 100+ tracked applications
- [ ] 10+ blog posts indexed in Google
- [ ] Organic traffic growing week-over-week in Search Console
- [ ] At least one employer has paid for a listing

### Channels to test (ordered by expected ROI)
1. **Google Ads** — "remote [role] jobs" keywords (high intent, job seekers)
2. **Newsletter sponsorships** — Nomad List, Remote OK, Indie Hackers newsletters (targeted audience)
3. **Reddit Ads** — r/digitalnomad, r/remotework (cheap, niche)
4. **LinkedIn Ads** — target hiring managers at remote-first companies (employer acquisition)
5. **Retargeting** — pixel all visitors, retarget on social with "X new jobs this week"

---

## FUTURE ROADMAP (Nice to Have)

### Product
- [ ] Employer dashboard — manage listings, view application stats
- [ ] "Upgrade to Featured" self-serve for existing Standard listings
- [ ] Email drip sequence for new newsletter subscribers (5-email onboarding)
- [ ] Company reviews / ratings from employees
- [ ] Job view counter (show employers their listing traffic)
- [ ] Saved jobs / favorites for job seekers
- [ ] Stripe customer portal for Pro subscription management

### Revenue
- [ ] Affiliate program for tools/courses (earn 5-10% referral commission)
- [ ] Salary benchmark reports as paid downloads ($29-49)
- [ ] Recruiter/Agency unlimited tier ($1,499/mo)
- [ ] API access for job data (SaaS pricing)

### Growth
- [ ] A/B test employer pricing ($79 vs $99 vs $129 for Standard)
- [ ] Exit-intent popup for newsletter capture
- [ ] "Jobs like this" email when new jobs match saved search
- [ ] Intercom/Crisp chat widget for employer support
- [ ] Partner with co-working spaces and nomad communities
