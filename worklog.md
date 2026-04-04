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
