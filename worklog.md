---
Task ID: 1
Agent: Main Agent
Task: Fix job detail 404, server-side fetch URLs, M-Pesa popup stuck loading

Work Log:
- Investigated /job/[slug] 404: found homepage uses NEXT_PUBLIC_BASE_URL (https://jobready.co.ke) for server-side fetches which fail when running locally (site not deployed), causing fallback to mock data with fake slugs
- Confirmed DB has 70 real jobs with valid slugs
- Fixed 7 server component files to use relative URLs instead of absolute NEXT_PUBLIC_BASE_URL:
  - src/app/(website)/page.jsx
  - src/app/(website)/career-advice/page.jsx
  - src/app/(website)/career-advice/[slug]/page.jsx
  - src/app/(website)/opportunities/page.jsx
  - src/app/(website)/opportunities/[hubSlug]/[slug]/page.jsx
  - src/app/(website)/organizations/page.jsx
  - src/app/(website)/organizations/[slug]/page.jsx
- Verified directory names [hubSlug] are correct (terminal display issue with [ character)
- Added querySTKStatus() function to src/lib/mpesa.js for direct Safaricom STK Query
- Created new API endpoint POST /api/payments/stk-query for direct Safaricom status checking
- Updated OrderModal.jsx polling to use STK Query as primary mechanism (bypasses callback dependency)
- Added TIMEOUT status handling to payment polling
- Increased M-Pesa poll timeout from 60s to 120s (40 polls × 3s)
- Committed and pushed to GitHub (commit 2779ebf)

Stage Summary:
- Job detail 404 ROOT CAUSE: Homepage server-side fetch used absolute URL to un-deployed production site → fell back to mock data → clicking mock jobs → slug not found in DB → 404
- M-Pesa popup ROOT CAUSE: Callback URL (https://jobready.co.ke/api/payments/mpesa/callback) unreachable from Safaricom when running locally → payment status stays PENDING forever. Fixed by adding STK Query direct polling.
- Key remaining issue: "double header" — TopBar (dark info strip) + Header (white nav) are both by design, but user may be seeing something else. Cannot reproduce without running the app.

---
## Task ID: 2 - fullstack-dev
### Work Task
Fix 4 server component pages that use relative `fetch('/api/...')` calls which fail during Vercel's static build. Replace with direct Prisma queries.

### Work Summary
Fixed 4 server component pages to use direct Prisma database queries instead of relative fetch calls. This resolves Vercel static build failures where relative URLs (`/api/...`) are unavailable during build time.

**Files modified:**

1. **`src/app/(website)/career-advice/page.jsx`**
   - Added `import { db } from "@/lib/db"` and `export const dynamic = "force-dynamic"`
   - Replaced `fetchArticles()` helper (which used `fetch('/api/articles?...')`) with direct `db.blogArticle.findMany()` query
   - Filters: `isPublished: true`, `publishedAt: { not: null, lte: new Date() }`
   - Orders by `isFeatured desc, publishedAt desc`, takes 20
   - Includes `author` (name) and `category` (name, slug, color)
   - Splits results: featured = first isFeatured article (or first overall), regularArticles = rest
   - Wrapped in try/catch with empty array fallback

2. **`src/app/(website)/career-advice/[slug]/page.jsx`**
   - Added `import { db } from "@/lib/db"` and `export const dynamic = "force-dynamic"`
   - Replaced `fetchArticle()` helper with `fetchArticleData()` using `db.blogArticle.findUnique({ where: { slug } })`
   - Includes `author: true`, `category: true`, `tags: { include: { tag: true } }`
   - Transforms `ArticleTag[]` junction records to `BlogTag[]` objects (maps `t.tag` for `.name` access)
   - Fetches related articles separately: `db.blogArticle.findMany()` with same-category filter, takes 5
   - Both `generateMetadata()` and page component use the same `fetchArticleData()` helper
   - Calls `notFound()` if article not found

3. **`src/app/(website)/organizations/page.jsx`**
   - Added `import { db } from "@/lib/db"` and `export const dynamic = "force-dynamic"`
   - Replaced `fetchCompanies()` helper with direct `db.company.findMany()` query
   - Filters: `isActive: true`
   - Orders by `isVerified desc, name asc`, takes 50
   - Includes `_count: { jobs: { where: { isActive: true, publishedAt: { not: null } } } }`
   - Maps `_count.jobs` to `jobCount` field for downstream components
   - Wrapped in try/catch with empty array fallback

4. **`src/app/(website)/organizations/[slug]/page.jsx`**
   - Added `import { db } from "@/lib/db"` and `export const dynamic = "force-dynamic"`
   - Created `fetchCompanyData(slug)` helper using `db.company.findUnique({ where: { slug } })`
   - Includes `_count` for total jobs and `jobs` (take 10, with deadline filtering using `OR`)
   - Builds `pagination` object from `_count.jobs` total
   - Fetches similar companies: `db.company.findMany()` filtered by same `industry`, takes 5
   - Maps `_count.jobs` to `jobCount` for `normalizeSimilarCompanies()`
   - `generateMetadata()` uses a lightweight `db.company.findUnique()` (no includes)
   - Calls `notFound()` if company not found
   - All existing normalize functions (`normalizeCompany`, `normalizeJobs`, `normalizeSimilarCompanies`) preserved

**Key decisions:**
- Used `isPublished: true` for BlogArticle queries (matches Prisma schema — no `isActive` field on BlogArticle)
- Used `db.blogArticle` and `db.company` as the Prisma client model names (matching PascalCase → camelCase convention)
- Transformed `ArticleTag[]` junction records to flat `BlogTag[]` to preserve existing JSX that accesses `.name`
- All existing JSX/HTML rendering preserved exactly — only data fetching changed
- All pre-existing lint errors are in unrelated files (seed scripts, CookieConsent, test-e2e) — no new lint errors introduced

---
Task ID: 1
Agent: Main Agent
Task: Fix Homepage (/) runtime crash and Opportunity Detail page errors

Work Log:
- Identified root cause: `activeJobsWhere(overrides = {})` in homepage page.jsx used `...overrides` to spread into an AND array, but `{}` is not iterable in array context — confirmed with `node -e "const a = [...{}]"`
- The minified SSR error was `TypeError: a is not iterable` at the exact position of `...a` in the minified code
- Fixed by changing default from `{}` to `[]`: `function activeJobsWhere(overrides = [])`
- Also improved error handling in `/opportunities/[hubSlug]/[slug]/page.jsx`:
  - Added try-catch around `generateMetadata` 
  - Added try-catch around the main page component
  - Added separate try-catch for the similar opportunities query
  - Added null check for `slug` parameter
- Rebuilt and verified no errors in server logs
- Pushed commit 95d9888 to GitHub

Stage Summary:
- Homepage fix: `activeJobsWhere(overrides = {})` → `activeJobsWhere(overrides = [])`
- This was the single root cause of the "Something went wrong" error on the homepage
- Opportunity detail page: added defensive error handling, likely will fix when deployed
- Committed and pushed to origin/master

---
Task ID: 2
Agent: Super Z (main)
Task: Delete all mock data and update components to remove mock data dependencies

Work Log:
- Deleted 10 mock-data.js files (kept cv-services mock-data.js as it contains real product data)
- Deleted career-advice/[slug]/_components/article-content.js (hardcoded fake article HTML)
- Updated homepage page.jsx: removed mock imports, all fallbacks now use empty arrays, category counts set to 0
- Updated JobFilters.jsx: replaced mock imports with inline static filter labels (no fake counts), made count display conditional
- Updated SearchFilters.jsx: replaced mock imports with inline static filter options (no fake counts)
- Updated TrendingSearches.jsx: removed mock trending searches and popular tags, kept only newsletter section
- Updated CompanyFilters.jsx: replaced mock imports with inline static filter arrays
- Updated career-advice/[slug]/page.jsx: removed article-content.js import and fallback, shows empty when no content
- Updated jobs/[hubSlug]/hub-data.js: removed Math.random() count generation, set to 0
- Updated organizations/[slug]/page.jsx: set hardcoded browseIndustries counts to 0

Stage Summary:
- All 10 mock data files deleted + 1 article-content.js deleted
- All components updated to work without mock data
- Homepage will show empty sections when DB has no data (correct behavior)
- Filter UI components use static labels without fake counts
- No remaining imports from mock-data files (verified — only cv-services remains, which is kept intentionally)
- No new lint errors introduced; homepage loads with 200 OK

---
Task ID: 11
Agent: Auth Schema Migration
Task: Add googleId to User, create Otp table

Work Log:
- Added googleId (String?, @unique) to User model
- Created new Otp model with phone, code, purpose, verified, expiresAt
- Added index on Otp(phone, purpose)
- Generated Prisma client (v6.19.3)
- Pushed schema to production MySQL database
- Installed prisma@6 CLI to match @prisma/client ^6.11.1

Stage Summary:
- Schema changes applied to database
- Next: Rewrite auth-identity.js with simple direct lookups

---
## Task ID: 2-c
### Work Task
Create shared `OrganizationFilterView` component and generate ALL organization type filter pages (11 pages).

### Work Summary

**Files created:**

1. **`src/app/(website)/_components/OrganizationFilterView.jsx`**
   - Shared server component for organization type filter pages
   - Accepts props: `searchParams`, `pageTitle`, `pagePath`, `organizationType`, `breadcrumbName`, `searchPlaceholder`, `emptyTitle`, `emptyDescription`
   - Uses `db.company.findMany` with `isActive: true` and `organizationType` filter
   - Selects: id, name, slug, logo, logoColor, industry, county, country, website, isVerified, createdAt
   - Includes `_count: { select: { jobs: { where: { status: "PUBLISHED", isActive: true } } } }`
   - Orders by `createdAt: "desc"`, paginates with PER_PAGE = 20
   - Uses `generateBreadcrumbJsonLd` from `@/lib/seo` for structured data
   - Uses `getInitials` from `@/lib/normalize` for avatar fallbacks
   - Uses `AdPlaceholder` from `./AdPlaceholder` for sidebar ads
   - Company cards: logo/initials, name + verified badge, industry, county/country, job count
   - Sidebar: AdPlaceholder, "Are You an Employer?" CTA (WhatsApp), AdPlaceholder
   - Text search on name, industry, county with Clear link
   - Pagination with Previous/Next and page number links

2. **`scripts/generate-organization-pages.js`**
   - Node.js script that generates all 11 page files from a config array
   - Ran successfully, creating all pages

3. **11 generated page files under `src/app/(website)/organizations/<slug>/page.jsx`:**
   - `/organizations/private` → PRIVATE → "Private Sector Companies in Kenya"
   - `/organizations/smes` → SMALL_BUSINESS → "SMEs in Kenya"
   - `/organizations/startups` → STARTUP → "Startups in Kenya"
   - `/organizations/ngos` → NGO → "NGOs & Non-Profits in Kenya"
   - `/organizations/international` → INTERNATIONAL_ORG → "International Organizations in Kenya"
   - `/organizations/government` → NATIONAL_GOV → "Government Agencies in Kenya"
   - `/organizations/county-government` → COUNTY_GOV → "County Governments in Kenya"
   - `/organizations/state-corporations` → STATE_CORPORATION → "State Corporations in Kenya"
   - `/organizations/universities` → EDUCATION → "Universities & Academic Institutions in Kenya"
   - `/organizations/foundations` → FOUNDATION → "Foundations in Kenya"
   - `/organizations/religious` → RELIGIOUS_ORG → "Religious Organizations in Kenya"

4. **`eslint.config.mjs`** — Added `scripts/**` to ignores list (build scripts shouldn't be linted)

**NOT modified:**
- `src/app/(website)/organizations/page.jsx` (original organizations page untouched)

**Lint:** No new errors introduced. All 14 remaining errors are pre-existing in unrelated files.

---
## Task ID: 2-b
### Work Task
Create shared `OpportunityFilterView` component and generate ALL opportunity filter pages (18 pages).

### Work Summary

**Files created:**

1. **`src/app/(website)/_components/OpportunityFilterView.jsx`**
   - Shared server component for opportunity type filter pages
   - Accepts props: `searchParams`, `opportunityType`, `pageTitle`, `pagePath`, `breadcrumbName`, `slug`, `metaDescription`, `searchPlaceholder`, `emptyTitle`, `emptyDescription`, `cardBadge`, `pluralBadge`, `sidebarEmoji`, `sidebarTitle`, `sidebarDescription`
   - Uses `db.opportunity.findMany` with filters: `status: "PUBLISHED"`, `isActive: true`, `publishedAt: { not: null }`, `deadline >= today or null`, and the passed `opportunityType`
   - Text search on title, excerpt, description when `q` param provided
   - Orders by `publishedAt: desc, createdAt: desc`, paginates with PER_PAGE = 20
   - Includes `company` relation (id, name, slug, logo, logoColor)
   - Uses `generateBreadcrumbJsonLd` from `@/lib/seo` for structured data
   - Uses `getInitials` from `@/lib/normalize` for company avatar fallbacks
   - Uses `formatDate`, `formatRelativeDate` from `@/lib/format`
   - Uses `AdPlaceholder` from `./AdPlaceholder` for sidebar ads
   - Uses `siteConfig` from `@/config/site-config` for WhatsApp CTA
   - Opportunity cards: type badge, featured star, title, company logo+name, excerpt, deadline countdown, posted date
   - Purple theme consistent with existing bursaries/scholarships pages
   - Sidebar: AdPlaceholder, "Free CV Review" gradient CTA card, AdPlaceholder
   - Pagination with Previous/Next and page number links

2. **`scripts/generate-opportunity-pages.js`**
   - Node.js script that generates all 18 page files from a config array
   - Skips existing files (including protected bursaries/scholarships/grants/fellowships/internships pages)
   - Search descriptions use `breadcrumbName.toLowerCase()` for correct pluralization (e.g., "research opportunities" not "researchs")

3. **18 generated page files under `src/app/(website)/opportunities/<slug>/page.jsx`:**
   - `/opportunities/sponsorships` → SPONSORSHIP → "Sponsorships in Kenya"
   - `/opportunities/university-admissions` → UNIVERSITY_ADMISSION → "University Admissions in Kenya"
   - `/opportunities/volunteer` → VOLUNTEER → "Volunteer Opportunities in Kenya"
   - `/opportunities/training` → TRAINING → "Training Programs in Kenya"
   - `/opportunities/certifications` → CERTIFICATION → "Certification Programs in Kenya"
   - `/opportunities/funding` → FUNDING → "Funding Opportunities in Kenya"
   - `/opportunities/apprenticeships` → APPRENTICESHIP → "Apprenticeships in Kenya"
   - `/opportunities/workshops` → WORKSHOP → "Workshops in Kenya"
   - `/opportunities/conferences` → CONFERENCE → "Conferences in Kenya"
   - `/opportunities/competitions` → COMPETITION → "Competitions in Kenya"
   - `/opportunities/awards` → AWARD → "Awards in Kenya"
   - `/opportunities/residencies` → RESIDENCY → "Residencies in Kenya"
   - `/opportunities/mentorships` → MENTORSHIP → "Mentorship Programs in Kenya"
   - `/opportunities/accelerators` → ACCELERATOR → "Accelerator Programs in Kenya"
   - `/opportunities/incubators` → INCUBATOR → "Incubator Programs in Kenya"
   - `/opportunities/bootcamps` → BOOTCAMP → "Bootcamps in Kenya"
   - `/opportunities/exchanges` → EXCHANGE → "Exchange Programs in Kenya"
   - `/opportunities/research` → RESEARCH → "Research Opportunities in Kenya"

**NOT modified:**
- Existing opportunity pages: bursaries, scholarships, grants, fellowships, internships (all untouched)
- Total opportunity page files: 24 (5 existing + 18 new + 1 [slug] detail page)

**Lint:** No new errors introduced. All pre-existing lint errors are in unrelated files.
