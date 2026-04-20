#!/usr/bin/env node

/**
 * generate-opportunity-pages.js
 *
 * Generates 18 opportunity filter page files from a data-driven config.
 * Each page uses the shared OpportunityFilterView component.
 *
 * Usage:  node scripts/generate-opportunity-pages.js
 */

const fs = require("fs");
const path = require("path");

// ─── Page definitions (18 pages) ──────────────────────────
const pages = [
  {
    slug: "sponsorships",
    opportunityType: "SPONSORSHIP",
    pageTitle: "Sponsorships in Kenya",
    cardBadge: "Sponsorship",
    breadcrumbName: "Sponsorships",
    searchPlaceholder: "Search sponsorships...",
    emptyTitle: "No sponsorships found",
    emptyDescription: "No sponsorships are currently listed. Check back soon!",
    metaDescription: "Find the latest sponsorships in Kenya. Apply now on JobReady Kenya.",
    functionName: "SponsorshipsPage",
  },
  {
    slug: "university-admissions",
    opportunityType: "UNIVERSITY_ADMISSION",
    pageTitle: "University Admissions in Kenya",
    cardBadge: "University Admission",
    breadcrumbName: "University Admissions",
    searchPlaceholder: "Search university admissions...",
    emptyTitle: "No university admissions found",
    emptyDescription: "No university admissions are currently listed. Check back soon!",
    metaDescription: "Find the latest university admissions in Kenya. Apply now on JobReady Kenya.",
    functionName: "UniversityAdmissionsPage",
  },
  {
    slug: "volunteer",
    opportunityType: "VOLUNTEER",
    pageTitle: "Volunteer Opportunities in Kenya",
    cardBadge: "Volunteer",
    breadcrumbName: "Volunteer",
    searchPlaceholder: "Search volunteer opportunities...",
    emptyTitle: "No volunteer opportunities found",
    emptyDescription: "No volunteer opportunities are currently listed. Check back soon!",
    metaDescription: "Find the latest volunteer opportunities in Kenya. Apply now on JobReady Kenya.",
    functionName: "VolunteerPage",
  },
  {
    slug: "training",
    opportunityType: "TRAINING",
    pageTitle: "Training Programs in Kenya",
    cardBadge: "Training",
    breadcrumbName: "Training Programs",
    searchPlaceholder: "Search training programs...",
    emptyTitle: "No training programs found",
    emptyDescription: "No training programs are currently listed. Check back soon!",
    metaDescription: "Find the latest training programs in Kenya. Apply now on JobReady Kenya.",
    functionName: "TrainingPage",
  },
  {
    slug: "certifications",
    opportunityType: "CERTIFICATION",
    pageTitle: "Certification Programs in Kenya",
    cardBadge: "Certification",
    breadcrumbName: "Certifications",
    searchPlaceholder: "Search certification programs...",
    emptyTitle: "No certification programs found",
    emptyDescription: "No certification programs are currently listed. Check back soon!",
    metaDescription: "Find the latest certification programs in Kenya. Apply now on JobReady Kenya.",
    functionName: "CertificationsPage",
  },
  {
    slug: "funding",
    opportunityType: "FUNDING",
    pageTitle: "Funding Opportunities in Kenya",
    cardBadge: "Funding",
    breadcrumbName: "Funding",
    searchPlaceholder: "Search funding opportunities...",
    emptyTitle: "No funding opportunities found",
    emptyDescription: "No funding opportunities are currently listed. Check back soon!",
    metaDescription: "Find the latest funding opportunities in Kenya. Apply now on JobReady Kenya.",
    functionName: "FundingPage",
  },
  {
    slug: "apprenticeships",
    opportunityType: "APPRENTICESHIP",
    pageTitle: "Apprenticeships in Kenya",
    cardBadge: "Apprenticeship",
    breadcrumbName: "Apprenticeships",
    searchPlaceholder: "Search apprenticeships...",
    emptyTitle: "No apprenticeships found",
    emptyDescription: "No apprenticeships are currently listed. Check back soon!",
    metaDescription: "Find the latest apprenticeships in Kenya. Apply now on JobReady Kenya.",
    functionName: "ApprenticeshipsPage",
  },
  {
    slug: "workshops",
    opportunityType: "WORKSHOP",
    pageTitle: "Workshops in Kenya",
    cardBadge: "Workshop",
    breadcrumbName: "Workshops",
    searchPlaceholder: "Search workshops...",
    emptyTitle: "No workshops found",
    emptyDescription: "No workshops are currently listed. Check back soon!",
    metaDescription: "Find the latest workshops in Kenya. Apply now on JobReady Kenya.",
    functionName: "WorkshopsPage",
  },
  {
    slug: "conferences",
    opportunityType: "CONFERENCE",
    pageTitle: "Conferences in Kenya",
    cardBadge: "Conference",
    breadcrumbName: "Conferences",
    searchPlaceholder: "Search conferences...",
    emptyTitle: "No conferences found",
    emptyDescription: "No conferences are currently listed. Check back soon!",
    metaDescription: "Find the latest conferences in Kenya. Apply now on JobReady Kenya.",
    functionName: "ConferencesPage",
  },
  {
    slug: "competitions",
    opportunityType: "COMPETITION",
    pageTitle: "Competitions in Kenya",
    cardBadge: "Competition",
    breadcrumbName: "Competitions",
    searchPlaceholder: "Search competitions...",
    emptyTitle: "No competitions found",
    emptyDescription: "No competitions are currently listed. Check back soon!",
    metaDescription: "Find the latest competitions in Kenya. Apply now on JobReady Kenya.",
    functionName: "CompetitionsPage",
  },
  {
    slug: "awards",
    opportunityType: "AWARD",
    pageTitle: "Awards in Kenya",
    cardBadge: "Award",
    breadcrumbName: "Awards",
    searchPlaceholder: "Search awards...",
    emptyTitle: "No awards found",
    emptyDescription: "No awards are currently listed. Check back soon!",
    metaDescription: "Find the latest awards in Kenya. Apply now on JobReady Kenya.",
    functionName: "AwardsPage",
  },
  {
    slug: "residencies",
    opportunityType: "RESIDENCY",
    pageTitle: "Residencies in Kenya",
    cardBadge: "Residency",
    breadcrumbName: "Residencies",
    searchPlaceholder: "Search residencies...",
    emptyTitle: "No residencies found",
    emptyDescription: "No residencies are currently listed. Check back soon!",
    metaDescription: "Find the latest residencies in Kenya. Apply now on JobReady Kenya.",
    functionName: "ResidenciesPage",
  },
  {
    slug: "mentorships",
    opportunityType: "MENTORSHIP",
    pageTitle: "Mentorship Programs in Kenya",
    cardBadge: "Mentorship",
    breadcrumbName: "Mentorship Programs",
    searchPlaceholder: "Search mentorship programs...",
    emptyTitle: "No mentorship programs found",
    emptyDescription: "No mentorship programs are currently listed. Check back soon!",
    metaDescription: "Find the latest mentorship programs in Kenya. Apply now on JobReady Kenya.",
    functionName: "MentorshipsPage",
  },
  {
    slug: "accelerators",
    opportunityType: "ACCELERATOR",
    pageTitle: "Accelerator Programs in Kenya",
    cardBadge: "Accelerator",
    breadcrumbName: "Accelerator Programs",
    searchPlaceholder: "Search accelerator programs...",
    emptyTitle: "No accelerator programs found",
    emptyDescription: "No accelerator programs are currently listed. Check back soon!",
    metaDescription: "Find the latest accelerator programs in Kenya. Apply now on JobReady Kenya.",
    functionName: "AcceleratorsPage",
  },
  {
    slug: "incubators",
    opportunityType: "INCUBATOR",
    pageTitle: "Incubator Programs in Kenya",
    cardBadge: "Incubator",
    breadcrumbName: "Incubator Programs",
    searchPlaceholder: "Search incubator programs...",
    emptyTitle: "No incubator programs found",
    emptyDescription: "No incubator programs are currently listed. Check back soon!",
    metaDescription: "Find the latest incubator programs in Kenya. Apply now on JobReady Kenya.",
    functionName: "IncubatorsPage",
  },
  {
    slug: "bootcamps",
    opportunityType: "BOOTCAMP",
    pageTitle: "Bootcamps in Kenya",
    cardBadge: "Bootcamp",
    breadcrumbName: "Bootcamps",
    searchPlaceholder: "Search bootcamps...",
    emptyTitle: "No bootcamps found",
    emptyDescription: "No bootcamps are currently listed. Check back soon!",
    metaDescription: "Find the latest bootcamps in Kenya. Apply now on JobReady Kenya.",
    functionName: "BootcampsPage",
  },
  {
    slug: "exchanges",
    opportunityType: "EXCHANGE",
    pageTitle: "Exchange Programs in Kenya",
    cardBadge: "Exchange",
    breadcrumbName: "Exchange Programs",
    searchPlaceholder: "Search exchange programs...",
    emptyTitle: "No exchange programs found",
    emptyDescription: "No exchange programs are currently listed. Check back soon!",
    metaDescription: "Find the latest exchange programs in Kenya. Apply now on JobReady Kenya.",
    functionName: "ExchangesPage",
  },
  {
    slug: "research",
    opportunityType: "RESEARCH",
    pageTitle: "Research Opportunities in Kenya",
    cardBadge: "Research",
    breadcrumbName: "Research Opportunities",
    searchPlaceholder: "Search research opportunities...",
    emptyTitle: "No research opportunities found",
    emptyDescription: "No research opportunities are currently listed. Check back soon!",
    metaDescription: "Find the latest research opportunities in Kenya. Apply now on JobReady Kenya.",
    functionName: "ResearchPage",
  },
];

// ─── Template generator ──────────────────────────────────
function generatePageContent(page) {
  const pagePath = `/opportunities/${page.slug}`;

  return `import OpportunityFilterView from "../../_components/OpportunityFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.get("q")?.trim();
  const title = q ? \`\${q} — ${page.pageTitle}\` : "${page.pageTitle}";
  const description = q
    ? \`Search results for "\${q}" in ${page.breadcrumbName.toLowerCase()}. ${page.metaDescription}\`
    : "${page.metaDescription}";
  return generateMeta({ title, description, path: "${pagePath}" });
}

export default async function ${page.functionName}({ searchParams }) {
  return OpportunityFilterView({
    searchParams: await searchParams,
    opportunityType: "${page.opportunityType}",
    pageTitle: "${page.pageTitle}",
    pagePath: "${pagePath}",
    breadcrumbName: "${page.breadcrumbName}",
    slug: "${page.slug}",
    metaDescription: "${page.metaDescription}",
    searchPlaceholder: "${page.searchPlaceholder}",
    emptyTitle: "${page.emptyTitle}",
    emptyDescription: "${page.emptyDescription}",
    cardBadge: "${page.cardBadge}",
    sidebarEmoji: "🎓",
    sidebarTitle: "Free CV Review",
    sidebarDescription: "Get expert feedback on your CV. Our career coaches will review it for free and help you land more interviews.",
  });
}
`;
}

// ─── Main ─────────────────────────────────────────────────
const projectRoot = path.resolve(__dirname, "..");
const pagesDir = path.join(projectRoot, "src", "app", "(website)", "opportunities");

// Existing pages that should NOT be touched
const PROTECTED_SLUGS = ["bursaries", "scholarships", "grants", "fellowships", "internships"];

let created = 0;
let skipped = 0;

for (const page of pages) {
  const dirPath = path.join(pagesDir, page.slug);
  const filePath = path.join(dirPath, "page.jsx");

  // Skip if already exists (including protected existing pages)
  if (fs.existsSync(filePath)) {
    console.log(`  \u23ed  SKIP  ${page.slug}/page.jsx (already exists)`);
    skipped++;
    continue;
  }

  // Create directory
  fs.mkdirSync(dirPath, { recursive: true });

  // Write file
  const content = generatePageContent(page);
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`  \u2705  CREATED  ${page.slug}/page.jsx`);
  created++;
}

console.log(`\nDone! ${created} page(s) created, ${skipped} skipped (already exist).\n`);
