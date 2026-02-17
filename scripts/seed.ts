/**
 * Seed script — populates Supabase with mock data for development.
 * Run: npx tsx scripts/seed.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const categories = [
  { name: "Engineering", slug: "engineering", icon: "code", job_count: 0 },
  { name: "Design", slug: "design", icon: "palette", job_count: 0 },
  { name: "Marketing", slug: "marketing", icon: "megaphone", job_count: 0 },
  { name: "Product", slug: "product", icon: "package", job_count: 0 },
  { name: "Customer Support", slug: "support", icon: "headphones", job_count: 0 },
  { name: "Writing & Content", slug: "writing", icon: "pen-tool", job_count: 0 },
  { name: "Data & Analytics", slug: "data", icon: "bar-chart", job_count: 0 },
  { name: "Education", slug: "education", icon: "graduation-cap", job_count: 0 },
];

const companies = [
  {
    name: "Nomad Labs",
    slug: "nomad-labs",
    description: "Building tools for the location-independent workforce.",
    size: "51-200",
    remote_policy: "Fully Remote",
    headquarters: "San Francisco, CA",
    tech_stack: ["React", "Node.js", "PostgreSQL", "AWS"],
    website: "https://nomadlabs.example.com",
  },
  {
    name: "Wandertech",
    slug: "wandertech",
    description: "AI-powered travel and productivity platform for digital nomads.",
    size: "11-50",
    remote_policy: "Fully Remote",
    headquarters: "Berlin, Germany",
    tech_stack: ["Python", "Django", "React", "GCP"],
    website: "https://wandertech.example.com",
  },
  {
    name: "RemoteFirst Co",
    slug: "remotefirst-co",
    description: "Enterprise SaaS for distributed team management.",
    size: "201-500",
    remote_policy: "Fully Remote",
    headquarters: "London, UK",
    tech_stack: ["TypeScript", "Next.js", "Kubernetes", "AWS"],
    website: "https://remotefirst.example.com",
  },
  {
    name: "Altitude",
    slug: "altitude",
    description: "Cloud infrastructure and DevOps automation platform.",
    size: "51-200",
    remote_policy: "Remote-First",
    headquarters: "Austin, TX",
    tech_stack: ["Go", "Rust", "Terraform", "AWS"],
    website: "https://altitude.example.com",
  },
  {
    name: "Pixel Collective",
    slug: "pixel-collective",
    description: "Creative agency specializing in brand and product design.",
    size: "11-50",
    remote_policy: "Fully Remote",
    headquarters: "Amsterdam, Netherlands",
    tech_stack: ["Figma", "React", "Tailwind CSS", "Framer"],
    website: "https://pixelcollective.example.com",
  },
  {
    name: "DataNomad",
    slug: "datanomad",
    description: "Real-time analytics platform for modern businesses.",
    size: "51-200",
    remote_policy: "Fully Remote",
    headquarters: "Toronto, Canada",
    tech_stack: ["Python", "Spark", "Kafka", "Snowflake"],
    website: "https://datanomad.example.com",
  },
  {
    name: "LearnGlobal",
    slug: "learnglobal",
    description: "EdTech platform connecting students with tutors worldwide.",
    size: "11-50",
    remote_policy: "Fully Remote",
    headquarters: "Lisbon, Portugal",
    tech_stack: ["Ruby on Rails", "React", "PostgreSQL", "Redis"],
    website: "https://learnglobal.example.com",
  },
  {
    name: "Basecamp Digital",
    slug: "basecamp-digital",
    description: "Full-service digital marketing agency for SaaS companies.",
    size: "11-50",
    remote_policy: "Fully Remote",
    headquarters: "Barcelona, Spain",
    tech_stack: ["HubSpot", "Google Analytics", "Webflow"],
    website: "https://basecampdigital.example.com",
  },
];

const jobs = [
  {
    title: "Senior Full-Stack Engineer",
    slug: "senior-full-stack-engineer-nomad-labs",
    company_slug: "nomad-labs",
    category_slug: "engineering",
    description: "<h2>About the Role</h2><p>We're looking for a Senior Full-Stack Engineer to help build our next-generation platform for digital nomads. You'll work on both our React frontend and Node.js backend, shipping features that help thousands of remote workers.</p><h2>Requirements</h2><ul><li>5+ years of experience with React and Node.js</li><li>Strong TypeScript skills</li><li>Experience with PostgreSQL and cloud services</li><li>Comfortable working asynchronously</li></ul><h2>Benefits</h2><ul><li>$140k-$180k salary</li><li>Work from anywhere</li><li>Annual team retreats</li><li>$2,000 home office stipend</li></ul>",
    description_plain: "We're looking for a Senior Full-Stack Engineer to help build our next-generation platform for digital nomads.",
    job_type: "full_time" as const,
    experience_level: "senior" as const,
    salary_min: 140000,
    salary_max: 180000,
    location_requirements: "Worldwide",
    timezone_min: -8,
    timezone_max: 4,
    is_async_friendly: true,
    visa_sponsorship: false,
    tech_stack: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    is_featured: true,
    apply_url: "https://example.com/apply/1",
  },
  {
    title: "Product Designer",
    slug: "product-designer-pixel-collective",
    company_slug: "pixel-collective",
    category_slug: "design",
    description: "<h2>About the Role</h2><p>Join our design team to create beautiful, user-centered products for global clients. You'll own the end-to-end design process from research to high-fidelity prototypes.</p><h2>Requirements</h2><ul><li>3+ years product design experience</li><li>Proficiency in Figma</li><li>Strong portfolio showing mobile and web work</li><li>Experience with design systems</li></ul>",
    description_plain: "Join our design team to create beautiful, user-centered products for global clients.",
    job_type: "full_time" as const,
    experience_level: "mid" as const,
    salary_min: 90000,
    salary_max: 130000,
    location_requirements: "Europe / Americas",
    timezone_min: -5,
    timezone_max: 3,
    is_async_friendly: true,
    visa_sponsorship: false,
    tech_stack: ["Figma", "Framer", "Tailwind CSS", "React"],
    is_featured: true,
    apply_url: "https://example.com/apply/2",
  },
  {
    title: "DevOps Engineer",
    slug: "devops-engineer-altitude",
    company_slug: "altitude",
    category_slug: "engineering",
    description: "<h2>About the Role</h2><p>Help us build and maintain our cloud infrastructure. You'll design CI/CD pipelines, manage Kubernetes clusters, and ensure 99.99% uptime for our customers.</p><h2>Requirements</h2><ul><li>4+ years of DevOps/SRE experience</li><li>Strong Kubernetes and Terraform knowledge</li><li>Experience with AWS or GCP</li><li>Scripting in Go, Python, or Bash</li></ul>",
    description_plain: "Help us build and maintain our cloud infrastructure.",
    job_type: "full_time" as const,
    experience_level: "senior" as const,
    salary_min: 150000,
    salary_max: 190000,
    location_requirements: "Americas",
    timezone_min: -8,
    timezone_max: -3,
    is_async_friendly: false,
    visa_sponsorship: true,
    tech_stack: ["Kubernetes", "Terraform", "Go", "AWS", "Docker"],
    is_featured: false,
    apply_url: "https://example.com/apply/3",
  },
  {
    title: "AI/ML Engineer",
    slug: "ai-ml-engineer-wandertech",
    company_slug: "wandertech",
    category_slug: "engineering",
    description: "<h2>About the Role</h2><p>Build ML models that power our travel recommendation engine. Work with our data team to improve personalization and predictive features.</p><h2>Requirements</h2><ul><li>3+ years ML engineering experience</li><li>Strong Python skills (PyTorch or TensorFlow)</li><li>Experience with NLP and recommendation systems</li><li>Familiarity with MLOps (MLflow, Kubeflow)</li></ul>",
    description_plain: "Build ML models that power our travel recommendation engine.",
    job_type: "full_time" as const,
    experience_level: "mid" as const,
    salary_min: 120000,
    salary_max: 170000,
    location_requirements: "Europe",
    timezone_min: -1,
    timezone_max: 4,
    is_async_friendly: true,
    visa_sponsorship: true,
    tech_stack: ["Python", "PyTorch", "TensorFlow", "GCP", "Kubernetes"],
    is_featured: true,
    apply_url: "https://example.com/apply/4",
  },
  {
    title: "Frontend Engineer",
    slug: "frontend-engineer-remotefirst",
    company_slug: "remotefirst-co",
    category_slug: "engineering",
    description: "<h2>About the Role</h2><p>Join our frontend team to build intuitive interfaces for our distributed team management platform. We use Next.js and TypeScript extensively.</p><h2>Requirements</h2><ul><li>3+ years React/Next.js experience</li><li>TypeScript proficiency</li><li>Experience with design systems</li><li>Interest in accessibility</li></ul>",
    description_plain: "Join our frontend team to build intuitive interfaces for our distributed team management platform.",
    job_type: "full_time" as const,
    experience_level: "mid" as const,
    salary_min: 100000,
    salary_max: 140000,
    location_requirements: "Worldwide",
    timezone_min: -8,
    timezone_max: 8,
    is_async_friendly: true,
    visa_sponsorship: false,
    tech_stack: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    is_featured: false,
    apply_url: "https://example.com/apply/5",
  },
  {
    title: "Content Marketing Manager",
    slug: "content-marketing-manager-basecamp",
    company_slug: "basecamp-digital",
    category_slug: "marketing",
    description: "<h2>About the Role</h2><p>Lead our content strategy for SaaS clients. You'll plan, create, and distribute content across blogs, social media, and email campaigns.</p><h2>Requirements</h2><ul><li>3+ years content marketing experience</li><li>Strong writing skills</li><li>SEO knowledge</li><li>Experience with HubSpot or similar tools</li></ul>",
    description_plain: "Lead our content strategy for SaaS clients.",
    job_type: "full_time" as const,
    experience_level: "mid" as const,
    salary_min: 70000,
    salary_max: 100000,
    location_requirements: "Europe / Americas",
    timezone_min: -6,
    timezone_max: 3,
    is_async_friendly: true,
    visa_sponsorship: false,
    tech_stack: ["HubSpot", "SEO", "Google Analytics", "Webflow"],
    is_featured: false,
    apply_url: "https://example.com/apply/6",
  },
  {
    title: "Data Analyst",
    slug: "data-analyst-datanomad",
    company_slug: "datanomad",
    category_slug: "data",
    description: "<h2>About the Role</h2><p>Transform raw data into actionable insights. Work directly with product and engineering teams to drive data-informed decisions.</p><h2>Requirements</h2><ul><li>2+ years data analysis experience</li><li>Proficient in SQL and Python</li><li>Experience with visualization tools (Looker, Tableau)</li><li>Strong communication skills</li></ul>",
    description_plain: "Transform raw data into actionable insights.",
    job_type: "full_time" as const,
    experience_level: "mid" as const,
    salary_min: 85000,
    salary_max: 120000,
    location_requirements: "Americas",
    timezone_min: -6,
    timezone_max: -3,
    is_async_friendly: false,
    visa_sponsorship: false,
    tech_stack: ["SQL", "Python", "Snowflake", "Looker"],
    is_featured: false,
    apply_url: "https://example.com/apply/7",
  },
  {
    title: "Junior React Developer",
    slug: "junior-react-developer-nomad-labs",
    company_slug: "nomad-labs",
    category_slug: "engineering",
    description: "<h2>About the Role</h2><p>Great opportunity for a junior developer to grow in a remote-first environment. You'll work alongside senior engineers on our React frontend.</p><h2>Requirements</h2><ul><li>1+ years React experience</li><li>Basic TypeScript knowledge</li><li>Eager to learn and grow</li><li>Good communication skills</li></ul>",
    description_plain: "Great opportunity for a junior developer to grow in a remote-first environment.",
    job_type: "full_time" as const,
    experience_level: "junior" as const,
    salary_min: 60000,
    salary_max: 85000,
    location_requirements: "Worldwide",
    timezone_min: -10,
    timezone_max: 10,
    is_async_friendly: true,
    visa_sponsorship: false,
    tech_stack: ["React", "TypeScript", "CSS", "Git"],
    is_featured: false,
    apply_url: "https://example.com/apply/8",
  },
  {
    title: "UX Researcher",
    slug: "ux-researcher-wandertech",
    company_slug: "wandertech",
    category_slug: "design",
    description: "<h2>About the Role</h2><p>Conduct user research to inform our product decisions. You'll run interviews, surveys, and usability tests with our global user base.</p><h2>Requirements</h2><ul><li>2+ years UX research experience</li><li>Experience with qualitative and quantitative methods</li><li>Strong presentation skills</li><li>Familiarity with tools like Maze, Hotjar, or Dovetail</li></ul>",
    description_plain: "Conduct user research to inform our product decisions.",
    job_type: "contract" as const,
    experience_level: "mid" as const,
    salary_min: 75000,
    salary_max: 110000,
    location_requirements: "Europe",
    timezone_min: -1,
    timezone_max: 4,
    is_async_friendly: true,
    visa_sponsorship: false,
    tech_stack: ["Figma", "Maze", "Dovetail", "Notion"],
    is_featured: false,
    apply_url: "https://example.com/apply/9",
  },
  {
    title: "Engineering Manager",
    slug: "engineering-manager-remotefirst",
    company_slug: "remotefirst-co",
    category_slug: "engineering",
    description: "<h2>About the Role</h2><p>Lead a team of 8 engineers building our core platform. You'll balance hands-on technical work with people management and strategic planning.</p><h2>Requirements</h2><ul><li>5+ years engineering experience</li><li>2+ years management experience</li><li>Experience managing remote/distributed teams</li><li>Strong communication and organizational skills</li></ul>",
    description_plain: "Lead a team of 8 engineers building our core platform.",
    job_type: "full_time" as const,
    experience_level: "lead" as const,
    salary_min: 170000,
    salary_max: 220000,
    location_requirements: "Worldwide",
    timezone_min: -8,
    timezone_max: 4,
    is_async_friendly: true,
    visa_sponsorship: true,
    tech_stack: ["TypeScript", "React", "Node.js", "AWS"],
    is_featured: true,
    apply_url: "https://example.com/apply/10",
  },
  {
    title: "Online Tutor — Computer Science",
    slug: "online-tutor-cs-learnglobal",
    company_slug: "learnglobal",
    category_slug: "education",
    description: "<h2>About the Role</h2><p>Teach computer science to students globally through our online platform. Flexible hours, work from anywhere.</p><h2>Requirements</h2><ul><li>CS degree or equivalent experience</li><li>Teaching or mentoring experience</li><li>Strong English communication</li><li>Reliable internet connection</li></ul>",
    description_plain: "Teach computer science to students globally through our online platform.",
    job_type: "part_time" as const,
    experience_level: "mid" as const,
    salary_min: 40000,
    salary_max: 65000,
    location_requirements: "Worldwide",
    timezone_min: -10,
    timezone_max: 10,
    is_async_friendly: false,
    visa_sponsorship: false,
    tech_stack: ["Python", "JavaScript", "Teaching"],
    is_featured: false,
    apply_url: "https://example.com/apply/11",
  },
  {
    title: "Technical Writer",
    slug: "technical-writer-altitude",
    company_slug: "altitude",
    category_slug: "writing",
    description: "<h2>About the Role</h2><p>Create clear, comprehensive documentation for our cloud platform. API docs, tutorials, and guides for DevOps engineers.</p><h2>Requirements</h2><ul><li>2+ years technical writing experience</li><li>Understanding of cloud infrastructure concepts</li><li>Experience with docs-as-code tools</li><li>Ability to explain complex topics simply</li></ul>",
    description_plain: "Create clear, comprehensive documentation for our cloud platform.",
    job_type: "contract" as const,
    experience_level: "mid" as const,
    salary_min: 70000,
    salary_max: 95000,
    location_requirements: "Americas",
    timezone_min: -8,
    timezone_max: -3,
    is_async_friendly: true,
    visa_sponsorship: false,
    tech_stack: ["Markdown", "Git", "API Documentation"],
    is_featured: false,
    apply_url: "https://example.com/apply/12",
  },
  {
    title: "Customer Success Lead",
    slug: "customer-success-lead-remotefirst",
    company_slug: "remotefirst-co",
    category_slug: "support",
    description: "<h2>About the Role</h2><p>Own the post-sale customer journey. Help enterprise clients get the most from our platform through onboarding, training, and strategic guidance.</p><h2>Requirements</h2><ul><li>3+ years customer success experience in SaaS</li><li>Excellent communication skills</li><li>Experience with enterprise clients</li><li>Comfort with data analysis</li></ul>",
    description_plain: "Own the post-sale customer journey for enterprise clients.",
    job_type: "full_time" as const,
    experience_level: "senior" as const,
    salary_min: 95000,
    salary_max: 130000,
    location_requirements: "Europe / Americas",
    timezone_min: -6,
    timezone_max: 3,
    is_async_friendly: false,
    visa_sponsorship: false,
    tech_stack: ["Salesforce", "Intercom", "SQL"],
    is_featured: false,
    apply_url: "https://example.com/apply/13",
  },
  {
    title: "Product Manager",
    slug: "product-manager-datanomad",
    company_slug: "datanomad",
    category_slug: "product",
    description: "<h2>About the Role</h2><p>Define and drive the product roadmap for our analytics platform. Work cross-functionally with engineering, design, and sales.</p><h2>Requirements</h2><ul><li>4+ years product management experience</li><li>Data/analytics domain knowledge</li><li>Strong analytical mindset</li><li>Experience with agile methodologies</li></ul>",
    description_plain: "Define and drive the product roadmap for our analytics platform.",
    job_type: "full_time" as const,
    experience_level: "senior" as const,
    salary_min: 130000,
    salary_max: 170000,
    location_requirements: "Americas / Europe",
    timezone_min: -6,
    timezone_max: 3,
    is_async_friendly: true,
    visa_sponsorship: true,
    tech_stack: ["SQL", "Analytics", "Jira", "Figma"],
    is_featured: true,
    apply_url: "https://example.com/apply/14",
  },
  {
    title: "Freelance Brand Designer",
    slug: "freelance-brand-designer-pixel",
    company_slug: "pixel-collective",
    category_slug: "design",
    description: "<h2>About the Role</h2><p>Work on branding projects for our diverse client portfolio. Create visual identities, brand guidelines, and marketing collateral.</p><h2>Requirements</h2><ul><li>3+ years brand design experience</li><li>Strong portfolio</li><li>Proficiency in Illustrator and Figma</li><li>Ability to work independently</li></ul>",
    description_plain: "Work on branding projects for our diverse client portfolio.",
    job_type: "freelance" as const,
    experience_level: "mid" as const,
    salary_min: 60000,
    salary_max: 90000,
    location_requirements: "Worldwide",
    timezone_min: -10,
    timezone_max: 10,
    is_async_friendly: true,
    visa_sponsorship: false,
    tech_stack: ["Figma", "Illustrator", "Photoshop", "InDesign"],
    is_featured: false,
    apply_url: "https://example.com/apply/15",
  },
];

const costOfLiving = [
  { country: "Thailand", country_code: "TH", city: "Bangkok", col_index: 35, avg_monthly_cost_usd: 1100, nomad_score: 4.5, internet_speed_mbps: 200, safety_index: 72 },
  { country: "Thailand", country_code: "TH", city: "Chiang Mai", col_index: 28, avg_monthly_cost_usd: 850, nomad_score: 4.7, internet_speed_mbps: 120, safety_index: 80 },
  { country: "Portugal", country_code: "PT", city: "Lisbon", col_index: 52, avg_monthly_cost_usd: 1800, nomad_score: 4.6, internet_speed_mbps: 150, safety_index: 85 },
  { country: "Colombia", country_code: "CO", city: "Medellín", col_index: 30, avg_monthly_cost_usd: 1000, nomad_score: 4.3, internet_speed_mbps: 80, safety_index: 55 },
  { country: "Mexico", country_code: "MX", city: "Mexico City", col_index: 35, avg_monthly_cost_usd: 1200, nomad_score: 4.4, internet_speed_mbps: 100, safety_index: 50 },
  { country: "Indonesia", country_code: "ID", city: "Bali", col_index: 32, avg_monthly_cost_usd: 1100, nomad_score: 4.5, internet_speed_mbps: 50, safety_index: 75 },
  { country: "Georgia", country_code: "GE", city: "Tbilisi", col_index: 28, avg_monthly_cost_usd: 800, nomad_score: 4.4, internet_speed_mbps: 60, safety_index: 78 },
  { country: "Vietnam", country_code: "VN", city: "Ho Chi Minh City", col_index: 28, avg_monthly_cost_usd: 850, nomad_score: 4.2, internet_speed_mbps: 80, safety_index: 70 },
  { country: "Spain", country_code: "ES", city: "Barcelona", col_index: 60, avg_monthly_cost_usd: 2000, nomad_score: 4.5, internet_speed_mbps: 200, safety_index: 78 },
  { country: "Germany", country_code: "DE", city: "Berlin", col_index: 65, avg_monthly_cost_usd: 2200, nomad_score: 4.3, internet_speed_mbps: 100, safety_index: 82 },
  { country: "Croatia", country_code: "HR", city: "Split", col_index: 42, avg_monthly_cost_usd: 1400, nomad_score: 4.1, internet_speed_mbps: 80, safety_index: 85 },
  { country: "Turkey", country_code: "TR", city: "Istanbul", col_index: 30, avg_monthly_cost_usd: 900, nomad_score: 4.0, internet_speed_mbps: 60, safety_index: 60 },
  { country: "Argentina", country_code: "AR", city: "Buenos Aires", col_index: 28, avg_monthly_cost_usd: 900, nomad_score: 4.2, internet_speed_mbps: 60, safety_index: 55 },
  { country: "Czech Republic", country_code: "CZ", city: "Prague", col_index: 50, avg_monthly_cost_usd: 1700, nomad_score: 4.3, internet_speed_mbps: 150, safety_index: 88 },
  { country: "Estonia", country_code: "EE", city: "Tallinn", col_index: 50, avg_monthly_cost_usd: 1600, nomad_score: 4.4, internet_speed_mbps: 200, safety_index: 90 },
  { country: "Brazil", country_code: "BR", city: "Florianópolis", col_index: 32, avg_monthly_cost_usd: 1000, nomad_score: 4.0, internet_speed_mbps: 100, safety_index: 50 },
  { country: "Malaysia", country_code: "MY", city: "Kuala Lumpur", col_index: 30, avg_monthly_cost_usd: 900, nomad_score: 4.3, internet_speed_mbps: 100, safety_index: 72 },
  { country: "Romania", country_code: "RO", city: "Bucharest", col_index: 38, avg_monthly_cost_usd: 1200, nomad_score: 4.0, internet_speed_mbps: 300, safety_index: 80 },
  { country: "South Korea", country_code: "KR", city: "Seoul", col_index: 60, avg_monthly_cost_usd: 1800, nomad_score: 4.1, internet_speed_mbps: 300, safety_index: 88 },
  { country: "Japan", country_code: "JP", city: "Tokyo", col_index: 70, avg_monthly_cost_usd: 2200, nomad_score: 3.8, internet_speed_mbps: 200, safety_index: 95 },
  { country: "United States", country_code: "US", city: "New York City", col_index: 100, avg_monthly_cost_usd: 4000, nomad_score: 3.5, internet_speed_mbps: 300, safety_index: 65 },
  { country: "United Kingdom", country_code: "GB", city: "London", col_index: 90, avg_monthly_cost_usd: 3500, nomad_score: 3.7, internet_speed_mbps: 200, safety_index: 70 },
  { country: "Canada", country_code: "CA", city: "Toronto", col_index: 75, avg_monthly_cost_usd: 2800, nomad_score: 3.9, internet_speed_mbps: 150, safety_index: 80 },
  { country: "Philippines", country_code: "PH", city: "Manila", col_index: 25, avg_monthly_cost_usd: 750, nomad_score: 3.8, internet_speed_mbps: 50, safety_index: 55 },
  { country: "Morocco", country_code: "MA", city: "Marrakech", col_index: 28, avg_monthly_cost_usd: 800, nomad_score: 3.7, internet_speed_mbps: 30, safety_index: 65 },
  { country: "Peru", country_code: "PE", city: "Lima", col_index: 32, avg_monthly_cost_usd: 1000, nomad_score: 3.8, internet_speed_mbps: 60, safety_index: 50 },
  { country: "Hungary", country_code: "HU", city: "Budapest", col_index: 45, avg_monthly_cost_usd: 1500, nomad_score: 4.2, internet_speed_mbps: 200, safety_index: 82 },
  { country: "Poland", country_code: "PL", city: "Warsaw", col_index: 45, avg_monthly_cost_usd: 1500, nomad_score: 4.1, internet_speed_mbps: 200, safety_index: 85 },
  { country: "Sri Lanka", country_code: "LK", city: "Colombo", col_index: 22, avg_monthly_cost_usd: 650, nomad_score: 3.5, internet_speed_mbps: 30, safety_index: 60 },
  { country: "Montenegro", country_code: "ME", city: "Podgorica", col_index: 35, avg_monthly_cost_usd: 1100, nomad_score: 3.6, internet_speed_mbps: 50, safety_index: 80 },
];

async function seed() {
  console.log("Seeding database...\n");

  // 1. Insert categories
  console.log("Inserting categories...");
  const { data: insertedCategories, error: catError } = await supabase
    .from("categories")
    .upsert(categories, { onConflict: "slug" })
    .select();

  if (catError) {
    console.error("Category insert error:", catError);
    process.exit(1);
  }
  console.log(`  ✓ ${insertedCategories.length} categories`);

  // 2. Insert companies
  console.log("Inserting companies...");
  const { data: insertedCompanies, error: compError } = await supabase
    .from("companies")
    .upsert(companies, { onConflict: "slug" })
    .select();

  if (compError) {
    console.error("Company insert error:", compError);
    process.exit(1);
  }
  console.log(`  ✓ ${insertedCompanies.length} companies`);

  // 3. Insert jobs
  console.log("Inserting jobs...");
  const categoryMap = new Map(insertedCategories.map((c: { slug: string; id: string }) => [c.slug, c.id]));
  const companyMap = new Map(insertedCompanies.map((c: { slug: string; id: string }) => [c.slug, c.id]));

  const jobRows = jobs.map(({ company_slug, category_slug, ...job }) => ({
    ...job,
    company_id: companyMap.get(company_slug),
    category_id: categoryMap.get(category_slug),
    source: "manual" as const,
    source_id: job.slug,
    date_posted: new Date(
      Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));

  const { data: insertedJobs, error: jobError } = await supabase
    .from("jobs")
    .upsert(jobRows, { onConflict: "slug" })
    .select();

  if (jobError) {
    console.error("Job insert error:", jobError);
    process.exit(1);
  }
  console.log(`  ✓ ${insertedJobs.length} jobs`);

  // 4. Insert cost of living
  console.log("Inserting cost of living data...");
  const { data: insertedCol, error: colError } = await supabase
    .from("cost_of_living")
    .upsert(costOfLiving, { onConflict: "city,country_code" })
    .select();

  if (colError) {
    console.error("COL insert error:", colError);
    process.exit(1);
  }
  console.log(`  ✓ ${insertedCol.length} cities`);

  // 5. Update category counts
  console.log("Updating category counts...");
  for (const cat of insertedCategories) {
    const count = jobRows.filter(
      (j) => j.category_id === cat.id
    ).length;
    await supabase
      .from("categories")
      .update({ job_count: count })
      .eq("id", cat.id);
  }
  console.log("  ✓ Category counts updated");

  console.log("\nSeed complete!");
}

seed().catch(console.error);
