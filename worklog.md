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
