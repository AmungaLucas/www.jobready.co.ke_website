import { siteConfig } from "./site-config";

export const hubConfig = [
  // === JOB HUBS ===
  {
    slug: "technology",
    name: "Technology & IT Jobs in Kenya",
    type: "job",
    icon: "Monitor",
    description:
      "Browse 200+ technology, software development, data science & IT jobs in Kenya. Updated daily.",
    metaTitle: `Technology & IT Jobs in Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Software, Data, Cybersecurity & more",
    filters: { category: "TECHNOLOGY", jobType: null, location: null },
  },
  {
    slug: "finance-accounting",
    name: "Finance & Accounting Jobs in Kenya",
    type: "job",
    icon: "Calculator",
    description:
      "Find banking, accounting, audit, financial analysis & insurance jobs in Kenya.",
    metaTitle: `Finance & Accounting Jobs Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Banking, Audit, Tax & Financial Services",
    filters: { category: "FINANCE_ACCOUNTING" },
  },
  {
    slug: "engineering",
    name: "Engineering Jobs in Kenya",
    type: "job",
    icon: "Wrench",
    description:
      "Civil, mechanical, electrical, chemical & biomedical engineering jobs across Kenya.",
    metaTitle: `Engineering Jobs in Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Civil, Mechanical, Electrical & more",
    filters: { category: "ENGINEERING" },
  },
  {
    slug: "healthcare",
    name: "Healthcare & Medical Jobs in Kenya",
    type: "job",
    icon: "Heart",
    description:
      "Nursing, pharmacy, medical doctor, lab technology & public health jobs in Kenya.",
    metaTitle: `Healthcare & Medical Jobs Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Nursing, Pharmacy, Clinical & Public Health",
    filters: { category: "HEALTHCARE" },
  },
  {
    slug: "education",
    name: "Education & Training Jobs in Kenya",
    type: "job",
    icon: "GraduationCap",
    description:
      "Teaching, lecturing, curriculum development & educational administration jobs in Kenya.",
    metaTitle: `Education & Teaching Jobs Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Teaching, Lecturing & Training",
    filters: { category: "EDUCATION" },
  },
  {
    slug: "sales-marketing",
    name: "Sales & Marketing Jobs in Kenya",
    type: "job",
    icon: "TrendingUp",
    description:
      "Business development, digital marketing, sales, PR & brand management jobs in Kenya.",
    metaTitle: `Sales & Marketing Jobs Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Business Dev, Digital Marketing & Sales",
    filters: { category: "MARKETING_COMMUNICATIONS" },
  },
  {
    slug: "government",
    name: "Government Jobs in Kenya",
    type: "job",
    icon: "Landmark",
    description:
      "Latest government of Kenya jobs, county government & public service commission vacancies.",
    metaTitle: `Government Jobs in Kenya 2026 — GoK Vacancies | ${siteConfig.shortName}`,
    heroSubtitle: "National Government, County & Parastatals",
    filters: { category: "GOVERNMENT_PUBLIC_SECTOR" },
  },
  {
    slug: "internships",
    name: "Internships in Kenya",
    type: "job",
    icon: "UserPlus",
    description:
      "Find paid & unpaid internships across Kenya. Build your career with top companies.",
    metaTitle: `Internships in Kenya 2026 — Latest Opportunities | ${siteConfig.shortName}`,
    heroSubtitle: "Kickstart your career with hands-on experience",
    filters: { jobType: "INTERNSHIP" },
  },
  {
    slug: "part-time",
    name: "Part-Time Jobs in Kenya",
    type: "job",
    icon: "Clock",
    description:
      "Browse part-time, freelance & flexible jobs in Kenya. Perfect for students & side hustles.",
    metaTitle: `Part-Time Jobs in Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Flexible work that fits your schedule",
    filters: { jobType: "PART_TIME" },
  },
  {
    slug: "remote",
    name: "Remote Jobs in Kenya",
    type: "job",
    icon: "Globe",
    description:
      "Work from anywhere. Browse remote jobs available to Kenyan professionals.",
    metaTitle: `Remote Jobs for Kenyans 2026 — Work From Home | ${siteConfig.shortName}`,
    heroSubtitle: "Work from anywhere in Kenya",
    filters: { isRemote: true },
  },
  {
    slug: "nairobi",
    name: "Jobs in Nairobi",
    type: "job",
    icon: "MapPin",
    description:
      "Latest jobs in Nairobi city and surrounding areas. Updated daily.",
    metaTitle: `Jobs in Nairobi 2026 — Latest Vacancies | ${siteConfig.shortName}`,
    heroSubtitle: "Westlands, CBD, Kilimani & more",
    filters: { location: "Nairobi" },
  },
  {
    slug: "mombasa",
    name: "Jobs in Mombasa",
    type: "job",
    icon: "MapPin",
    description:
      "Find jobs in Mombasa — hospitality, logistics, tourism & more.",
    metaTitle: `Jobs in Mombasa 2026 — Latest Vacancies | ${siteConfig.shortName}`,
    heroSubtitle: "Coast region's top opportunities",
    filters: { location: "Mombasa" },
  },
  {
    slug: "kisumu",
    name: "Jobs in Kisumu",
    type: "job",
    icon: "MapPin",
    description:
      "Browse jobs in Kisumu and the greater Lake Victoria region.",
    metaTitle: `Jobs in Kisumu 2026 — Latest Vacancies | ${siteConfig.shortName}`,
    heroSubtitle: "Western Kenya's growing job market",
    filters: { location: "Kisumu" },
  },
  {
    slug: "nakuru",
    name: "Jobs in Nakuru",
    type: "job",
    icon: "MapPin",
    description:
      "Latest jobs in Nakuru county — manufacturing, agriculture & services.",
    metaTitle: `Jobs in Nakuru 2026 — Latest Vacancies | ${siteConfig.shortName}`,
    heroSubtitle: "Rift Valley opportunities",
    filters: { location: "Nakuru" },
  },
  {
    slug: "entry-level",
    name: "Entry Level Jobs in Kenya",
    type: "job",
    icon: "Rocket",
    description:
      "No experience needed. Browse entry-level positions and graduate trainee programs in Kenya.",
    metaTitle: `Entry Level Jobs in Kenya 2026 — No Experience | ${siteConfig.shortName}`,
    heroSubtitle: "Start your career journey today",
    filters: { experienceLevel: "ENTRY_LEVEL" },
  },
  {
    slug: "management",
    name: "Management & Executive Jobs in Kenya",
    type: "job",
    icon: "Briefcase",
    description:
      "Senior management, C-suite, director & executive positions across Kenya.",
    metaTitle: `Management & Executive Jobs Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "C-Suite, Directors & Senior Leadership",
    filters: { experienceLevel: "SENIOR" },
  },
  {
    slug: "ngo",
    name: "NGO & International Organization Jobs in Kenya",
    type: "job",
    icon: "Globe",
    description:
      "UN, USAID, World Bank & NGO jobs in Kenya. Development, humanitarian & charity roles.",
    metaTitle: `NGO Jobs in Kenya 2026 — UN, USAID & Development | ${siteConfig.shortName}`,
    heroSubtitle: "UN Agencies, International NGOs & Development",
    filters: { category: "NONPROFIT" },
  },
  {
    slug: "human-resources",
    name: "Human Resources Jobs in Kenya",
    type: "job",
    icon: "Users",
    description:
      "HR, recruitment, talent management & training jobs across Kenya.",
    metaTitle: `Human Resources Jobs Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Recruitment, Talent & People Management",
    filters: { category: "HUMAN_RESOURCES" },
  },
  {
    slug: "creative-design",
    name: "Creative & Design Jobs in Kenya",
    type: "job",
    icon: "Palette",
    description:
      "Graphic design, UX/UI, video editing, animation & content creation jobs in Kenya.",
    metaTitle: `Creative & Design Jobs Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Graphic Design, UX/UI, Video & Content",
    filters: { category: "CREATIVE_DESIGN" },
  },
  {
    slug: "legal",
    name: "Legal & Compliance Jobs in Kenya",
    type: "job",
    icon: "Scale",
    description:
      "Lawyers, paralegals, compliance officers & legal advisors jobs in Kenya.",
    metaTitle: `Legal & Compliance Jobs Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Corporate Law, Compliance & Advisory",
    filters: { category: "LEGAL" },
  },
  {
    slug: "logistics",
    name: "Logistics & Supply Chain Jobs in Kenya",
    type: "job",
    icon: "Truck",
    description:
      "Procurement, warehousing, transport & supply chain management jobs in Kenya.",
    metaTitle: `Logistics & Supply Chain Jobs Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Procurement, Warehousing & Transport",
    filters: { category: "SUPPLY_CHAIN" },
  },
  {
    slug: "customer-service",
    name: "Customer Service Jobs in Kenya",
    type: "job",
    icon: "Headphones",
    description:
      "Call center, customer support, helpdesk & customer success jobs in Kenya.",
    metaTitle: `Customer Service Jobs Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Call Center, Support & Client Relations",
    filters: { category: "CUSTOMER_SERVICE" },
  },
  {
    slug: "consulting",
    name: "Consulting Jobs in Kenya",
    type: "job",
    icon: "Lightbulb",
    description:
      "Management consulting, strategy, IT consulting & advisory jobs in Kenya.",
    metaTitle: `Consulting Jobs Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Strategy, Management & Advisory",
    filters: { category: "CONSULTING" },
  },

  // === OPPORTUNITY HUBS ===
  {
    slug: "scholarships",
    name: "Scholarships for Kenyans 2026",
    type: "opportunity",
    icon: "Award",
    description:
      "Latest scholarships for Kenyan students — undergraduate, masters & PhD funding opportunities.",
    metaTitle: `Scholarships for Kenyans 2026 — Fully Funded | ${siteConfig.shortName}`,
    heroSubtitle: "Undergraduate, Masters & PhD Funding",
    filters: { opportunityType: "SCHOLARSHIP" },
  },
  {
    slug: "grants",
    name: "Grants & Funding in Kenya 2026",
    type: "opportunity",
    icon: "Banknote",
    description:
      "Business grants, research funding, innovation grants & community development grants in Kenya.",
    metaTitle: `Grants & Funding Opportunities in Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Business, Research & Community Grants",
    filters: { opportunityType: "GRANT" },
  },
  {
    slug: "fellowships",
    name: "Fellowships in Kenya & Abroad",
    type: "opportunity",
    icon: "Star",
    description:
      "Professional fellowships, leadership programs & international exchange opportunities.",
    metaTitle: `Fellowships for Kenyans 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Leadership, Professional & Exchange Programs",
    filters: { opportunityType: "FELLOWSHIP" },
  },
  {
    slug: "bursaries",
    name: "Bursaries in Kenya 2026",
    type: "opportunity",
    icon: "BookOpen",
    description:
      "County government bursaries, university bursaries & education financial aid in Kenya.",
    metaTitle: `Bursaries in Kenya 2026 — County & University | ${siteConfig.shortName}`,
    heroSubtitle: "County, University & Education Bursaries",
    filters: { opportunityType: "BURSARY" },
  },
  {
    slug: "competitions",
    name: "Competitions & Awards in Kenya",
    type: "opportunity",
    icon: "Trophy",
    description:
      "Hackathons, business pitch competitions, essay contests & innovation challenges.",
    metaTitle: `Competitions & Awards in Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Hackathons, Pitch Contests & Innovation",
    filters: { opportunityType: "COMPETITION" },
  },
  {
    slug: "conferences",
    name: "Conferences & Events in Kenya",
    type: "opportunity",
    icon: "Calendar",
    description:
      "Tech conferences, career fairs, networking events & workshops in Kenya.",
    metaTitle: `Conferences & Career Events in Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Tech Summits, Career Fairs & Workshops",
    filters: { opportunityType: "CONFERENCE" },
  },
  {
    slug: "volunteer",
    name: "Volunteer Opportunities in Kenya",
    type: "opportunity",
    icon: "HeartHandshake",
    description:
      "Volunteer programs, community service & social impact opportunities in Kenya.",
    metaTitle: `Volunteer Opportunities in Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Community Service & Social Impact",
    filters: { opportunityType: "VOLUNTEER" },
  },
  {
    slug: "apprenticeships",
    name: "Apprenticeships in Kenya",
    type: "opportunity",
    icon: "HardHat",
    description:
      "Skilled trades apprenticeships — electrical, plumbing, welding, carpentry & more.",
    metaTitle: `Apprenticeships in Kenya 2026 | ${siteConfig.shortName}`,
    heroSubtitle: "Skilled Trades & Hands-On Training",
    filters: { opportunityType: "APPRENTICESHIP" },
  },
];

// Helper to find a hub by slug
export function getHubBySlug(slug) {
  return hubConfig.find((h) => h.slug === slug) || null;
}

// Helper to get job hubs only
export function getJobHubs() {
  return hubConfig.filter((h) => h.type === "job");
}

// Helper to get opportunity hubs only
export function getOpportunityHubs() {
  return hubConfig.filter((h) => h.type === "opportunity");
}
