---
Task ID: 1
Agent: Main Agent
Task: Clean up seed data (3 companies, 5 jobs, 5 opportunities) and review job/[slug] page

Work Log:
- Read current prisma/schema.prisma — schema already updated with all agreed specs (Company, Job, Opportunity models)
- Read old seed files (seed.js, seed-7c-jobs.js, seed-7d-opportunities.js) — they reference removed fields (employmentType, requirements, responsibilities, skills, highlights, isUrgent, isPaid, foundedYear, employeeSize, tickerSymbol, companyType, organizationName, organizationType, fundingAmount, fundingCurrency, isFullyFunded)
- Rewrote prisma/seed.js as a single clean file: clears all old data, creates 3 companies, 5 jobs, 5 opportunities using only current schema fields
- Reviewed all job/[slug] components (page.jsx, JobDetailHeader.jsx, JobDetailBody.jsx, JobDetailSidebar.jsx, JobToolsBar.jsx, MobileApplyBar.jsx, ApplyModal.jsx, ServiceNudge.jsx) — all already use correct current schema fields
- Fixed src/lib/seo.js generateJobJsonLd(): replaced company.linkedinUrl with socialLinks JSON extraction, replaced job.employmentType with job.jobType, used structured location fields (city/country), added salaryPeriod mapping
- Attempted prisma db push + seed run — no .env/DATABASE_URL available locally (deployment-only)
- Searched for all old field references across src/ — remaining references are in: dashboard forms (deferred per user), org_data.js (data enums), search API, homepage, hub content pages, OpportunityCard (these use organizationName which normalize.js maps from company.name)

Stage Summary:
- ✅ prisma/seed.js fully rewritten with 3 companies, 5 jobs, 5 opportunities matching current schema
- ✅ job/[slug] page and all its components verified clean — no changes needed
- ✅ src/lib/seo.js fixed to use socialLinks JSON and structured location fields
- ⏳ prisma db push + seed run requires DATABASE_URL (not available locally)
- ⏳ Other pages (homepage, hub pages, search API, OpportunityCard) still reference old opportunity fields (organizationName) but normalize.js handles the mapping — will need updating later
