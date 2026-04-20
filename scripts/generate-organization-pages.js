#!/usr/bin/env node

/**
 * Script: generate-organization-pages.js
 * Task: 2-c
 *
 * Generates all 11 organization type filter page files under
 * src/app/(website)/organizations/<slug>/page.jsx
 *
 * Usage: node scripts/generate-organization-pages.js
 */

const fs = require("fs");
const path = require("path");

// Base paths
const ORG_DIR = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "(website)",
  "organizations"
);

// Page definitions
const pages = [
  {
    slug: "private",
    organizationType: "PRIVATE",
    pageTitle: "Private Sector Companies in Kenya",
    breadcrumbName: "Private Sector",
    searchPlaceholder: "Search private sector companies...",
    emptyTitle: "No private sector companies found",
    emptyDescription:
      "No private sector companies are currently listed. Check back soon!",
  },
  {
    slug: "smes",
    organizationType: "SMALL_BUSINESS",
    pageTitle: "SMEs in Kenya",
    breadcrumbName: "SMEs",
    searchPlaceholder: "Search SMEs...",
    emptyTitle: "No SMEs found",
    emptyDescription:
      "No SMEs are currently listed. Check back soon!",
  },
  {
    slug: "startups",
    organizationType: "STARTUP",
    pageTitle: "Startups in Kenya",
    breadcrumbName: "Startups",
    searchPlaceholder: "Search startups...",
    emptyTitle: "No startups found",
    emptyDescription:
      "No startups are currently listed. Check back soon!",
  },
  {
    slug: "ngos",
    organizationType: "NGO",
    pageTitle: "NGOs & Non-Profits in Kenya",
    breadcrumbName: "NGOs",
    searchPlaceholder: "Search NGOs...",
    emptyTitle: "No NGOs found",
    emptyDescription:
      "No NGOs are currently listed. Check back soon!",
  },
  {
    slug: "international",
    organizationType: "INTERNATIONAL_ORG",
    pageTitle: "International Organizations in Kenya",
    breadcrumbName: "International Orgs",
    searchPlaceholder: "Search international organizations...",
    emptyTitle: "No international organizations found",
    emptyDescription:
      "No international organizations are currently listed. Check back soon!",
  },
  {
    slug: "government",
    organizationType: "NATIONAL_GOV",
    pageTitle: "Government Agencies in Kenya",
    breadcrumbName: "Government",
    searchPlaceholder: "Search government agencies...",
    emptyTitle: "No government agencies found",
    emptyDescription:
      "No government agencies are currently listed. Check back soon!",
  },
  {
    slug: "county-government",
    organizationType: "COUNTY_GOV",
    pageTitle: "County Governments in Kenya",
    breadcrumbName: "County Gov",
    searchPlaceholder: "Search county governments...",
    emptyTitle: "No county governments found",
    emptyDescription:
      "No county governments are currently listed. Check back soon!",
  },
  {
    slug: "state-corporations",
    organizationType: "STATE_CORPORATION",
    pageTitle: "State Corporations in Kenya",
    breadcrumbName: "State Corporations",
    searchPlaceholder: "Search state corporations...",
    emptyTitle: "No state corporations found",
    emptyDescription:
      "No state corporations are currently listed. Check back soon!",
  },
  {
    slug: "universities",
    organizationType: "EDUCATION",
    pageTitle: "Universities & Academic Institutions in Kenya",
    breadcrumbName: "Universities",
    searchPlaceholder: "Search universities...",
    emptyTitle: "No universities found",
    emptyDescription:
      "No universities are currently listed. Check back soon!",
  },
  {
    slug: "foundations",
    organizationType: "FOUNDATION",
    pageTitle: "Foundations in Kenya",
    breadcrumbName: "Foundations",
    searchPlaceholder: "Search foundations...",
    emptyTitle: "No foundations found",
    emptyDescription:
      "No foundations are currently listed. Check back soon!",
  },
  {
    slug: "religious",
    organizationType: "RELIGIOUS_ORG",
    pageTitle: "Religious Organizations in Kenya",
    breadcrumbName: "Religious Orgs",
    searchPlaceholder: "Search religious organizations...",
    emptyTitle: "No religious organizations found",
    emptyDescription:
      "No religious organizations are currently listed. Check back soon!",
  },
];

function generatePageContent(page) {
  const pagePath = `/organizations/${page.slug}`;

  return `import OrganizationFilterView from "../../_components/OrganizationFilterView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const { generateMeta } = await import("@/lib/seo");
  const sp = await searchParams;
  const q = sp.q || "";
  const title = q ? \`\${q} — ${page.pageTitle}\` : "${page.pageTitle}";
  const description = "Browse ${page.breadcrumbName.toLowerCase()} in Kenya. View profiles and open positions on JobReady Kenya.";
  return generateMeta({ title, description, path: "${pagePath}" });
}

export default async function ${capitalizeFirst(page.slug)}Page({ searchParams }) {
  return OrganizationFilterView({
    searchParams: await searchParams,
    pageTitle: "${page.pageTitle}",
    pagePath: "${pagePath}",
    organizationType: "${page.organizationType}",
    breadcrumbName: "${page.breadcrumbName}",
    searchPlaceholder: "${page.searchPlaceholder}",
    emptyTitle: "${page.emptyTitle}",
    emptyDescription: "${page.emptyDescription}",
  });
}
`;
}

function capitalizeFirst(str) {
  // Convert slug to PascalCase component name: "county-government" → "CountyGovernment"
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

// Main
function main() {
  console.log(`Generating ${pages.length} organization filter pages...`);

  for (const page of pages) {
    const dirPath = path.join(ORG_DIR, page.slug);
    const filePath = path.join(dirPath, "page.jsx");

    // Create directory
    fs.mkdirSync(dirPath, { recursive: true });

    // Generate and write file
    const content = generatePageContent(page);
    fs.writeFileSync(filePath, content, "utf8");

    console.log(`  ✓ Created ${page.slug}/page.jsx`);
  }

  console.log(`\nDone! ${pages.length} pages generated successfully.`);
}

main();
