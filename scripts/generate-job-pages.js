#!/usr/bin/env node

/**
 * generate-job-pages.js
 *
 * Generates ALL job filter page files that use the shared JobFilterView component.
 * Run: node scripts/generate-job-pages.js
 */

const fs = require("fs");
const path = require("path");

const BASE_DIR = path.join(__dirname, "..", "src", "app", "(website)", "jobs");

// ─── Page Definitions ────────────────────────────────────────────────────────

const employmentTypePages = [
  {
    dir: "full-time",
    filterKey: "employmentType",
    filterValue: "FULL_TIME",
    pageTitle: "Full Time Jobs in Kenya",
    breadcrumbName: "Full Time",
    searchPlaceholder: "Search full time jobs...",
    emptyTitle: "No full time jobs found",
    emptyDescription: "No full time positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "💼",
    sidebarTitle: "Career Growth",
    sidebarDescription: "A professional CV opens doors to better opportunities. Let our experts craft yours.",
  },
  {
    dir: "part-time",
    filterKey: "employmentType",
    filterValue: "PART_TIME",
    pageTitle: "Part Time Jobs in Kenya",
    breadcrumbName: "Part Time",
    searchPlaceholder: "Search part time jobs...",
    emptyTitle: "No part time jobs found",
    emptyDescription: "No part time positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "⏰",
    sidebarTitle: "Flexible Work",
    sidebarDescription: "Balance work and life with a polished CV that highlights your versatility and reliability.",
  },
  {
    dir: "contract",
    filterKey: "employmentType",
    filterValue: "CONTRACT",
    pageTitle: "Contract Jobs in Kenya",
    breadcrumbName: "Contract",
    searchPlaceholder: "Search contract jobs...",
    emptyTitle: "No contract jobs found",
    emptyDescription: "No contract positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📋",
    sidebarTitle: "Contract Opportunities",
    sidebarDescription: "Contract roles often lead to permanent positions. A strong CV helps you convert them.",
  },
  {
    dir: "volunteer",
    filterKey: "employmentType",
    filterValue: "VOLUNTEER",
    pageTitle: "Volunteer Jobs in Kenya",
    breadcrumbName: "Volunteer",
    searchPlaceholder: "Search volunteer jobs...",
    emptyTitle: "No volunteer jobs found",
    emptyDescription: "No volunteer positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🤝",
    sidebarTitle: "Make a Difference",
    sidebarDescription: "Volunteering builds your experience. Highlight your impact with a professional CV.",
  },
];

const experienceLevelPages = [
  {
    dir: "mid-level",
    filterKey: "experienceLevel",
    filterValue: "MID_LEVEL",
    pageTitle: "Mid Level Jobs in Kenya",
    breadcrumbName: "Mid Level",
    searchPlaceholder: "Search mid level jobs...",
    emptyTitle: "No mid level jobs found",
    emptyDescription: "No mid level positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📈",
    sidebarTitle: "Level Up Your Career",
    sidebarDescription: "Mid-level roles demand a results-driven CV. Let our experts showcase your achievements.",
  },
  {
    dir: "senior",
    filterKey: "experienceLevel",
    filterValue: "SENIOR",
    pageTitle: "Senior Jobs in Kenya",
    breadcrumbName: "Senior",
    searchPlaceholder: "Search senior jobs...",
    emptyTitle: "No senior jobs found",
    emptyDescription: "No senior positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏆",
    sidebarTitle: "Senior Leadership",
    sidebarDescription: "Your experience deserves a world-class CV. Stand out with a professionally crafted resume.",
  },
  {
    dir: "lead",
    filterKey: "experienceLevel",
    filterValue: "LEAD",
    pageTitle: "Lead Jobs in Kenya",
    breadcrumbName: "Lead",
    searchPlaceholder: "Search lead jobs...",
    emptyTitle: "No lead jobs found",
    emptyDescription: "No lead positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🎯",
    sidebarTitle: "Lead With Impact",
    sidebarDescription: "Lead roles require a CV that demonstrates vision and results. Get yours done right.",
  },
  {
    dir: "manager",
    filterKey: "experienceLevel",
    filterValue: "MANAGER",
    pageTitle: "Manager Jobs in Kenya",
    breadcrumbName: "Manager",
    searchPlaceholder: "Search manager jobs...",
    emptyTitle: "No manager jobs found",
    emptyDescription: "No manager positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "👔",
    sidebarTitle: "Management Roles",
    sidebarDescription: "Managers need CVs that show leadership and impact. Let our experts tell your story.",
  },
  {
    dir: "director",
    filterKey: "experienceLevel",
    filterValue: "DIRECTOR",
    pageTitle: "Director Jobs in Kenya",
    breadcrumbName: "Director",
    searchPlaceholder: "Search director jobs...",
    emptyTitle: "No director jobs found",
    emptyDescription: "No director positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏛️",
    sidebarTitle: "Executive Positions",
    sidebarDescription: "Director-level roles demand an executive CV. Stand out with our premium CV writing service.",
  },
  {
    dir: "executive",
    filterKey: "experienceLevel",
    filterValue: "EXECUTIVE",
    pageTitle: "Executive Jobs in Kenya",
    breadcrumbName: "Executive",
    searchPlaceholder: "Search executive jobs...",
    emptyTitle: "No executive jobs found",
    emptyDescription: "No executive positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "⭐",
    sidebarTitle: "C-Suite Ready",
    sidebarDescription: "Executive roles require strategic CVs. Our experts craft resumes that command attention.",
  },
];

const categoryPages = [
  {
    dir: "technology",
    filterKey: "category",
    filterValue: "TECHNOLOGY",
    pageTitle: "Technology & IT Jobs in Kenya",
    breadcrumbName: "Technology & IT",
    searchPlaceholder: "Search technology & IT jobs...",
    emptyTitle: "No technology & IT jobs found",
    emptyDescription: "No technology positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "💻",
    sidebarTitle: "Tech Talent",
    sidebarDescription: "Tech employers look for skills-first CVs. Get a modern, ATS-friendly resume from our experts.",
  },
  {
    dir: "finance-accounting",
    filterKey: "category",
    filterValue: "FINANCE_ACCOUNTING",
    pageTitle: "Finance & Accounting Jobs in Kenya",
    breadcrumbName: "Finance & Accounting",
    searchPlaceholder: "Search finance & accounting jobs...",
    emptyTitle: "No finance & accounting jobs found",
    emptyDescription: "No finance positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "💰",
    sidebarTitle: "Finance Careers",
    sidebarDescription: "Finance CVs must highlight precision and results. Let our experts craft yours.",
  },
  {
    dir: "sales-business",
    filterKey: "category",
    filterValue: "SALES_BUSINESS",
    pageTitle: "Sales & Business Development Jobs in Kenya",
    breadcrumbName: "Sales & Business Dev",
    searchPlaceholder: "Search sales & business development jobs...",
    emptyTitle: "No sales & business development jobs found",
    emptyDescription: "No sales positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📊",
    sidebarTitle: "Sales Excellence",
    sidebarDescription: "Sales CVs need numbers that impress. Let our experts highlight your achievements.",
  },
  {
    dir: "marketing-communications",
    filterKey: "category",
    filterValue: "MARKETING_COMMUNICATIONS",
    pageTitle: "Marketing & Communications Jobs in Kenya",
    breadcrumbName: "Marketing & Comms",
    searchPlaceholder: "Search marketing & communications jobs...",
    emptyTitle: "No marketing & communications jobs found",
    emptyDescription: "No marketing positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📣",
    sidebarTitle: "Marketing Careers",
    sidebarDescription: "Marketing CVs must showcase creativity and ROI. Stand out with a professionally designed resume.",
  },
  {
    dir: "human-resources",
    filterKey: "category",
    filterValue: "HUMAN_RESOURCES",
    pageTitle: "Human Resources Jobs in Kenya",
    breadcrumbName: "Human Resources",
    searchPlaceholder: "Search human resources jobs...",
    emptyTitle: "No human resources jobs found",
    emptyDescription: "No HR positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "👥",
    sidebarTitle: "HR Careers",
    sidebarDescription: "HR professionals need CVs that reflect their people skills and strategic thinking.",
  },
  {
    dir: "engineering",
    filterKey: "category",
    filterValue: "ENGINEERING",
    pageTitle: "Engineering Jobs in Kenya",
    breadcrumbName: "Engineering",
    searchPlaceholder: "Search engineering jobs...",
    emptyTitle: "No engineering jobs found",
    emptyDescription: "No engineering positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "⚙️",
    sidebarTitle: "Engineering Careers",
    sidebarDescription: "Engineering CVs must detail projects and technical expertise. Get yours done right.",
  },
  {
    dir: "healthcare",
    filterKey: "category",
    filterValue: "HEALTHCARE",
    pageTitle: "Healthcare & Medical Jobs in Kenya",
    breadcrumbName: "Healthcare & Medical",
    searchPlaceholder: "Search healthcare & medical jobs...",
    emptyTitle: "No healthcare & medical jobs found",
    emptyDescription: "No healthcare positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏥",
    sidebarTitle: "Healthcare Careers",
    sidebarDescription: "Healthcare CVs need to highlight certifications and patient care. Let our experts help.",
  },
  {
    dir: "education-training",
    filterKey: "category",
    filterValue: "EDUCATION",
    pageTitle: "Education & Training Jobs in Kenya",
    breadcrumbName: "Education & Training",
    searchPlaceholder: "Search education & training jobs...",
    emptyTitle: "No education & training jobs found",
    emptyDescription: "No education positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📚",
    sidebarTitle: "Education Careers",
    sidebarDescription: "Education CVs should highlight qualifications and teaching impact. Get yours crafted by experts.",
  },
  {
    dir: "operations-admin",
    filterKey: "category",
    filterValue: "OPERATIONS_ADMIN",
    pageTitle: "Operations & Administration Jobs in Kenya",
    breadcrumbName: "Operations & Admin",
    searchPlaceholder: "Search operations & admin jobs...",
    emptyTitle: "No operations & admin jobs found",
    emptyDescription: "No operations positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📁",
    sidebarTitle: "Operations Careers",
    sidebarDescription: "Operations CVs must show efficiency and organizational skills. Let our experts help.",
  },
  {
    dir: "logistics-supply-chain",
    filterKey: "category",
    filterValue: "SUPPLY_CHAIN",
    pageTitle: "Logistics & Supply Chain Jobs in Kenya",
    breadcrumbName: "Logistics & Supply Chain",
    searchPlaceholder: "Search logistics & supply chain jobs...",
    emptyTitle: "No logistics & supply chain jobs found",
    emptyDescription: "No logistics positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🚛",
    sidebarTitle: "Logistics Careers",
    sidebarDescription: "Supply chain CVs should highlight process optimization. Get yours done right.",
  },
  {
    dir: "hospitality-tourism",
    filterKey: "category",
    filterValue: "HOSPITALITY",
    pageTitle: "Hospitality & Tourism Jobs in Kenya",
    breadcrumbName: "Hospitality & Tourism",
    searchPlaceholder: "Search hospitality & tourism jobs...",
    emptyTitle: "No hospitality & tourism jobs found",
    emptyDescription: "No hospitality positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏨",
    sidebarTitle: "Hospitality Careers",
    sidebarDescription: "Hospitality CVs need to showcase customer service excellence. Get yours crafted today.",
  },
  {
    dir: "agriculture",
    filterKey: "category",
    filterValue: "AGRICULTURE",
    pageTitle: "Agriculture & Agribusiness Jobs in Kenya",
    breadcrumbName: "Agriculture & Agribusiness",
    searchPlaceholder: "Search agriculture & agribusiness jobs...",
    emptyTitle: "No agriculture & agribusiness jobs found",
    emptyDescription: "No agriculture positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🌾",
    sidebarTitle: "Agribusiness Careers",
    sidebarDescription: "Agriculture CVs should highlight innovation and sustainability. Let our experts help.",
  },
  {
    dir: "legal-compliance",
    filterKey: "category",
    filterValue: "LEGAL",
    pageTitle: "Legal & Compliance Jobs in Kenya",
    breadcrumbName: "Legal & Compliance",
    searchPlaceholder: "Search legal & compliance jobs...",
    emptyTitle: "No legal & compliance jobs found",
    emptyDescription: "No legal positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "⚖️",
    sidebarTitle: "Legal Careers",
    sidebarDescription: "Legal CVs demand precision and professionalism. Get a CV that matches your standards.",
  },
  {
    dir: "creative-design",
    filterKey: "category",
    filterValue: "CREATIVE_DESIGN",
    pageTitle: "Creative Arts & Design Jobs in Kenya",
    breadcrumbName: "Creative Arts & Design",
    searchPlaceholder: "Search creative arts & design jobs...",
    emptyTitle: "No creative arts & design jobs found",
    emptyDescription: "No creative positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🎨",
    sidebarTitle: "Creative Careers",
    sidebarDescription: "Creative CVs should include a portfolio link. Let our experts design yours.",
  },
  {
    dir: "architecture-construction",
    filterKey: "category",
    filterValue: "ARCHITECTURE_CONSTRUCTION",
    pageTitle: "Architecture & Construction Jobs in Kenya",
    breadcrumbName: "Architecture & Construction",
    searchPlaceholder: "Search architecture & construction jobs...",
    emptyTitle: "No architecture & construction jobs found",
    emptyDescription: "No architecture positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏗️",
    sidebarTitle: "Built Environment",
    sidebarDescription: "Architecture CVs must showcase projects and technical skills. Get yours done right.",
  },
  {
    dir: "science-research",
    filterKey: "category",
    filterValue: "SCIENCE_RESEARCH",
    pageTitle: "Science & Research Jobs in Kenya",
    breadcrumbName: "Science & Research",
    searchPlaceholder: "Search science & research jobs...",
    emptyTitle: "No science & research jobs found",
    emptyDescription: "No science positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🔬",
    sidebarTitle: "Research Careers",
    sidebarDescription: "Science CVs should highlight publications and research impact. Let our experts help.",
  },
  {
    dir: "customer-service",
    filterKey: "category",
    filterValue: "CUSTOMER_SERVICE",
    pageTitle: "Customer Service Jobs in Kenya",
    breadcrumbName: "Customer Service",
    searchPlaceholder: "Search customer service jobs...",
    emptyTitle: "No customer service jobs found",
    emptyDescription: "No customer service positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🎧",
    sidebarTitle: "Customer Service",
    sidebarDescription: "Customer service CVs should highlight communication and problem-solving skills.",
  },
  {
    dir: "skilled-trades",
    filterKey: "category",
    filterValue: "SKILLED_TRADES",
    pageTitle: "Skilled Trades & Manual Work Jobs in Kenya",
    breadcrumbName: "Skilled Trades",
    searchPlaceholder: "Search skilled trades & manual work jobs...",
    emptyTitle: "No skilled trades & manual work jobs found",
    emptyDescription: "No skilled trades positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🔧",
    sidebarTitle: "Skilled Trades",
    sidebarDescription: "Trade CVs should highlight certifications and hands-on experience. Get yours crafted.",
  },
  {
    dir: "media-publishing",
    filterKey: "category",
    filterValue: "MEDIA_PUBLISHING",
    pageTitle: "Media & Publishing Jobs in Kenya",
    breadcrumbName: "Media & Publishing",
    searchPlaceholder: "Search media & publishing jobs...",
    emptyTitle: "No media & publishing jobs found",
    emptyDescription: "No media positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "📰",
    sidebarTitle: "Media Careers",
    sidebarDescription: "Media CVs must showcase storytelling and content expertise. Stand out with our help.",
  },
  {
    dir: "nonprofit",
    filterKey: "category",
    filterValue: "NONPROFIT",
    pageTitle: "Nonprofit & Social Services Jobs in Kenya",
    breadcrumbName: "Nonprofit & Social Services",
    searchPlaceholder: "Search nonprofit & social services jobs...",
    emptyTitle: "No nonprofit & social services jobs found",
    emptyDescription: "No nonprofit positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🌍",
    sidebarTitle: "Nonprofit Careers",
    sidebarDescription: "Nonprofit CVs should highlight impact and mission alignment. Let our experts help.",
  },
  {
    dir: "real-estate",
    filterKey: "category",
    filterValue: "REAL_ESTATE",
    pageTitle: "Real Estate Jobs in Kenya",
    breadcrumbName: "Real Estate",
    searchPlaceholder: "Search real estate jobs...",
    emptyTitle: "No real estate jobs found",
    emptyDescription: "No real estate positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏠",
    sidebarTitle: "Real Estate Careers",
    sidebarDescription: "Real estate CVs must highlight sales records and market knowledge. Get yours done right.",
  },
  {
    dir: "fitness-wellness",
    filterKey: "category",
    filterValue: "FITNESS_WELLNESS",
    pageTitle: "Fitness & Wellness Jobs in Kenya",
    breadcrumbName: "Fitness & Wellness",
    searchPlaceholder: "Search fitness & wellness jobs...",
    emptyTitle: "No fitness & wellness jobs found",
    emptyDescription: "No fitness positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "💪",
    sidebarTitle: "Fitness Careers",
    sidebarDescription: "Fitness CVs should highlight certifications and client results. Let our experts craft yours.",
  },
  {
    dir: "government-public-sector",
    filterKey: "category",
    filterValue: "GOVERNMENT_PUBLIC_SECTOR",
    pageTitle: "Government & Public Sector Jobs in Kenya",
    breadcrumbName: "Government & Public Sector",
    searchPlaceholder: "Search government & public sector jobs...",
    emptyTitle: "No government & public sector jobs found",
    emptyDescription: "No government positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🏛️",
    sidebarTitle: "Gov Job Alerts",
    sidebarDescription: "Never miss a government vacancy. Get a professional CV and be ready when the next one opens.",
  },
  {
    dir: "consulting",
    filterKey: "category",
    filterValue: "CONSULTING",
    pageTitle: "Consulting Jobs in Kenya",
    breadcrumbName: "Consulting",
    searchPlaceholder: "Search consulting jobs...",
    emptyTitle: "No consulting jobs found",
    emptyDescription: "No consulting positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "💡",
    sidebarTitle: "Consulting Careers",
    sidebarDescription: "Consulting CVs must showcase analytical thinking and client impact. Get yours done right.",
  },
  {
    dir: "insurance",
    filterKey: "category",
    filterValue: "INSURANCE",
    pageTitle: "Insurance Jobs in Kenya",
    breadcrumbName: "Insurance",
    searchPlaceholder: "Search insurance jobs...",
    emptyTitle: "No insurance jobs found",
    emptyDescription: "No insurance positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🛡️",
    sidebarTitle: "Insurance Careers",
    sidebarDescription: "Insurance CVs should highlight expertise and client relationships. Let our experts help.",
  },
  {
    dir: "transportation",
    filterKey: "category",
    filterValue: "TRANSPORTATION",
    pageTitle: "Transportation Jobs in Kenya",
    breadcrumbName: "Transportation",
    searchPlaceholder: "Search transportation jobs...",
    emptyTitle: "No transportation jobs found",
    emptyDescription: "No transportation positions match your search. Check back soon — new positions are posted regularly.",
    sidebarEmoji: "🚚",
    sidebarTitle: "Transportation Careers",
    sidebarDescription: "Transportation CVs should highlight safety records and reliability. Get yours crafted today.",
  },
];

// ─── Page Template ───────────────────────────────────────────────────────────

function generatePageContent(page) {
  const pagePath = `/jobs/${page.dir}`;
  const functionName = page.dir
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  return `import JobFilterView, { createJobFilterMetadata } from "../../_components/JobFilterView";

export const dynamic = "force-dynamic";

export const generateMetadata = createJobFilterMetadata({
  pageTitle: ${JSON.stringify(page.pageTitle)},
  pagePath: ${JSON.stringify(pagePath)},
  filterKey: ${JSON.stringify(page.filterKey)},
  filterValue: ${JSON.stringify(page.filterValue)},
  breadcrumbName: ${JSON.stringify(page.breadcrumbName)},
});

export default async function ${functionName}JobsPage({ searchParams }) {
  return JobFilterView({
    searchParams,
    pageTitle: ${JSON.stringify(page.pageTitle)},
    pagePath: ${JSON.stringify(pagePath)},
    filterKey: ${JSON.stringify(page.filterKey)},
    filterValue: ${JSON.stringify(page.filterValue)},
    breadcrumbName: ${JSON.stringify(page.breadcrumbName)},
    searchPlaceholder: ${JSON.stringify(page.searchPlaceholder)},
    emptyTitle: ${JSON.stringify(page.emptyTitle)},
    emptyDescription: ${JSON.stringify(page.emptyDescription)},
    sidebarEmoji: ${JSON.stringify(page.sidebarEmoji)},
    sidebarTitle: ${JSON.stringify(page.sidebarTitle)},
    sidebarDescription: ${JSON.stringify(page.sidebarDescription)},
  });
}
`;
}

// ─── Generate Files ──────────────────────────────────────────────────────────

const allPages = [
  ...employmentTypePages,
  ...experienceLevelPages,
  ...categoryPages,
];

let created = 0;
let skipped = 0;

for (const page of allPages) {
  const dirPath = path.join(BASE_DIR, page.dir);
  const filePath = path.join(dirPath, "page.jsx");

  // Skip if the directory already has a page.jsx (protect existing pages)
  if (fs.existsSync(filePath)) {
    console.log(`⏭️  SKIPPED (exists): ${page.dir}/page.jsx`);
    skipped++;
    continue;
  }

  // Create directory
  fs.mkdirSync(dirPath, { recursive: true });

  // Write file
  const content = generatePageContent(page);
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`✅ Created: ${page.dir}/page.jsx`);
  created++;
}

console.log(`\n────────────────────────────────`);
console.log(`Created: ${created} pages`);
console.log(`Skipped: ${skipped} pages (already exist)`);
console.log(`Total:  ${allPages.length} pages defined`);
