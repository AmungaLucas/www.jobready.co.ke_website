---
Task ID: 1
Agent: Main Agent
Task: Create improved homepage prototype for JobReady.co.ke

Work Log:
- Read two uploaded sample HTML homepages (deepseek_html_20260330_18aef4.html and deepseek_html_20260330_06af1b.html)
- Read existing finalized prototypes (job detail page and hub page) to extract shared design language
- Analyzed sample strengths: deadline urgency cards, category grids, company logos on jobs, sidebar service CTAs
- Identified sample weaknesses: different CSS/color system, no mobile hamburger drawer, no WhatsApp float, no CV modal, emoji-heavy, no proper SVG icons
- Built comprehensive homepage prototype at /home/z/my-project/download/jobready-homepage-prototype.html

Stage Summary:
- Created jobready-homepage-prototype.html with full design system match
- Key improvements over samples: matching CSS variables, proper header with hamburger drawer, WhatsApp floating button, CV modal intercept funnel, SVG icons throughout (no emoji overload), "Trusted By" employer bar, better deadline urgency cards, 3-state salary display, save/bookmark toggles, newsletter form, browse-by-location sidebar, proper responsive breakpoints
- Homepage sections: Top Bar → Header → Hero (search + stats + quick links) → Trusted By → Ad Leaderboard → Main Layout (Closing Today, Trending Now, Browse by Category, Service Nudge, Latest Jobs, In-content Ad, Scholarships & Opportunities, Government Jobs) + Sidebar (CV Review Card, Ad, Featured Jobs, Top Employers, Email Alerts, Urgent Deadlines, Browse by Location, Ad) → Footer → WhatsApp Float → CV Modal
- All links use /jobs/, /opportunities/, /organizations/ URL structure matching the 33 hub pages plan

---
## Task ID: 2 - frontend-developer
### Work Task
Build a comprehensive Services page HTML prototype for JobReady.co.ke — the revenue engine page where job seekers purchase CV writing, cover letter, and LinkedIn profile services.

### Work Summary
- Read the homepage prototype (jobready-homepage-prototype.html) to extract exact shared components: top bar, header, mobile nav drawer, footer, WhatsApp float, and CV modal
- Copied shared components exactly, changing only the nav `class="active"` from "Jobs" to "CV Services"
- Built complete services page at `/home/z/my-project/download/jobready-services-prototype.html` (1,194 lines) with all 13 required sections:

**Page Sections Built:**
1. **Top Bar + Header + Mobile Nav** — Exact copy from homepage, with `class="active"` on "CV Services" nav link
2. **Services Hero** — Blue gradient background, trust badge ("25,000+ job seekers"), H1, subtitle, two CTAs ("Get Started — from KSh 500" + "Chat on WhatsApp"), stats row (5,000+ CVs, 92% Interview Rate, 24hr Delivery)
3. **Services Overview** — 3 cards (CV Writing, Cover Letter, LinkedIn Profile) with icons, "From KSh 500" price anchoring, descriptions, and "Learn More" buttons
4. **CV Writing Pricing** — 3-tier pricing table (Basic KSh 500, Professional KSh 1,500 "Most Popular" with highlight/badge/elevated positioning, Premium KSh 3,500) with checkmark feature lists
5. **Cover Letter Pricing** — 2-tier (Basic KSh 500, Premium KSh 1,000) centered 2-column layout
6. **LinkedIn Profile Pricing** — 2-tier (Basic KSh 800, Premium KSh 1,500) centered 2-column layout
7. **How It Works** — 4-step horizontal timeline with numbered circles, icons, and descriptions
8. **Why Choose JobReady** — 6-card trust grid (ATS-Optimized, Kenyan Market Experts, Fast Turnaround, Affordable Pricing, Free Revisions, WhatsApp Support)
9. **Before & After Showcase** — Side-by-side CV comparison cards with red X marks (before) and green checks (after)
10. **Testimonials** — 3 testimonial cards with 5-star ratings, avatar initials, names, titles, and quotes
11. **FAQ Section** — 6 accordion items using `<details>/<summary>` HTML with rotating chevron icon
12. **Final CTA Banner** — Full-width blue gradient with two buttons ("Get Your CV Now" + "Chat on WhatsApp")
13. **Footer + WhatsApp Float + CV Modal** — Exact copy from homepage

**Technical Implementation:**
- Single HTML file with all CSS embedded in `<style>` tag and minimal JS for CV modal
- JSON-LD structured data for Service page schema with offers and aggregateRating
- SEO meta tags (title, description, OG, Twitter, canonical URL)
- All SVG icons inline — zero external dependencies, zero images
- Responsive breakpoints: desktop (1200px), tablet (1024px), mobile (768px)
- All WhatsApp links point to `https://wa.me/254700000000` with contextual pre-filled messages per service/tier
- Smooth scroll behavior via `html{scroll-behavior:smooth}`
- All design system CSS variables match homepage exactly
- Mobile-first with hamburger drawer nav preserved

---
## Task ID: 3 - frontend-developer
### Work Task
Build a Blog / Career Advice listing page HTML prototype for JobReady.co.ke — the SEO content marketing hub where job seekers find career advice articles.

### Work Summary
- Read the homepage prototype (`jobready-homepage-prototype.html`) to extract exact shared components: top bar, header, mobile nav drawer, footer, WhatsApp float, and all shared CSS
- Copied shared components exactly, changing only the nav `class="active"` from "Jobs" to "Career Advice"
- Excluded the CV Modal from this page (blog readers are not in a job application flow)
- Built complete blog prototype at `/home/z/my-project/download/jobready-blog-prototype.html` with all required sections:

**Page Sections Built:**
1. **Top Bar + Header + Mobile Nav** — Exact copy from homepage, with `class="active"` on "Career Advice" nav link
2. **Blog Hero** — Blue gradient background matching design family, badge ("Career Advice & Job Search Tips"), H1, subtitle, breadcrumbs (Home > Career Advice)
3. **Featured Article** — Full-width hero-style card with blue gradient background, "Featured" star tag, article title, excerpt, author avatar (GW initials), name/date, "Read Article" button
4. **Category Tabs** — Horizontal scrollable row with 8 filter tabs (All, CV Writing Tips, Interview Tips, Job Search, Career Growth, Government Jobs, Scholarships, Salary & Negotiation) with JS click handlers that filter the article grid with fade animation
5. **Main Layout — 2 columns (content + sidebar):**
   - **Left Column:** 9 article cards in a 3-column grid (desktop), each with colored gradient strip at top, category pill tag, title, 2-line truncated excerpt, author row (avatar + name + date), read time. Each card has a different gradient color per category. "Load More Articles" button below grid.
   - **Right Sidebar (sticky):** CV Review CTA card (amber gradient, "Starting at KSh 500"), Google Ad placeholder, Popular Articles (top 5 with numbered circles + view counts), Newsletter Signup (email input + subscribe + trust text), Categories List (7 categories with article counts), Paid Ad placeholder, Tags Cloud (15 popular tags as clickable pills)
6. **Full-width Ad Placeholder** — Google Ad leaderboard between content and footer
7. **Footer + WhatsApp Float** — Exact copy from homepage, no CV Modal

**9 Sample Articles Used (exact titles and categories as specified):**
1. "10 Common CV Mistakes Kenyan Job Seekers Make" — CV Writing Tips — 5 min
2. "How to Prepare for a Safaricom Panel Interview" — Interview Tips — 8 min
3. "Government of Kenya Jobs: Public Service Recruitment" — Government Jobs — 7 min
4. "Entry Level Jobs in Nairobi" — Job Search — 6 min
5. "Cover Letter Templates That Actually Work" — CV Writing Tips — 4 min
6. "How to Negotiate Your Salary in Kenya" — Salary & Negotiation — 6 min
7. "Best Scholarships for Kenyan Students 2026" — Scholarships — 10 min
8. "LinkedIn Tips for Kenyan Professionals" — Career Growth — 5 min
9. "From Internship to Full-Time" — Career Growth — 7 min

**Technical Implementation:**
- Single HTML file with all CSS embedded in `<style>` tag and minimal JS for category filtering
- JSON-LD structured data for Blog schema with BlogPosting example
- SEO meta tags (title, description, OG, Twitter, canonical URL)
- All SVG icons inline — zero external dependencies, zero images, zero emoji
- Responsive breakpoints: desktop (1200px, 3-col grid), tablet (1024px, 2-col grid), mobile (768px, 1-col)
- Category tabs are functional with JS click handlers that toggle active state and filter cards with fade animation
- Smooth scroll behavior via `html{scroll-behavior:smooth}`
- All design system CSS variables match homepage exactly
- Mobile-first with hamburger drawer nav preserved
- No CV Modal on this page (blog readers are content consumers, not job applicants)

---
## Task ID: 4 - frontend-developer
### Work Task
Build a Company Profile page HTML prototype for JobReady.co.ke — the employer branding page that users see when they click a company name from any job listing.

### Work Summary
- Read the homepage prototype (`jobready-homepage-prototype.html`) to extract exact shared components: top bar, header, mobile nav drawer, footer, WhatsApp float, and all shared CSS
- Read the job detail prototype (`jobready-prototype.html`) to understand company logo, verified badge, and job card patterns for consistency
- Copied shared components exactly, changing only the nav `class="active"` from "Jobs" to "Companies"
- No CV Modal on this page (not a job application flow)
- Built complete company profile prototype at `/home/z/my-project/download/jobready-company-prototype.html` with all required sections:

**Page Sections Built:**
1. **Top Bar + Header + Mobile Nav** — Exact copy from homepage, with `class="active"` on "Companies" nav link
2. **Breadcrumbs** — Home > Companies > Safaricom PLC with chevron SVG separators
3. **Company Hero / Profile Header** — Full-width card with green gradient banner (Safaricom brand colors), large "SC" logo circle with white border, company name "Safaricom PLC" with green verified employer badge, tagline, and 5 stat pills (12 Active Jobs, 5,000+ Employees, Nairobi Kenya, Telecommunications, Listed Company)
4. **Company About Section** — Card with "About Safaricom PLC" heading, 3 realistic paragraphs (M-PESA, network coverage, innovation, sustainability), and 6-item key details grid (Industry, Founded 1999, Size, Location with full address, Website link, Type: NSE SCOM) each with SVG icon
5. **Main Layout (2 columns)** — Left column for jobs, right column for sidebar
6. **Job Filter Bar** — Search input with search icon, 4 functional filter pills (All 12, Full Time 8, Contract 3, Internship 1) with JS click handlers that toggle active state and filter job items by data-type attribute
7. **Job Listing Cards (8 jobs)** — Using the .jl-item pattern from homepage: Senior Software Engineer (Featured), Product Manager M-PESA (New), Data Analyst (Urgent), Network Engineer (Mombasa), Cybersecurity Analyst (New), Marketing Communications Manager, Finance Graduate Trainee, IT Support Intern (Internship). Each shows title, location, type, deadline, optional badge, save/bookmark button. No salaries.
8. **Pagination** — `< 1 2 3 >` with active state on page 1
9. **Right Sidebar:**
   - CV CTA Card — Blue-bordered card with "Applying to Safaricom?" heading, description, "Get Your CV Done" WhatsApp CTA button, "from KSh 500" price
   - Google Ad Placeholder
   - Similar Companies — 5 companies (Airtel Kenya 6 jobs, KCB Group 9 jobs, Equity Bank 11 jobs, NCBA Group 4 jobs, Kenya Power 7 jobs) each as compact row with colored logo circle, linked name, job count pill
   - Browse by Industry — 6 industries with company counts (Telecommunications 5, Banking & Finance 18, Government 24, NGOs & Development 31, IT & Technology 22, Healthcare 12)
   - Paid Ad Placeholder
10. **Footer + WhatsApp Float** — Exact copy from homepage, no CV Modal

**Technical Implementation:**
- Single HTML file with all CSS embedded in `<style>` tag and minimal JS for filter pills and save toggles
- JSON-LD structured data for Organization schema (Safaricom PLC) with foundingDate, numberOfEmployees, address, industry, tickerSymbol, sameAs links — optimized for Google knowledge panel
- SEO meta tags (title: "Safaricom PLC Jobs & Careers | JobReady Kenya", description, OG, Twitter, canonical URL)
- All SVG icons inline — zero external dependencies, zero images, zero emoji
- Responsive breakpoints: desktop (1200px, 2-col layout), tablet (1024px, single column), mobile (768px, stacked with smaller hero)
- Filter pills are functional with JS click handlers that toggle active state and show/hide job items by data-type
- Save/bookmark buttons are functional with toggle class
- Smooth scroll behavior via `html{scroll-behavior:smooth}`
- All design system CSS variables match homepage exactly
- Mobile-first with hamburger drawer nav preserved
- Company logo uses green gradient (#00a254 to #00c853) matching Safaricom brand family
- Job card styling matches homepage .jl-item pattern exactly
- No salaries displayed anywhere on the page
- No CV Modal on this page

---
## Task ID: 5
### Work Task
Build a Search Results page HTML prototype for JobReady.co.ke — the page users land on after using the hero search bar.

### Work Summary
- Read blog prototype and homepage prototype to extract shared design system, components, and patterns
- Built complete search results page at `/home/z/my-project/download/jobready-search-prototype.html`

**Page Sections Built:**
1. **Top Bar + Header + Mobile Nav** — Exact shared components, with `class="active"` on "Jobs" nav link
2. **Search Bar Section** — Mirrors hero search with pre-filled query "accounting jobs", location dropdown (Nairobi selected), and amber search button
3. **Active Filters Bar** — Shows active filter chips (accounting jobs, Nairobi, Full-Time) with X remove buttons and "Clear all" link
4. **3-Column Search Layout:**
   - **Left Filter Sidebar (280px):**
     - Job Type (5 options with checkboxes: Full-Time, Part-Time, Contract, Internship, Remote) with counts
     - Experience Level (4 options: Entry, Mid, Senior, Manager/Director)
     - Date Posted (4 radio buttons: Last 24h, 7 days, 30 days, Any time)
     - Location (5 options: Nairobi, Mombasa, Kisumu, Nakuru, Remote)
     - Company (5 options: Safaricom, Equity Bank, KCB, KPMG, PwC)
     - Reset + Apply buttons
   - **Center Results Column:**
     - Results count + sort dropdown (Most Relevant, Newest, Recently Updated) + mobile filter button
     - 8 detailed job result cards with: company logo, job title, company link, verified badge, location, posted time, job type, experience level, 2-line excerpt, highlight pills (CPA-K, Health Insurance, etc.), Featured/New/Closing Soon badges, save/bookmark toggle
     - Jobs from: Safaricom, Equity Bank, KCB Group, KPMG, Britam, UNEP, PwC, Bata
     - CV Service Nudge after results (amber banner promoting CV writing from KSh 500)
     - Pagination (1 2 3 4 5 ... >)
   - **Right Results Sidebar (280px):**
     - Ad placeholder
     - Related Searches (6 suggestions with result counts)
     - Popular Tags (8 tags: CPA-K, IFRS, Excel, QuickBooks, Banking, Audit, Payroll, Sage)
     - Job Alerts Newsletter signup
     - Paid CV service ad
5. **Mobile Filter Drawer** — Bottom sheet filter drawer with drag handle, filter options, and Apply/Reset buttons (only visible on mobile)
6. **Footer + WhatsApp Float** — Exact shared components

**Technical Implementation:**
- Single HTML file with embedded CSS and JS
- JSON-LD SearchResultsPage + ItemList schema
- SEO meta tags (title, description, OG, Twitter, canonical)
- All SVG icons inline — zero external dependencies
- Functional JS: checkbox toggles, radio selection, filter chip removal, mobile filter drawer open/close
- overflow-x:hidden on html/body to prevent horizontal scroll
- All design system CSS variables match other prototypes exactly
- Responsive: desktop 3-col, tablet 2-col, mobile single-col with bottom-sheet filters

---
## Task ID: 6
### Work Task
Build a Blog Article (individual article view) page HTML prototype for JobReady.co.ke — the page users land on when clicking any blog post from the listing.

### Work Summary
- Read blog listing and homepage prototypes to extract shared design system and patterns
- Built complete blog article page at `/home/z/my-project/download/jobready-blog-article-prototype.html`
- Sample article: "How to Write a CV That Gets You Interviewed in Kenya — Complete 2026 Guide" by Grace Wanjiku

**Page Sections Built:**
1. **Top Bar + Header + Mobile Nav** — Exact shared components, `class="active"` on "Career Advice"
2. **Article Hero** — Blue gradient, 4-level breadcrumbs (Home > Career Advice > CV Writing Tips > Article Title), category tag, H1, subtitle, author row (avatar + name + title), stats (12 min read, 14,230 views, Jan 15 2026, updated Mar 20 2026)
3. **Article Layout (2 columns):**
   - **Left: Article Body** — White rounded card containing:
     - Share & Bookmark Bar (Twitter, Facebook, LinkedIn, WhatsApp, Copy Link + Save/Bookmark toggle)
     - Table of Contents (9 sections with numbered links, hidden on mobile)
     - Full Article Prose (~2,800 words) with rich formatting: H2/H3 headings, paragraphs, ordered lists, blockquotes, tip callout boxes (green), warning callout boxes (red), numbered step list, checklist with green checkmark icons, inline CV CTA banner (amber), image placeholder
     - 9 article sections covering CV writing comprehensively
     - Article Tags (6 tags as pill buttons)
   - **Right Sidebar (sticky):** CV Review CTA (amber, from KSh 500), Ad placeholder, Popular Articles (top 5 with numbered circles + views), Newsletter Signup, Popular Tags (10 tags), Paid CV Ad
4. **Reactions Bar** — 4 emoji reactions (Helpful, Love it, Insightful, Mind-blowing) with toggle + count functionality
5. **Author Bio Card** — Large avatar, name, title, 3-paragraph bio, stats (28 articles, 3,000+ coached, 185K views), Follow/Unfollow toggle button
6. **Related Articles** — 3-card grid with gradient strips, category tags, titles, read time, view counts
7. **Footer + WhatsApp Float** — Exact shared components (WhatsApp message contextualized: "I read your CV guide")
8. **Back to Top Button** — Appears on scroll, smooth scroll to top

**Article Content (9 sections, ~2,800 words):**
1. Why Your CV Matters More Than You Think
2. Understanding ATS Systems in Kenya
3. The Perfect CV Structure for 2026 (6-step numbered list)
4. Step-by-Step: Writing Each Section (Professional Summary + STAR method)
5. 10 Common CV Mistakes Kenyan Job Seekers Make (numbered list)
6. Free CV Templates for Kenyan Job Seekers
7. How to Tailor Your CV for Each Application
8. Professional CV Writing vs. DIY
9. Final CV Checklist Before Applying (10-item checklist with checkmarks)

**Technical Implementation:**
- JSON-LD Article schema + BreadcrumbList schema (4-level)
- Full article SEO: og:type=article, article:published_time, article:modified_time, article:author, article:section, article:tag
- Functional JS: reaction toggle with count, copy link with checkmark feedback, follow/unfollow toggle, bookmark toggle with filled heart, back-to-top visibility on scroll
- All SVG icons inline, zero external dependencies
- Responsive: desktop 2-col, tablet single-col, mobile single-col (TOC hidden, callouts stacked, author bio centered)
- All design system CSS variables match all other prototypes exactly
---
Task ID: 1
Agent: Main
Task: Cross-check all 8 prototypes against proposed DB schema

Work Log:
- Scanned all 8 HTML prototypes for data-dependent UI elements
- Checked for testimonials, FAQs, reactions, authors, comments, sharing, bookmarks, alerts, stats, ads, filters, badges, forms
- Compared every UI element against the proposed 16-table schema
- Identified 3 missing tables: authors, article_reactions, faqs
- Identified missing fields across jobs, companies, blog_articles tables
- Flagged hub config supporting multiple filter types (category, employment type, location, remote, org type)
- Noted edge cases: anonymous reactions, cached stats, featured companies

Stage Summary:
- Schema should expand from 16 to 17 tables
- 3 new tables needed: authors, article_reactions, faqs
- Key fields missing: isFeatured, isVerified, deadline, isRemote, slug, SEO meta fields, source tracking
- Hub config file needs multi-filter-type support (not just category)
- All enums remain in data.js file, not DB tables

---
Task ID: 2
Agent: Main
Task: Write Prisma schema, config files, and save all project deliverables

Work Log:
- Wrote complete Prisma schema: 24 tables for MySQL
- Saved schema to /home/z/my-project/download/jobready-project/prisma/schema.prisma
- Saved .env.example with all credentials (database, auth, email, SMS, M-Pesa, AdSense)
- Saved updated email_templates.js with JobReady-branded HTML templates
- Saved .gitignore for the project
- Organized all callback server files

Stage Summary:
- 24-table Prisma schema complete covering: auth, content, authoring, CMS, engagement, monetization, lead capture, compliance, analytics, advertising
- All enum data stays in data.js (not in database)
- Callback server architecture confirmed: Express on hosting → MySQL → Next.js reads
- .env.example ready with all credentials configured
- Files saved to /home/z/my-project/download/jobready-project/

---
Task ID: 3
Agent: Main
Task: Connect to MySQL and create all 28 database tables

Work Log:
- Updated database credentials: hostname da27.host-ww.net, database jobready_db, user jobready_db_admin
- Wrote complete Prisma schema (prisma/schema.prisma) with 28 MySQL tables, 325 total columns
- Fixed schema validation error: added missing savedArticles relation on BlogArticle model
- URL-encoded special characters in password (% → %25) for DATABASE_URL
- Resolved shell environment override issue (old SQLite DATABASE_URL was shadowing .env file)
- Pushed schema to MySQL via `npx prisma db push` — all 28 tables created successfully
- Verified all tables and key structures (users 17 cols, jobs 32 cols, orders 16 cols, payments 11 cols, companies 29 cols, blog_articles 21 cols, opportunities 25 cols)
- Confirmed indexes on jobs table (PRIMARY, slug, jobType, experienceLevel, category, location, companyId, isActive+publishedAt, isFeatured)
- Installed mysql2 package for direct MySQL testing
- Backed up final schema to /home/z/my-project/download/jobready-schema-mysql-final.prisma

Stage Summary:
- 28 MySQL tables created successfully on da27.host-ww.net:3306/jobready_db
- Tables: users, auth_accounts, companies, jobs, opportunities, blog_categories, blog_tags, article_tags, blog_articles, authors, site_pages, faqs, saved_jobs, saved_articles, job_alerts, article_reactions, notifications, service_tiers, orders, order_items, payments, order_activity, order_attachments, newsletter_subscriptions, data_requests, page_views, whatsapp_clicks, ad_placements
- Key design decisions: no enums in DB (data.js), no Location/JobCategory tables (config files), partial payment support, nullable userId for walk-in orders and anonymous reactions, M-Pesa checkoutRequestId tracking
- .env configured with URL-encoded MySQL credentials

---
## Task ID: 1-a - foundation-dev
### Work Task
Create Phase 1 Foundation files for JobReady.co.ke — site config, hub config, database client, SEO helpers, slug utilities, and format utilities. All files must be `.js` (no TypeScript).

### Work Summary
Created 6 foundation files as specified:

**1. `/src/config/site-config.js`**
- Complete site-wide configuration: name, domain, WhatsApp (primary CTA), social links, email addresses, ODPC/DPA compliance fields, homepage stats, SEO defaults, AdSense ID, navigation structure, top bar links, mobile nav extras, and full footer with 3 columns and legal links.

**2. `/src/config/hub-config.js`**
- 31 hub page definitions (23 job hubs + 8 opportunity hubs) covering:
  - Industry categories: Technology, Finance/Accounting, Engineering, Healthcare, Education, Sales/Marketing, Government, NGO, HR, Creative/Design, Legal, Logistics, Customer Service, Consulting
  - Employment types: Internships, Part-Time, Remote
  - Locations: Nairobi, Mombasa, Kisumu, Nakuru
  - Experience levels: Entry Level, Management/Executive
  - Opportunities: Scholarships, Grants, Fellowships, Bursaries, Competitions, Conferences, Volunteer, Apprenticeships
- Each hub has: slug, name, type, icon, description, metaTitle, heroSubtitle, and filters object for DB querying
- Helper functions: `getHubBySlug()`, `getJobHubs()`, `getOpportunityHubs()`

**3. `/src/lib/db.js`**
- Prisma Client singleton with globalThis pattern to prevent connection leaks during hot reload in development
- Query logging enabled only in development mode

**4. `/src/lib/seo.js`**
- `generateMeta()` — Returns Next.js Metadata object with title template (`Title | JobReady Kenya`), OG tags, Twitter cards, canonical URL, robots. Supports article-specific `publishedTime`/`modifiedTime`.
- `generateJobJsonLd()` — Google Jobs JobPosting JSON-LD with employment type mapping, salary (always included for ranking even when `showSalary` is false), remote flag, deadline, experience level
- `generateArticleJsonLd()` — Article schema with author, publisher, section, word count
- `generateOrganizationJsonLd()` — Organization schema with employee size parsing, founding date, ticker symbol, industry, sameAs links
- `generateBreadcrumbJsonLd()` — BreadcrumbList from `[{name, href}]` array
- `generateWebSiteJsonLd()` — WebSite + SearchAction for homepage sitelinks search

**5. `/src/lib/slug.js`**
- `generateSlug()` — Converts text to URL-safe slug, handles em-dashes, ampersands, special chars, limits to 80 chars
- `generateOrderNumber()` — Format `JR-YYYYMMDD-XXXX` with unambiguous alphanumeric random suffix (no 0,O,1,I)

**6. `/src/lib/format.js`**
- `formatCurrency()` — Formats KES amounts, abbreviates to `KSh 1.5M` for amounts ≥1M
- `formatDate()` — "Apr 4, 2026" format
- `formatRelativeDate()` — "just now", "2 hours ago", "3 days ago", "2 weeks ago", "3 months ago" with fallback to formatDate
- `formatReadingTime()` — Calculates from word count at 200 WPM, returns "5 min read"
- `truncateText()` — Truncates at word boundary with "..." suffix, default 120 chars

All files passed ESLint with zero errors. Dev server compiled successfully.
## Task ID: 7 - theme-setup
### Work Task
Set up the Tailwind CSS theme for JobReady.co.ke — update tailwind.config.ts and globals.css to map prototype CSS variables to Tailwind utility classes, removing all component-specific CSS in favor of Tailwind utilities.

### Work Summary
- **tailwind.config.ts**: Replaced entire config with JobReady theme. Kept `darkMode: "class"`, set content to `./src/**/*.{js,jsx,mdx}`, mapped all prototype colors as direct hex values (primary/dark/light, secondary/dark/light, accent/light, purple/light, danger/light, gray-50 through gray-900, white), added boxShadow (sm/DEFAULT/md/lg matching prototype), borderRadius (sm=6px/DEFAULT=8px/lg=12px/xl=16px), fontFamily with system font stack, maxWidth container=1200px, fontSize scale, and kept tailwindcss-animate plugin.
- **globals.css**: Stripped 382-line file down to 84 lines. Kept only: `@import "tailwindcss"`, box-sizing reset, `:root` CSS variables (colors, shadows, radii as source of truth for JSON-LD/SEO helpers), body base styles (font-family, color, background, line-height, -webkit-font-smoothing), `.container` utility, `::-webkit-scrollbar` styles, and `@keyframes wa-fade` animation. Removed all component-specific CSS classes (.top-bar, .header, .nav, .hero, .footer, .btn, .job-list-card, .sidebar-card, .company-jobs, .mobile-menu-btn, .cv-modal, .wa-float, .pain-trigger, .service-nudge, etc.) and all responsive media queries — these will now be handled entirely by Tailwind utility classes.
- Lint passes with zero errors. Dev server compiles successfully.

---
## Task ID: 8 - layout-components
### Work Task
Create 6 reusable layout components for JobReady.co.ke website in `src/app/(website)/_components/` — all `.jsx` files using only Tailwind utility classes, `lucide-react` icons, and data from `siteConfig`.

### Work Summary
Created 6 layout components matching the homepage prototype design, all converted from custom CSS classes to pure Tailwind utilities:

**1. `TopBar.jsx`**
- Server component (no `"use client"`)
- Dark bar (`bg-gray-900 text-gray-300 text-xs py-1.5`) hidden on mobile (`hidden md:flex`)
- Left links from `siteConfig.topBarLinks`, right links: WhatsApp (green), Career Advice, Our Services
- Uses Next.js `Link` component throughout

**2. `Header.jsx`**
- Client component with `useState` for mobile nav toggle
- Sticky white header (`bg-white border-b sticky top-0 z-[100] shadow-sm`) with `h-[68px]` desktop / `h-14` mobile
- Logo: custom SVG checkmark in blue box + "JobReady" in primary + ".co.ke" in gray-800
- Desktop nav (`hidden md:flex`) with `activeNav` prop — active link gets `text-primary font-semibold` + `after:` pseudo-element bottom border
- WhatsApp pill button (`hidden lg:inline-flex`) with green bg + custom WA SVG icon
- Sign In ghost button (`hidden md:inline-flex`)
- Hamburger menu button (`md:hidden`) using lucide `Menu` icon
- Exports `LogoSvg` and `WASvg` for reuse by MobileNav and CVModal
- Renders MobileNav as child with `isOpen`/`onClose` props

**3. `MobileNav.jsx`**
- Client component with `isOpen` boolean and `onClose` function props
- Full overlay (`fixed inset-0 z-[400] bg-black/40`) — clicking backdrop calls `onClose`
- Inner panel (`bg-white p-6 max-w-[320px] h-full overflow-y-auto shadow-lg`) slides from left
- Header: Logo (smaller) + Close button (lucide `X` with circular border)
- Navigation links: `siteConfig.nav` items with lucide icons (Briefcase, Clock, Building2, PenLine, FileText) + `siteConfig.mobileNavExtras` with mapped icons (Users, Landmark, GraduationCap)
- Divider + CTA section: "Get Your CV Done" (primary), "Chat on WhatsApp" (secondary with WA SVG), "Sign In" (outline)
- All links call `onClose` on click

**4. `Footer.jsx`**
- Server component
- `bg-gray-900 text-gray-300 pt-12 pb-6`
- 4-column grid: brand column (logo + description from config) + 3 link columns from `siteConfig.footer.columns`
- Each column: h4 title (white, semibold) + ul list of links (gray-400, hover white)
- Bottom bar: `border-t border-white/10` with copyright text and legal links separated by `·`
- Uses Next.js `Link` throughout

**5. `WhatsAppFloat.jsx`**
- Client component
- Fixed position (`fixed bottom-6 right-6 z-[300]`), mobile offset (`bottom-20 right-4`) for above mobile apply bar
- Tooltip: `animate-pulse` white card with "Chat with us on WhatsApp" (green) — hidden on mobile (`hidden md:block`)
- Button: `w-14 h-14 rounded-full bg-[#25D366]` with hover scale/shadow animation, `w-12 h-12` on mobile
- Custom WhatsApp SVG logo (full logo path), links to `siteConfig.whatsapp.link?text=Hi%20JobReady%2C%20I%20need%20help`

**6. `CVModal.jsx`**
- Client component with `useState` for `selectedService` and `selectedTier`
- Props: `isOpen`, `onClose`, `jobTitle` (string)
- Overlay: `fixed inset-0 z-[500] bg-black/50 backdrop-blur-sm`
- Modal: `bg-white rounded-2xl max-w-[480px] w-full max-h-[90vh] overflow-y-auto shadow-2xl`
- Step 1: Choose a service — 3 options (CV Writing, Cover Letter, LinkedIn Profile) with lucide icons (FileText, Mail, Linkedin)
- Step 2 (conditional): Choose a tier — 3 tier cards (Basic KSh 500, Professional KSh 1,500 with "Popular" badge, Premium KSh 3,500)
- Trust badges: ShieldCheck + "5,000+ CVs Written" + Clock + "24hr Delivery"
- Footer: "Get Started" primary button opens WhatsApp with pre-filled message including service, tier, and job title
- "Or chat directly on WhatsApp" fallback link below

**Also updated `page.jsx`** to use the new layout components from `(website)/_components/`.

- ESLint: zero errors. Dev server: compiles and renders successfully at `GET / 200`.

---
## Task ID: 9 - shared-components
### Work Task
Create 13 shared reusable components and the website layout wrapper for JobReady.co.ke in `src/app/(website)/_components/` and `src/app/(website)/layout.jsx`. All files must be `.jsx` (no TypeScript), use Tailwind utility classes only, `lucide-react` icons, mobile-first responsive design.

### Work Summary
Created all 14 files as specified. ESLint passes with zero errors, dev server compiles successfully.

**1. `Badge.jsx`** — Reusable badge/pill component with 6 variants (default, primary, success, danger, warning, purple) and 3 sizes (sm, md, lg). Server component.

**2. `CompanyLogo.jsx`** — Reusable company logo with 3 sizes (sm=36px, md=44px, lg=52px). Supports image URL or colored initial div with gradient fallback. Optional Link wrapper. Server component.

**3. `JobCard.jsx`** — Job listing card matching prototype `.jl-item` pattern. Horizontal flex layout with company logo (initials), title + badges (Featured/New/Urgent), company name with verified badge (ShieldCheck), meta row (location, type, experience, posted date with lucide icons), and save/bookmark heart toggle. Uses `formatRelativeDate` from format.js. Client component for save toggle.

**4. `JobCardGrid.jsx`** — Wrapper with section header (icon + title + "View All" link with ArrowRight) and white card container rendering JobCard children. Server component.

**5. `CategoryCard.jsx`** — Browse-by-category card matching prototype `.cat-card`. Colored icon div, name, job count. Hover lift animation. Server component.

**6. `OpportunityCard.jsx`** — Opportunity card matching prototype `.opp-card`. Type-colored label (scholarship=purple, bursary=primary, internship=secondary), title, provider, deadline/value bottom bar. Server component.

**7. `ArticleCard.jsx`** — Blog article card. Gradient strip by category, category pill, title, excerpt, author row with initials avatar. Uses `formatRelativeDate`. Server component.

**8. `DeadlineCard.jsx`** — Urgent deadline card matching prototype `.deadline-card`. Red left border, title + urgent tag, company, countdown timer. Expired state support. Server component.

**9. `SidebarCard.jsx`** — Generic sidebar card wrapper matching prototype `.sidebar-card`. Title with icon + border bottom, children slot. Server component.

**10. `CVReviewCTA.jsx`** — Amber CV review CTA card matching prototype `.cv-review-card`. Gradient background, FileText icon, description, CTA button to /cv-services, price strikethrough. Server component.

**11. `NewsletterForm.jsx`** — Client component with email input + subscribe button, loading state, error handling, success state, ShieldCheck trust text. Posts to /api/newsletter.

**12. `AdSlot.jsx`** — Ad placeholder with 3 positions (leaderboard, inline, sidebar) and styled border-dashed boxes. Server component.

**13. `Pagination.jsx`** — Client component with prev/next buttons, smart page number display (ellipsis for large ranges), active state styling, disabled at boundaries.

**14. `layout.jsx`** — Website layout wrapper for (website) route group. Composes TopBar → Header → main (min-h-screen) → Footer → WhatsAppFloat. Full SEO metadata with title template, description, keywords, OG, Twitter, robots, metadataBase, alternates.

---
Task ID: 2a
Agent: full-stack-developer
Task: Build complete homepage from prototype

Work Log:
- Read worklog.md, existing shared components (JobCard, JobCardGrid, CategoryCard, OpportunityCard, DeadlineCard, SidebarCard, CVReviewCTA, NewsletterForm, AdSlot), site-config.js, hub-config.js, seo.js, format.js, layout.jsx
- Read full homepage prototype HTML (1,462 lines) to extract all section designs and patterns
- Installed react-icons package for new homepage components
- Created mock-data.js with 16 trending/latest/featured/internship jobs, 3 urgent deadlines, 8 categories, 3 opportunities, 6 top employers, 4 sidebar featured jobs, trusted logos, quick links, locations — all with realistic Kenyan company names
- Built HeroSection.jsx as "use client" component with search form (input + location select + amber button), stats row, quick links, decorative radial gradients
- Built HomepageSidebar.jsx as server component (imports client NewsletterForm) with 9 sections: CVReviewCTA, AdSlot, Top Employers, Featured Jobs, Urgent Deadlines, Job Alerts newsletter, Browse by Location, Our Services CTA (blue gradient), AdSlot
- Rebuilt page.jsx at src/app/(website)/page.jsx as server component with generateMetadata for SEO and WebSite JSON-LD
- Deleted old src/app/page.jsx (which was outside the (website) route group) to avoid route conflict
- Homepage renders within (website)/layout.jsx which provides TopBar, Header, Footer, WhatsAppFloat
- 15 homepage sections built: Hero, Trusted By, Ad Leaderboard, Main Layout grid (left + right sidebar), Trending Jobs, Urgent Deadlines, Latest Jobs, Inline Ad, Featured Jobs, Service Nudge, Category Grid, Internship Opportunities, Scholarships & Opportunities, Document Writing CTA Strip, Paid Ad

Stage Summary:
- Homepage is fully built with all sections from prototype
- Mock data file allows homepage to work without database
- All new components use react-icons (FiZap, HiMagnifyingGlass, FiClock, FiFileText, FiSend, FiGlobe, FiMonitor, FiDollarSign, FiTool, FiHeart, FiFlag, FiMapPin, FiHome, FaGraduationCap, FaChartLine, FaAward, HiSparkles, HiShieldCheck)
- ESLint: zero errors. Dev server: GET / 200 successful
- Page is responsive: mobile-first with hidden quick links on mobile, single-column layout, 2-col on lg
- Architecture: page.jsx (server) → HeroSection (client) + HomepageSidebar (server with client NewsletterForm)

---
Task ID: 2-b
Agent: full-stack-developer (Opportunities + Search)
Task: Build Opportunities listing, Opportunity hubs, and Search results pages

Work Log:
- Read worklog.md and all existing shared components (OpportunityCard, JobCard, Pagination, CVReviewCTA, NewsletterForm, AdSlot, SidebarCard, Badge)
- Read hub-config.js, site-config.js, seo.js, format.js for data and utility patterns
- Read hub prototype HTML (jobready-hub-prototype.html) and search prototype HTML (jobready-search-prototype.html) for design reference
- Created Opportunities listing page with hero, filter tabs, featured section, all opportunities list, sidebar
- Created Opportunity Hub pages with dynamic route [hubSlug] using hub-config data
- Created Search Results page with search bar, filter sidebar, tab toggle (Jobs/Opportunities), trending searches, empty state
- All pages use react-icons (FiSearch, FiMapPin, FiAward, FiTrendingUp, FiChevronRight, FiBriefcase, FiAlertCircle)
- All pages use Tailwind utility classes only, no custom CSS
- All pages are .jsx (no TypeScript)
- All pages use mock data (no DB queries)
- ESLint passes with zero errors, dev server compiles successfully

Stage Summary:
- 10 files created across 3 pages:

**1. Opportunities Listing (`/opportunities`):**
- `src/app/(website)/opportunities/page.jsx` — Server component with SEO metadata, BreadcrumbList JSON-LD, featured opportunities grid, all opportunities list, sidebar (CV CTA, related hubs, newsletter, ad)
- `src/app/(website)/opportunities/_components/OpportunitySearchHero.jsx` — Client component with search form (input + location dropdown + amber button), stats row, decorative gradients
- `src/app/(website)/opportunities/_components/OpportunityFilters.jsx` — Client component with 9 type filter tabs (All, Scholarships, Grants, Fellowships, Bursaries, Competitions, Conferences, Volunteer, Apprenticeships) with color-coded active states
- `src/app/(website)/opportunities/_components/mock-data.js` — 12 mock opportunities across all types, 6 related hubs, stats

**2. Opportunity Hub Pages (`/opportunities/[hubSlug]`):**
- `src/app/(website)/opportunities/[hubSlug]/page.jsx` — Server component with generateStaticParams, dynamic metadata from hub-config, filtered mock data, related hubs sidebar, pagination, service nudge, breadcrumbs
- `src/app/(website)/opportunities/_components/OpportunityHubHero.jsx` — Hub-specific hero with icon, title, subtitle, description, stats, action button, breadcrumbs overlay

*<response clipped>*

**3. Search Results (`/search`):**
- `src/app/(website)/search/page.jsx` — Client component with useSearchParams, Suspense boundary, search bar, active filter chips, 3-column layout (filters + results + sidebar), no-query empty state with popular searches
- `src/app/(website)/search/_components/SearchBar.jsx` — Client component with search input, location dropdown, amber search button, clear query
- `src/app/(website)/search/_components/SearchFilters.jsx` — Client component with collapsible filter sections (Category, Job Type, Experience, Date Posted, Location, Company), checkbox/radio toggles, reset/apply buttons
- `src/app/(website)/search/_components/SearchResultsList.jsx` — Client component with Jobs/Opportunities tab toggle, result count, sort dropdown, mixed JobCard + OpportunityCard rendering, CV service nudge
- `src/app/(website)/search/_components/TrendingSearches.jsx` — Server component sidebar with trending searches, popular tags, newsletter form
- `src/app/(website)/search/_components/mock-data.js` — 6 mock job results, 4 mock opportunity results, filter options, trending searches, popular tags

---
Task ID: 2-a
Agent: full-stack-developer (Jobs System)
Task: Build Jobs listing, Job detail, and Job hub pages

Work Log:
- Read worklog.md, existing shared components (JobCard, JobCardGrid, Pagination, Badge, SidebarCard, CVReviewCTA, NewsletterForm, AdSlot, CompanyLogo), site-config.js, hub-config.js, seo.js, format.js, layout.jsx
- Read search prototype HTML (jobready-search-prototype.html) for filter sidebar, sort bar, and search layout design patterns
- Read job detail prototype HTML (jobready-prototype.html) for header, sidebar, mobile apply bar, tools bar, and service nudge patterns
- Created jobs listing mock data (20 jobs with realistic Kenyan data across 12+ categories), filter option arrays, sidebar trending jobs, popular tags
- Created job detail mock data (full Senior Software Engineer at Safaricom with rich HTML description, salary, deadline, company info, similar jobs, company jobs)
- Built 3 page-specific components for jobs listing: JobSearchHero.jsx, JobFilters.jsx, JobSortBar.jsx
- Built 6 page-specific components for job detail: JobDetailHeader.jsx, JobDetailBody.jsx, JobDetailSidebar.jsx, MobileApplyBar.jsx, JobToolsBar.jsx, ServiceNudge.jsx
- Built 2 page-specific components for job hubs: HubHero.jsx, RelatedHubs.jsx
- Built jobs listing page at /jobs with 3-column layout (filters, results, sidebar), search hero, sort bar, CV service nudge, pagination
- Built job detail page at /job/[slug] with 2-column layout (content, sidebar), breadcrumbs, JSON-LD, pain trigger, tools bar, mobile apply bar
- Built job hub page at /jobs/[hubSlug] with dynamic hub data from hub-config, filtered jobs, related hubs sidebar
- All new components use react-icons (FiMapPin, FiBriefcase, FiClock, FiHeart, FiShare2, FiCopy, FiFileText, FiUsers, HiMagnifyingGlass, HiChevronDown, HiShieldCheck, HiOutlineChatBubbleLeftRight, HiOutlineDocumentText, HiOutlineBookmark, HiOutlineBriefcase, HiAdjustmentsHorizontal)
- All pages use Tailwind utility classes only, no custom CSS, no shadcn components
- All files are .jsx (no TypeScript)
- All pages use mock data (no DB queries)
- ESLint passes with zero errors

Stage Summary:
- 15 files created across 3 pages:

**1. Jobs Listing Page (`/jobs`):**
- `src/app/(website)/jobs/page.jsx` — Server component with SEO metadata, 3-column grid layout
- `src/app/(website)/jobs/_components/JobSearchHero.jsx` — Client component with search form, stats, quick links
- `src/app/(website)/jobs/_components/JobFilters.jsx` — Client component with 5 collapsible filter sections (Category, Job Type, Experience, Location, Remote toggle)
- `src/app/(website)/jobs/_components/JobSortBar.jsx` — Client component with results count, sort dropdown, mobile filter button
- `src/app/(website)/jobs/_components/mock-data.js` — 20 jobs, filter options, sidebar data, popular tags

**2. Job Detail Page (`/job/[slug]`):**
- `src/app/(website)/job/[slug]/page.jsx` — Server component with generateMetadata, JobPosting + BreadcrumbList JSON-LD, pain trigger, 2-column layout
- `src/app/(website)/job/_components/JobDetailHeader.jsx` — Client component with company logo, title, meta strip, tags, action buttons (WhatsApp apply, CV tailored, bookmark, share)
- `src/app/(website)/job/_components/JobDetailBody.jsx` — Server component with rich HTML job description
- `src/app/(website)/job/_components/JobDetailSidebar.jsx` — Client component with apply card (salary bar, deadline, overview), similar jobs, company jobs
- `src/app/(website)/job/_components/JobToolsBar.jsx` — Client component with copy link, WhatsApp share, Twitter share, save toggle
- `src/app/(website)/job/_components/MobileApplyBar.jsx` — Client component with sticky bottom bar on mobile (deadline + apply button)
- `src/app/(website)/job/_components/ServiceNudge.jsx` — Server component with CV service CTA
- `src/app/(website)/job/_components/mock-data.js` — Full job detail mock data with HTML description

**3. Job Hub Pages (`/jobs/[hubSlug]`):**
- `src/app/(website)/jobs/[hubSlug]/page.jsx` — Server component with dynamic hub data, filtered jobs, 3-column layout, 404 handling
- `src/app/(website)/jobs/_components/HubHero.jsx` — Server component with icon, title, subtitle, description, job count, breadcrumbs
- `src/app/(website)/jobs/_components/RelatedHubs.jsx` — Server component with related hub links sidebar

Key decisions:
- Job detail URL is `/job/[slug]` (singular), hub URL is `/jobs/[hubSlug]` (plural)
- All icons in new components use react-icons (not lucide-react)
- Filter sidebar is hidden on mobile; sort bar shows a "Filters" button placeholder
- Hub pages filter jobs client-side from mock data based on hub-config filter definitions
- Mobile apply bar is fixed bottom with deadline info and green WhatsApp apply button
- Job description uses dangerouslySetInnerHTML for rich HTML content (mock data only)

---
Task ID: 2-c
Agent: full-stack-developer (Blog + Services + Companies)
Task: Build Career Advice, Blog Article, CV Services, Companies listing, and Company Profile pages

Work Log:
- Read worklog.md and all existing shared components (ArticleCard, CompanyLogo, Pagination, CVReviewCTA, NewsletterForm, AdSlot, SidebarCard, Badge, JobCard)
- Read site-config.js, seo.js, format.js for data patterns and utility functions
- Read blog listing prototype, blog article prototype, and company prototype HTML for design reference
- Created Career Advice listing page with hero, featured article, category filter pills, article grid, sidebar
- Created Blog Article page with article header, share buttons, table of contents, rich article body, author bio, tags, reactions, related articles, sidebar
- Created CV Services page with hero, trust stats, service cards, pricing table, how it works, testimonials, FAQ accordion, final CTA
- Created Organizations listing page with hero, company filters, company grid, sidebar with featured companies
- Created Company Profile page with company header, about section, stats bar, job listings with filter pills, sidebar with similar companies
- All pages use react-icons (FiStar, FiChevronRight, FiFileText, FiMessageCircle, FiShieldCheck, FiBriefcase, FaWhatsapp, etc.)
- All pages use Tailwind utility classes only, no custom CSS
- All pages are .jsx (no TypeScript)
- All pages use mock data (no DB queries)
- ESLint passes with zero errors, dev server compiles successfully

Stage Summary:
- 29 files created across 5 pages:

**1. Career Advice Listing (`/career-advice`):**
- `src/app/(website)/career-advice/page.jsx` — Server component with SEO metadata, Blog + BreadcrumbList JSON-LD, hero, featured article, main layout with sidebar
- `src/app/(website)/career-advice/_components/mock-data.js` — 10 mock articles with realistic Kenyan career topics, categories, popular articles, sidebar categories, popular tags
- `src/app/(website)/career-advice/_components/FeaturedArticle.jsx` — Large blue gradient featured card with category, title, excerpt, author, CTA
- `src/app/(website)/career-advice/_components/ArticleCategoryPills.jsx` — Client component with 8 filter pills (All, CV Tips, Interview Prep, etc.)
- `src/app/(website)/career-advice/_components/CareerAdviceClient.jsx` — Client component with article grid, filtering, pagination, load more
- `src/app/(website)/career-advice/_components/PopularArticles.jsx` — Sidebar widget with top 5 popular articles

**2. Blog Article (`/career-advice/[slug]`):**
- `src/app/(website)/career-advice/[slug]/page.jsx` — Async server component with Article + BreadcrumbList JSON-LD, dynamic metadata
- `src/app/(website)/career-advice/[slug]/_components/mock-data.js` — Full mock article data, author, related articles
- `src/app/(website)/career-advice/[slug]/_components/article-content.js` — Rich HTML content with headings, lists, blockquotes, tip/warning callouts, checklist, CV CTA
- `src/app/(website)/career-advice/[slug]/_components/ArticleHeader.jsx` — Blue gradient hero with breadcrumbs, category tag, title, author, stats
- `src/app/(website)/career-advice/[slug]/_components/ShareButtons.jsx` — Client component with Twitter, Facebook, LinkedIn, WhatsApp, Copy Link
- `src/app/(website)/career-advice/[slug]/_components/ArticleBody.jsx` — Client component with TOC (smooth scroll) and dangerouslySetInnerHTML for prose
- `src/app/(website)/career-advice/[slug]/_components/AuthorBio.jsx` — Client component with avatar, name, title, bio, stats, social links, follow toggle
- `src/app/(website)/career-advice/[slug]/_components/ArticleTags.jsx` — Tag pills
- `src/app/(website)/career-advice/[slug]/_components/ArticleSidebar.jsx` — Client component with CV CTA, ad slot, bookmark save

**3. CV Services (`/cv-services`):**
- `src/app/(website)/cv-services/page.jsx` — Server component with SEO, hero with trust stats, service cards, pricing table, how it works, testimonials, FAQ, final CTA
- `src/app/(website)/cv-services/_components/mock-data.js` — 3 services with tiers, 3 testimonials, 6 FAQs, 4 how-it-works steps, pricing comparison table, WhatsApp link helper
- `src/app/(website)/cv-services/_components/ServiceCard.jsx` — Service card with icon, description, price range, tier list, CTA
- `src/app/(website)/cv-services/_components/HowItWorks.jsx` — 4-step process with icons and connector lines
- `src/app/(website)/cv-services/_components/Testimonials.jsx` — 3 testimonial cards with star ratings
- `src/app/(website)/cv-services/_components/PricingTable.jsx` — Client component with 10-row comparison table (Basic vs Professional vs Premium)
- `src/app/(website)/cv-services/_components/FAQAccordion.jsx` — Client component with 6 accordion items

**4. Organizations Listing (`/organizations`):**
- `src/app/(website)/organizations/page.jsx` — Client component with hero, filters, company grid, sidebar, pagination
- `src/app/(website)/organizations/_components/mock-data.js` — 10 mock Kenyan companies, industries, sizes, locations, featured companies, browse industries
- `src/app/(website)/organizations/_components/CompanyCard.jsx` — Company card with logo, name, verified badge, industry, location, jobs count
- `src/app/(website)/organizations/_components/CompanyFilters.jsx` — Client component with industry, size, location filter pills

**5. Company Profile (`/organizations/[slug]`):**
- `src/app/(website)/organizations/[slug]/page.jsx` — Async server component with Organization + BreadcrumbList JSON-LD, dynamic metadata, company header, about, stats, job listings
- `src/app/(website)/organizations/[slug]/_components/mock-data.js` — Full Safaricom mock data, 8 mock jobs, 5 similar companies
- `src/app/(website)/organizations/[slug]/_components/CompanyProfileHeader.jsx` — Green gradient hero with logo, name, verified badge, stat pills
- `src/app/(website)/organizations/[slug]/_components/CompanyStats.jsx` — 3-stat grid (Open Jobs, Total Hires, Employees)
- `src/app/(website)/organizations/[slug]/_components/CompanyInfo.jsx` — Sidebar company info card with key details

- All WhatsApp CTAs use siteConfig.whatsapp.link with contextual pre-filled messages
- Key conversion page (CV Services) has compelling hero, trust badges, multiple CTAs, testimonials, and final conversion banner
---
Task ID: 4
Agent: full-stack-developer (CSS Review)
Task: Comprehensive spacing review and fixes across the entire JobReady.co.ke website

Work Log:
- Read worklog.md to understand project state (28 MySQL tables, multiple pages, shared components)
- Audited all 60+ .jsx files for spacing issues
- Fixed non-standard Tailwind values: `p-5.5` → `p-6` in SidebarCard, CVReviewCTA, OpportunityCard, HomepageSidebar
- Fixed non-standard `px-4.5` → `px-5`, `pt-4.5` → `pt-5` in OpportunityCard
- Fixed globals.css `.container` to use responsive padding (16px/24px/32px at sm/md/lg breakpoints)
- Added `pb-8` bottom padding to main element in (website)/layout.jsx
- Fixed TopBar: `py-1.5` → `py-2`, `gap-5` → `gap-6`, `px-5` → `px-4 sm:px-6`
- Fixed Header: nav `gap-0.5` → `gap-1`, actions `gap-2` → `gap-3`, `px-5` → `px-4 sm:px-6`
- Fixed Footer: `pt-12 pb-6` → `pt-14 pb-8`, `gap-9` → `gap-10`, bottom bar `pt-5` → `pt-6`
- Fixed MobileNav: divider `my-4` → `my-5`, CTA `gap-2.5` → `gap-3`
- Fixed JobCard: `py-3.5 gap-3.5` → `py-4 gap-4`
- Fixed ArticleCard: `p-5` → `p-5 md:p-6`, excerpt `mb-3` → `mb-4`
- Fixed SidebarCard: `p-5.5 mb-5` → `p-6 mb-6`, header `mb-3.5 pb-2.5` → `mb-4 pb-3`
- Fixed DeadlineCard: `p-4 mb-1.5` → `p-5 mb-2`
- Fixed OpportunityCard: all `px-4.5` → `px-5`, `mb-1.5` → `mb-2`
- Fixed CategoryCard: `p-5` → `p-5 md:p-6`, icon `w-11 mb-2.5` → `w-12 mb-3`
- Fixed AdSlot: leaderboard `py-4` → `py-6`, inline `my-5` → `my-8`, sidebar `mb-5` → `mb-6`
- Fixed CVReviewCTA: `p-5.5 mb-5` → `p-6 mb-6`
- Fixed Pagination: `mt-6` → `mt-8`
- Fixed JobCardGrid: header `mb-4` → `mb-6`, card container `py-5` → `py-6`
- Fixed HeroSection: `py-14 md:py-14 lg:py-[56px]` → `py-12 md:py-16 lg:py-20`, stats `mt-6` → `mt-8`, quick links `mt-5` → `mt-6`
- Fixed HomepageSidebar: services CTA `p-5.5 mb-5` → `p-6 mb-6`
- Fixed Homepage (page.jsx): Trusted By `py-5` → `py-8 md:py-10`, main grid `gap-7 py-7` → `gap-8 py-10 md:py-14`, card grids `gap-3.5` → `gap-4 md:gap-5`
- Fixed JobSearchHero & HubHero: `py-10 md:py-12` → `py-12 md:py-16`, `px-5` → `px-4 sm:px-6`
- Fixed JobsContent: grid `gap-6 py-6` → `gap-8 py-10 md:py-14`, card `mb-5` → `mb-6`
- Fixed JobSortBar: `mb-4` → `mb-6`
- Fixed Job detail page: breadcrumbs `py-3.5` → `py-4`, grid `gap-7` → `gap-8`, pain trigger `mt-5` → `mt-6`
- Fixed JobDetailBody: `mt-5` → `mt-6`
- Fixed JobDetailSidebar: apply card `mb-5` → `mb-6`
- Fixed ServiceNudge: `mt-5` → `mt-6`
- Fixed JobToolsBar: `mt-5` → `mt-6`
- Fixed Opportunities page: main `py-7 gap-7` → `py-10 md:py-14 gap-8`
- Fixed OpportunitySearchHero: `py-10 md:py-14` → `py-12 md:py-16`
- Fixed OpportunityFilters: `px-5` → `px-4 sm:px-6`
- Fixed Search page: `py-5` → `py-10 md:py-14`, grid `gap-6 pb-12` → `gap-8 pb-16`
- Fixed Career Advice listing: hero `py-12 md:py-16` → `py-14 md:py-20`, grid `gap-6 pt-0 pb-10` → `gap-8 pt-8 pb-16`
- Fixed Career Advice article: `py-8 md:py-10` → `py-10 md:py-14`
- Fixed CV Services page: hero `py-14 md:py-20` → `py-16 md:py-20`, sections `py-12` → `py-14 md:py-16`, trust/testimonials `py-8/12` → `py-10 md:py-14`
- Fixed Organizations listing: `py-8` → `py-10 md:py-14`, grid `gap-6` → `gap-8`
- Fixed Organization profile: breadcrumbs `py-3` → `py-4`, grid `py-8` → `py-10 md:py-14`
- Standardized all container horizontal padding from `px-5` to `px-4 sm:px-6` across all pages/components
- Fixed missing `id` attribute on Script tag in organizations/page.jsx (lint error)
- ESLint: zero errors. Dev server: GET / 200 successful.

Stage Summary:
- Fixed spacing across 40+ files with consistent spacing system
- Key spacing rules applied:
  - Container padding: `px-4 sm:px-6` (responsive)
  - Section gaps: `py-10 md:py-14 lg:py-16`
  - Card padding: `p-5 md:p-6`
  - Card gaps: `gap-4 md:gap-6`
  - Grid gaps: `gap-8` between page layout columns
  - Sidebar widget gaps: `mb-6` consistently
  - Hero sections: `py-12 md:py-16 lg:py-20`
  - Pagination: `mt-8`
  - Section headers: `mb-6`
  - Between breadcrumbs and content: `mb-6`
  - Footer: `pt-14 pb-8`
- Eliminated all non-standard Tailwind values (p-5.5, px-4.5, pt-4.5, py-3.5)
- No colors, fonts, or layout structure were changed — only spacing

---
## Task ID: 3A - auth-infrastructure
### Work Task
Build Phase 3A — Authentication Infrastructure for JobReady.co.ke. Install dependencies, create auth utility with NextAuth v4 JWT strategy, create route handlers for NextAuth endpoints, create 5 auth API routes (register, send-otp, verify-otp, forgot-password, reset-password), create useAuth client hook, and create middleware for dashboard route protection.

### Work Summary

**Dependencies Installed:**
- `bcryptjs` — Password hashing (12 salt rounds)
- `jsonwebtoken` — JWT token utilities (available for future use)
- `next-auth@4` was already in package.json

**Environment Configuration:**
- Added `NEXTAUTH_SECRET` and `NEXTAUTH_URL=http://localhost:3000` to `.env`

**Files Created (11 new files + 2 modified):**

1. **`src/lib/auth.js`** — NextAuth v4 configuration
   - JWT strategy (30-day session maxAge)
   - Custom `jwt` callback embedding user.id, name, email, phone, avatar, emailVerified, phoneVerified
   - Custom `session` callback exposing embedded data to client
   - CredentialsProvider with email/password login, bcrypt password verification, lastLoginAt update
   - GoogleOAuthProvider placeholder (commented, for Batch 3C)
   - Custom pages: signIn → `/auth/login`, error → `/auth/login`
   - Sign-in/sign-out event logging

2. **`src/app/api/auth/[...nextauth]/route.js`** — NextAuth route handler
   - Exports GET and POST handlers wrapping NextAuth(authOptions)

3. **`src/app/api/auth/register/route.js`** — Registration API
   - Validates name (min 2 chars), email (regex), phone (Kenyan format +2547XX/07XX, optional), password (min 8 chars)
   - Normalizes phone to 254XXXXXXXXX format
   - Checks for existing email/phone
   - Hashes password with bcrypt (12 rounds)
   - Creates User + AuthAccount(provider: "email") in Prisma transaction
   - Returns user without passwordHash (201)
   - Handles P2002 unique constraint violations (409)

4. **`src/app/api/auth/send-otp/route.js`** — Send OTP API
   - Validates phone number (Kenyan format)
   - Rate limiting: rejects if OTP sent within last 60 seconds (429)
   - Generates 6-digit OTP (crypto.randomInt), 10-minute expiry
   - Upserts AuthAccount(provider: "phone") with OTP in accessToken field
   - Logs OTP to console for development (SMS integration is TODO)

5. **`src/app/api/auth/verify-otp/route.js`** — Verify OTP API
   - Validates phone + 6-digit OTP
   - Finds AuthAccount by phone, checks OTP match + expiry
   - Finds or creates user (placeholder email for phone-only users)
   - Marks phoneVerified: true, updates lastLoginAt
   - Links auth account to user, deletes OTP record
   - Handles P2002 for email conflicts

6. **`src/app/api/auth/forgot-password/route.js`** — Forgot Password API
   - Validates email, finds user (always returns same success message to prevent email enumeration)
   - Checks for password (OAuth-only users skipped)
   - Generates 32-byte hex reset token (crypto.randomBytes), 1-hour expiry
   - Deletes existing reset tokens, creates new AuthAccount(provider: "reset")
   - Logs reset URL to console (email integration is TODO)

7. **`src/app/api/auth/reset-password/route.js`** — Reset Password API
   - Validates token (min 32 chars) + newPassword (min 8, requires uppercase + lowercase + number)
   - Finds reset token in AuthAccount, checks expiry
   - Hashes new password, updates user passwordHash
   - Deletes all reset tokens for user (transaction)
   - Handles expired tokens (auto-deletes)

8. **`src/lib/useSession.js`** — Custom auth hook
   - `"use client"` component
   - Wraps NextAuth useSession with convenience flags
   - Returns: user, session, isLoading, isAuthenticated, isUnauthenticated, isJobSeeker
   - Provides: login(credentials), loginWithRedirect(credentials), logout(options), refresh()

9. **`src/middleware.js`** — Route protection middleware
   - Protected routes: `/dashboard/*`
   - Public routes: /, /auth/* (login, register, forgot-password, reset-password)
   - Public prefixes: /jobs, /job/, /opportunities, /career-advice, /cv-services, /organizations, /search, /api/auth, /api/newsletter, /_next
   - Static file bypass (images, fonts, icons)
   - Redirects unauthenticated users to `/auth/login?callbackUrl=...`
   - Matcher excludes static files

10. **`src/components/AuthProvider.jsx`** — NextAuth SessionProvider wrapper
    - `"use client"` component wrapping children in SessionProvider
    - Required for useSession/useAuth hooks to work

**Files Modified (2):**
- **`src/app/layout.jsx`** — Added AuthProvider wrapper around children in root layout
- **`.env`** — Added NEXTAUTH_SECRET and NEXTAUTH_URL

**Key Technical Notes:**
- All files are `.js` or `.jsx` (no TypeScript) as per project rules
- Uses `{ db }` named import from `@/lib/db` (matching existing `db.ts` export)
- All API routes use try/catch with proper HTTP status codes (400, 401, 404, 409, 429, 500)
- Prisma transactions used for atomic multi-model operations
- Auth uses AuthAccount table for multi-provider support (not NextAuth's default Account model)

**Verification:**
- ESLint: zero errors
- `npx prisma generate`: successful
- `npm run build`: successful — all 6 API routes registered as dynamic (ƒ)
  - `/api/auth/[...nextauth]`
  - `/api/auth/forgot-password`
  - `/api/auth/register`
  - `/api/auth/reset-password`
  - `/api/auth/send-otp`
  - `/api/auth/verify-otp`
---
## Task ID: 3B - frontend-developer
### Work Task
Build Phase 3B — Authentication Pages for JobReady.co.ke. Create auth layout, 6 auth pages (login, register, forgot-password, reset-password, verify-email, verify-phone), and 5 shared auth components (InputField, AuthCard, PasswordStrength, OtpInput, SocialLoginButtons). All files must be .jsx (no TypeScript), use plain Tailwind only (no shadcn/ui for auth), React Icons, brand colors #1a56db / #f59e0b.

### Work Summary
Created 13 files across auth layout, 6 auth pages, and 5 shared components. All files are .jsx using plain Tailwind CSS (no shadcn/ui), React Icons (FiMail, FiLock, FiPhone, FiArrowRight, FiLoader, FiCheck, FiAlertCircle, FiEye, FiEyeOff, FiUser, FiArrowLeft). ESLint passes with zero errors, dev server compiles successfully, all 6 auth pages return HTTP 200.

**Auth Layout (`src/app/(auth)/layout.jsx`):**
- Clean standalone layout with NO TopBar/Header/Footer
- `min-h-screen bg-gray-50` background
- SEO metadata with title template "Sign In | JobReady Kenya"
- Root layout already provides AuthProvider (SessionProvider)

**Shared Auth Components (`src/app/(auth)/_components/`):**

1. **`AuthCard.jsx`** — Card wrapper with centered layout, JobReady logo, white card with shadow, subtle decorative background circles. Max-width 440px, responsive padding.

2. **`InputField.jsx`** — Reusable input with label, left icon support, password show/hide toggle (FiEye/FiEyeOff), error display, helper text. Supports text/email/password/tel/number types. Focus ring in brand blue.

3. **`PasswordStrength.jsx`** — Visual password strength indicator with progress bar and 5 checks (length 8+, A-Z, a-z, 0-9, special chars). Three levels: Weak (red, 1/3 bar), Fair (amber, 2/3 bar), Strong (green, full bar). Shows requirement badges.

4. **`OtpInput.jsx`** — 6-digit OTP input with 6 individual boxes. Auto-focus to next on input, backspace goes to previous, supports paste event (full OTP), keyboard arrow navigation, focused state ring.

5. **`SocialLoginButtons.jsx`** — Google login button with inline Google SVG logo (multi-color), uses `signIn("google")` from next-auth/react. Divider with "OR" text. Loading spinner state.

**Auth Pages (`src/app/(auth)/auth/`):**

1. **Login (`/auth/login`):**
   - Two-tab interface: Email / Phone
   - Email tab: email + password inputs with FiMail/FiLock icons, "Forgot password?" link, Sign In button with loading spinner, SocialLoginButtons, "Don't have an account? Sign Up" link
   - Phone tab: phone input with +254 prefix (numeric only), "Send OTP" button → shows 6-digit OtpInput with "Verify & Sign In" button, 60-second resend countdown, "Use different number" back button
   - Form validation with inline errors
   - Uses `signIn("credentials", { redirect: false })` from next-auth/react
   - Uses `useAuth()` from `@/lib/useSession` — redirects if already authenticated
   - Reads `callbackUrl` and `error` from URL search params
   - Error messages for OAuth errors (OAuthAccountNotLinked, CredentialsSignin, etc.)

2. **Register (`/auth/register`):**
   - Full Name, Email, Phone (optional with +254 prefix), Password (with strength indicator), Confirm Password, Terms checkbox
   - Complete form validation: name min 2 chars, email format, Kenyan phone format, password min 8 chars, password match, terms required
   - Custom styled checkbox with FiCheck icon
   - POSTs to `/api/auth/register`
   - On success: redirects to `/auth/login?registered=true`
   - Success state screen with green checkmark when `registered=true` param present
   - SocialLoginButtons for Google sign-up
   - "Already have an account? Sign In" link

3. **Forgot Password (`/auth/forgot-password`):**
   - "Reset your password" heading with instructional text
   - Email input with FiMail icon
   - "Send Reset Link" button with loading state
   - Success state: green checkmark, "Check your email" message, "try again" link, "Back to Sign In" button
   - Back to Sign In link at top with FiArrowLeft
   - POSTs to `/api/auth/forgot-password`

4. **Reset Password (`/auth/reset-password?token=xxx`):**
   - Wrapped in Suspense for useSearchParams
   - Token validation on mount (must be 32+ chars)
   - Invalid token state: red alert with "Request New Link" button
   - New Password + Confirm Password with PasswordStrength
   - POSTs to `/api/auth/reset-password` with token + newPassword
   - Success state: green checkmark, redirect to `/auth/login?reset=true`
   - Back to Sign In link

5. **Verify Email (`/auth/verify-email?token=xxx`):**
   - Wrapped in Suspense for useSearchParams
   - Three states: loading (spinner), success (green checkmark), error (red alert)
   - Simulated verification for development (TODO: actual API call)
   - "Continue to Sign In" button on success

6. **Verify Phone (`/auth/verify-phone?phone=xxx`):**
   - Wrapped in Suspense for useSearchParams
   - Reads phone from URL params
   - No-phone state: amber warning with "Go to Sign In" button
   - Phone display in gray card with FiPhone icon
   - OtpInput with "Verify" button
   - Resend OTP with 60-second countdown
   - POSTs to `/api/auth/verify-otp` and `/api/auth/send-otp`
   - Success state: green checkmark, "Continue to Sign In"

**Design Consistency:**
- Card: `bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100`
- Input: `border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]`
- Primary button: `bg-[#1a56db] hover:bg-[#1e40af] text-white rounded-xl font-semibold text-sm`
- Error text: `text-xs text-red-500 mt-1`
- Links: `text-[#1a56db] hover:underline font-medium`
- Loading spinner: FiLoader with `animate-spin`
- All pages use AuthCard wrapper with JobReady logo

**File Structure:**
```
src/app/(auth)/
├── layout.jsx
├── _components/
│   ├── AuthCard.jsx
│   ├── InputField.jsx
│   ├── PasswordStrength.jsx
│   ├── OtpInput.jsx
│   └── SocialLoginButtons.jsx
└── auth/
    ├── login/page.jsx
    ├── register/page.jsx
    ├── forgot-password/page.jsx
    ├── reset-password/page.jsx
    ├── verify-email/page.jsx
    └── verify-phone/page.jsx
```

**Integration Notes:**
- All auth pages integrate with existing API routes: `/api/auth/register`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/send-otp`, `/api/auth/verify-otp`
- Login page uses NextAuth `signIn("credentials")` for email login
- SocialLoginButtons uses NextAuth `signIn("google")` (Google provider commented out in auth.js — placeholder ready)
- AuthProvider (SessionProvider) comes from root layout — no duplication in auth layout
- All auth URLs match NextAuth config: `pages.signIn = "/auth/login"`, `pages.error = "/auth/login"`
- Header component links to `/auth/login` — correctly routes to auth login page

---
Task ID: 3B-suspense
Agent: sub-agent
Task: Add Suspense boundaries to all auth pages that use useSearchParams()

Work Log:
- Read login/page.jsx (reference pattern), register/page.jsx, reset-password/page.jsx, verify-phone/page.jsx, verify-email/page.jsx
- Found that reset-password, verify-phone, and verify-email already had Suspense boundaries applied
- Only register/page.jsx was missing the Suspense wrapper
- Added `Suspense` to React import, renamed `export default function RegisterPage()` → `function RegisterForm()`, added new `export default function RegisterPage()` wrapping `RegisterForm` in `<Suspense>` with AuthCard + FiLoader fallback
- Build passed successfully with zero errors

Stage Summary:
- 1 file modified: `src/app/(auth)/register/page.jsx`
- 3 files already correct: reset-password/page.jsx, verify-phone/page.jsx, verify-email/page.jsx
- login/page.jsx left untouched as instructed
- `npm run build` completes successfully

---
## Task ID: 3C - fullstack-developer
### Work Task
Build Phase 3C: Google OAuth, Session Management, User Menu, and Protected Routes for JobReady.co.ke

### Work Summary

**Files Modified (3):**

1. **`src/lib/auth.js`** — Completed Google OAuth Provider
   - Added `GoogleProvider` import from `next-auth/providers/google`
   - Configured GoogleProvider with `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `authorization` params (consent + offline access)
   - Added `signIn` callback: handles Google OAuth sign-in by finding/creating `User` + `AuthAccount(provider: "google")` records. Updates tokens on re-login, marks email as verified, updates name/avatar from Google profile.
   - JWT and session callbacks unchanged (already correct for embedding user data)

2. **`src/middleware.js`** — Improved route protection
   - Added more auth-related routes to `publicPrefixes`: `/api/user`, `/api/jobs`, `/api/opportunities`, `/api/blog`, `/api/companies`, `/auth`
   - Added `/verify-email`, `/verify-phone` to `publicRoutes` array
   - Added `/uploads`, `/static` to static file allowlist
   - Protected routes remain: `/dashboard/*` → redirect to `/auth/login?callbackUrl=...`
   - Updated matcher to exclude font files (woff, woff2)

3. **`.env`** — Added Google OAuth placeholders
   - `GOOGLE_CLIENT_ID=your-google-client-id-here` with setup instructions in comments
   - `GOOGLE_CLIENT_SECRET=your-google-client-secret-here` with instructions

**Files Created (4):**

4. **`src/components/ProtectedRoute.jsx`** — Client-side route guard
   - Uses `useAuth()` hook to check authentication state
   - Loading state: full-page centered spinner with "Loading your session..."
   - Unauthenticated: redirects to `/auth/login?callbackUrl={encoded pathname}`
   - Authenticated: renders children

5. **`src/app/api/user/profile/route.js`** — User profile API
   - `GET`: returns user profile (name, email, phone, avatar, bio, location, linkedinUrl, education, skills, cvUrl, verification status, timestamps, relation counts)
   - `PUT`: updates profile fields (name, bio, location, linkedinUrl, education, skills) with validation (non-empty name, URL format for LinkedIn, max 20 skills)
   - Both endpoints require authentication via `getServerSession(authOptions)`, return 401 if unauthenticated

6. **`src/app/api/user/avatar/route.js`** — Avatar upload API
   - `POST`: accepts multipart/form-data with `avatar` field
   - Validates file type (JPEG, PNG, GIF, WebP) and size (max 2MB)
   - Saves to `public/uploads/avatars/{userId}-{timestamp}.{ext}`
   - Updates `user.avatar` in DB with the public URL path
   - Requires authentication, returns 401 if unauthenticated

7. **`src/app/(website)/_components/Header.jsx`** — Added user menu dropdown
   - Imports `useAuth` from `@/lib/useSession` and `signOut` from `next-auth/react`
   - New `UserMenu` component: avatar circle with first initial (or user image), click-to-toggle dropdown
   - Dropdown features: user name + email header, links to Dashboard/Profile/Saved Jobs/Job Alerts with lucide icons, divider, Sign Out button
   - Click-outside-to-close via `useRef` + `mousedown`/`touchstart` listeners
   - When authenticated: UserMenu replaces "Sign In" button on desktop
   - When not authenticated: "Sign In" button remains as-is

8. **`src/app/(website)/_components/MobileNav.jsx`** — Added user section for mobile
   - When authenticated: shows user info card (avatar + name + email), dashboard links (Dashboard, Profile, Saved Jobs, Job Alerts), Sign Out button replaces Sign In
   - When not authenticated: Sign In button remains as-is
   - Dashboard links use primary-colored icons to distinguish from regular nav

**File Verified (1):**
- `src/app/api/auth/[...nextauth]/route.js` — Already correct: exports GET and POST using NextAuth handler with authOptions

**Build Results:**
- ESLint: zero errors
- Dev server: all pages compile successfully, `GET / 200` responses normal
---
## Task ID: 2i - frontend-developer
### Work Task
Build 5 Legal/CMS pages for JobReady.co.ke: About, Contact, Privacy Policy, Terms of Service, and Cookie Policy. Also create a shared LegalLayout component.

### Work Summary
Created 7 files across 5 pages + 1 shared component. All files are `.jsx` (no TypeScript), use Tailwind utility classes, react-icons, and follow existing project patterns. ESLint passes with zero errors, `npm run build` succeeds with all 5 routes statically generated.

**Shared Component:**

**1. `src/app/(website)/_components/LegalLayout.jsx`** — Client component with auto-generated sticky table of contents sidebar. Uses IntersectionObserver for scroll-spy active heading highlighting. Props: `title`, `lastUpdated`, `children`. Extracts h2[id] headings from children. Responsive: sidebar hidden on mobile, visible on lg+. Smooth scroll-to-section on TOC click. Breadcrumbs: Home > {title}.

**2. `/about` — About JobReady**
- Route: `src/app/(website)/about/page.jsx` — Server component with generateMeta SEO
- 7 sections: Hero (blue gradient, H1, subtitle), Our Mission (centered text), Who We Are (2-col: text + blue feature card with checklist), What We Do (3-col cards: Job Board, CV Writing, Career Resources with icons), Our Impact (4-stat grid: 10,000+ jobs, 5,000+ companies, 50,000+ job seekers, 92% success rate), Our Values (4-col: Trust, Accessibility, Speed, Quality), Final CTA (blue gradient, Browse Jobs + Get CV Done buttons)
- Icons: FiSearch, FiFileText, FiBookOpen, FiCheckCircle, FiTarget, FiUsers, FiTrendingUp

**3. `/contact` — Contact Us**
- Route: `src/app/(website)/contact/page.jsx` — Server component with generateMeta SEO
- Route: `src/app/(website)/contact/_components/ContactForm.jsx` — Client component
- Hero section (blue gradient), 2-column layout: left = contact form (name, email, subject dropdown with 8 options, message textarea, submit with loading state), right = 4 contact info cards (Email, Phone, WhatsApp with live link to siteConfig, Office location) + Office hours card (Mon-Fri 8-6pm, Sat 9-1pm, Sun closed, EAT timezone)
- Form simulates submission with 1.2s delay, shows success state with green checkmark and "Send another message" link
- Contact info uses data from siteConfig (email.support, whatsapp.number/display/link)

**4. `/privacy` — Privacy Policy**
- Route: `src/app/(website)/privacy/page.jsx` — Server component using LegalLayout
- 10 sections with id attributes for TOC: Introduction (ODPC compliance, effective April 2026), Information We Collect (personal info, usage data, cookies — with h3 subsections), How We Use Your Information (8 purposes), Data Sharing & Third Parties (4 scenarios), Data Security (5 measures), Your Rights (7 rights per Kenya DPA 2019 + DPO contact email), Cookies Policy (link to /cookies), Children's Privacy (under-18 restriction), Changes to This Policy (3 notification methods), Contact Us (DPO email, support email, /contact link)
- Internal links: /cookies, /contact. External: mailto:privacy@jobready.co.ke, mailto:support@jobready.co.ke

**5. `/terms` — Terms of Service**
- Route: `src/app/(website)/terms/page.jsx` — Server component using LegalLayout
- 14 sections with id attributes: Acceptance of Terms, Description of Service (5 services listed), User Accounts & Registration (5 agreements + age requirement), User Content & Responsibilities (4 warranties + 6 prohibited uses), Job Listings & Applications (4 non-guarantees), CV Writing Services (pricing, delivery, revisions, confidentiality — links to /cv-services and /refunds), Payment Terms (M-Pesa, KSh, refund policy link), Intellectual Property (3 points), Limitation of Liability (5 exclusions + cap), Indemnification (5 scenarios), Governing Law (Laws of Kenya), Dispute Resolution (negotiation → mediation → Nairobi courts), Changes to Terms, Contact Information (links to /privacy, /cookies, /refunds, /contact)

**6. `/cookies` — Cookie Policy**
- Route: `src/app/(website)/cookies/page.jsx` — Server component using LegalLayout
- 7 sections with id attributes: What Are Cookies (definitions of persistent/session, first/third-party), How We Use Cookies (4 purposes), Types of Cookies We Use (4 subsections with HTML tables: Essential [3 cookies], Analytics [3 cookies — GA/GA4], Functional [3 cookies], Advertising [3 cookies — AdSense/DoubleClick]), Third-Party Cookies (Google Analytics, AdSense, Cloudflare with opt-out links), Managing Cookies (browser settings for Chrome/Firefox/Safari/Edge/Opera + opt-out links for Google Ads Settings, NAI, DAA), Changes to Cookie Policy (link to /privacy), Contact Us
- External links: Google Analytics opt-out, Google Ads Settings, NAI, DAA

**Technical Notes:**
- All pages use `generateMeta()` from `@/lib/seo` for consistent SEO metadata (title, description, canonical, OG, Twitter)
- Legal pages share `LegalLayout.jsx` for consistent TOC sidebar, breadcrumbs, and typography
- About and Contact pages use full-width hero sections matching existing pages (cv-services, career-advice)
- Contact form is client-side only (no API endpoint), with loading/success states
- All icons from `react-icons/fi`
- All files use only Tailwind utility classes (bg-[#1a56db], bg-[#f59e0b], etc.)
- Build: all 5 routes shown as `○ (Static)` — prerendered as static content
---
Task ID: 2j
Agent: Main
Task: Build Job Hub Pages — 23 dynamic hub routes under /jobs/[hubSlug]

Work Log:
- Explored existing codebase: hub-config.js (33 hubs), existing job components (HubHero, RelatedHubs, JobSortBar, JobFilters, mock-data)
- Created `src/app/(website)/jobs/[hubSlug]/page.jsx` — Server component with generateStaticParams (23 hubs), generateMetadata per hub, notFound() for invalid slugs
- Created `src/app/(website)/jobs/[hubSlug]/_components/HubContent.jsx` — Client component with 3-column layout (left: related hubs + location/type browse, center: search bar + job listings + CV nudge + pagination, right: CV CTA + ad + hub description + newsletter)
- Created `src/app/(website)/jobs/[hubSlug]/_components/HubSearchBar.jsx` — Hub-specific search bar with sort dropdown
- Created `src/app/(website)/jobs/[hubSlug]/_components/hub-data.js` — Mock data filtering logic with category/jobType/location/experience/remote mappings, realistic job count generation, sidebar data
- Fixed import paths: hub _components → parent _components is `../../_components/`, shared website _components is `../../../_components/`
- Build verified: all 23 hub routes statically generated (SSG)

Stage Summary:
- All 23 Job Hub pages now functional: /jobs/technology, /jobs/finance-accounting, /jobs/engineering, /jobs/healthcare, /jobs/education, /jobs/sales-marketing, /jobs/government, /jobs/internships, /jobs/part-time, /jobs/remote, /jobs/nairobi, /jobs/mombasa, /jobs/kisumu, /jobs/nakuru, /jobs/entry-level, /jobs/management, /jobs/ngo, /jobs/human-resources, /jobs/creative-design, /jobs/legal, /jobs/logistics, /jobs/customer-service, /jobs/consulting
- Each hub has: branded hero (icon + job count badge), hub-specific search, filtered job listings, 3-column layout with sidebars, CV service nudge, newsletter, 404 handling
- Files created: 4 new files in src/app/(website)/jobs/[hubSlug]/

---
Task ID: 2o
Agent: Main
Task: Build Opportunity Hub Pages — 8 dynamic hub routes under /opportunities/[hubSlug]

Work Log:
- Explored existing opportunity page structure: OpportunityHubHero, OpportunityCard, OpportunityFilters, mock-data already exist
- Created `src/app/(website)/opportunities/[hubSlug]/page.jsx` — Server component with generateStaticParams (8 hubs), dynamic metadata, notFound() for invalid slugs
- Created `src/app/(website)/opportunities/[hubSlug]/_components/HubContent.jsx` — Client component with 2-column layout (main: search+sort+featured grid+list+service nudge+ad, sidebar: CV CTA+browse by type+hub description+newsletter)
- Created `src/app/(website)/opportunities/[hubSlug]/_components/hub-data.js` — Mock data filtering with opportunityType enum mapping, realistic counts, sidebar links
- Reused existing OpportunityHubHero (already built) and OpportunityCard
- Build verified: all 8 opportunity hub routes statically generated (SSG)

Stage Summary:
- All 8 Opportunity Hub pages now functional: /opportunities/scholarships, /opportunities/grants, /opportunities/fellowships, /opportunities/bursaries, /opportunities/competitions, /opportunities/conferences, /opportunities/volunteer, /opportunities/apprenticeships
- Each hub has: branded hero (icon, stats, breadcrumb), search bar + sort, featured grid, full opportunity list, CV service nudge, sidebar with browse-by-type + alerts newsletter
- Files created: 3 new files in src/app/(website)/opportunities/[hubSlug]/
- Phase 2 is now FULLY COMPLETE (all 3 missing items delivered)

---
## Task ID: 4A - dashboard-layout
### Work Task
Build JobReady.co.ke Dashboard Phase 4A — Layout, Sidebar, Overview, and Job Seeker pages (Applications, Saved Jobs, Profile).

### Work Summary
Created 8 new dashboard files + updated globals.css with sidebar theme colors. All files are .jsx (no TypeScript for our code). ESLint passes with zero errors, Next.js production build succeeds.

**1. `src/app/globals.css` (updated)**
- Added 22 CSS custom properties in @theme block for dashboard sidebar and shadcn/ui semantic colors
- Sidebar theme: dark navy blue (#1e3a5f) background with light slate text
- shadcn/ui semantic: background, foreground, card, popover, muted, border, input, ring, destructive

**2. `src/app/dashboard/layout.jsx` — Dashboard Layout**
- Client component ("use client") wrapping all dashboard pages
- Uses SidebarProvider, SidebarInset, SidebarRail from shadcn sidebar
- Renders AppSidebar component and DashboardHeader component
- Content area with responsive padding (p-4 md:p-6 lg:p-8)
- Sidebar is collapsible with offcanvas variant

**3. `src/app/dashboard/_components/AppSidebar.jsx` — Sidebar Navigation**
- Client component with role-based navigation (JOB_SEEKER / EMPLOYER)
- Job Seeker nav: Overview, My Applications (badge 3), Saved Jobs (badge 12), Job Alerts (badge 5), My CV/Profile
- Employer nav: Overview, My Jobs (badge 8), Post New Job, Applications (badge 24), Company Profile, Billing
- Shared: Account Settings
- SidebarHeader: JobReady logo with blue checkmark icon + ".co.ke" text
- SidebarFooter: User avatar (initials), name, role badge, Sign Out button
- Active state via usePathname() matching
- SidebarMenuButton with asChild + Next.js Link
- Uses lucide-react icons throughout

**4. `src/app/dashboard/_components/DashboardHeader.jsx` — Top Header Bar**
- Client component with sticky top header (h-14, bg-white, border-b)
- Left: SidebarTrigger + vertical Separator + Breadcrumb navigation (hidden on mobile, mobile shows page title)
- Right: User dropdown with Avatar + DropdownMenu (Profile, Settings, Sign Out)
- Dynamic breadcrumbs built from pathname with BREADCRUMB_MAP

**5. `src/app/dashboard/page.jsx` + `src/app/dashboard/_components/DashboardOverview.jsx` — Overview Page**
- Server page with generateMetadata for SEO
- Client overview with mock data, role-based content switching
- Welcome banner (blue gradient) with CTA buttons
- 4 stat cards (Applications Sent, Saved Jobs, Profile Views, Interviews for job seeker)
- Recent Activity list (5 items with icons and timestamps)
- Quick Actions panel (4 action links with icons)
- Profile Completeness progress bar (65%) with section checklist
- Employer variant with different stats and quick actions

**6. `src/app/dashboard/applications/page.jsx` — My Applications**
- Client component with filterable tabs (All, Applied, Shortlisted, Interview, Rejected)
- 8 mock applications with realistic Kenyan company data
- Application cards with company logo (colored initials), job title, status badges, salary, location, type, date
- Status badge styling: Applied (blue), Shortlisted (purple), Interview (green), Rejected (red)
- Empty state when filtered results are empty

**7. `src/app/dashboard/saved-jobs/page.jsx` — Saved/Bookmarked Jobs**
- Client component with unsave functionality (removes card from list)
- 6 mock saved jobs in responsive grid (md:2-col, xl:3-col)
- Saved job cards with category color strip, company logo, title, meta info, salary, relative date
- Unsave button (BookmarkX icon) with hover destructive color
- Empty state when all jobs are removed

**8. `src/app/dashboard/profile/page.jsx` — Job Seeker Profile**
- Client component with tabbed form (Personal Info, Education, Work Experience, Skills)
- Profile completeness progress bar (100% with mock data)
- Avatar section with upload/remove buttons
- Personal Info tab: name, email, phone, location, bio (textarea), LinkedIn URL, portfolio URL
- Education tab: 2 entries with institution, degree, field, dates; remove buttons
- Work Experience tab: 2 entries with company, position, dates, description; remove buttons
- Skills tab: skill badges with remove, add skill input, suggested skills (click to add)
- Save button with loading spinner and success state

**Build verification:**
- ESLint: 0 errors
- `npx next build`: All 4 dashboard pages (/, /applications, /profile, /saved-jobs) compiled successfully as static pages
- All pages accessible at /dashboard/* routes

---
Task ID: 4a
Agent: full-stack-developer
Task: Phase 4A — Dashboard layout, shadcn sidebar, role-based navigation, overview

Work Log:
- Created `src/app/dashboard/layout.jsx` — Dashboard layout with SidebarProvider, AppSidebar, DashboardHeader
- Created `src/app/dashboard/_components/AppSidebar.jsx` — Collapsible sidebar with role-based nav (Job Seeker: overview, applications, saved-jobs, alerts, profile; Employer: overview, jobs, jobs/new, applications, company, billing), logo header, user avatar footer
- Created `src/app/dashboard/_components/DashboardHeader.jsx` — Sticky top bar with SidebarTrigger, breadcrumbs, user dropdown menu
- Created `src/app/dashboard/page.jsx` — Server page with metadata, renders DashboardOverview
- Created `src/app/dashboard/_components/DashboardOverview.jsx` — Welcome banner, 4 stat cards, recent activity, quick actions, profile completeness
- Created `src/app/dashboard/applications/page.jsx` — Applications list with status badges
- Created `src/app/dashboard/saved-jobs/page.jsx` — Saved jobs grid with unsave
- Created `src/app/dashboard/profile/page.jsx` — Tabbed profile form (Personal, Education, Experience, Skills)
- Updated `src/app/globals.css` — Added 22 CSS variables for sidebar theme + shadcn/ui semantic colors

Stage Summary:
- Dashboard layout fully functional with shadcn sidebar (collapsible offcanvas, mobile sheet)
- Role-based navigation switches between job seeker and employer
- 4 job seeker pages built: overview, applications, saved-jobs, profile
- Build verified: all pages compile

---
Task ID: 4b
Agent: full-stack-developer
Task: Phase 4B — Employer dashboard pages + Alerts + Settings

Work Log:
- Created `src/app/dashboard/jobs/page.jsx` + `MyJobsContent.jsx` — Employer job management with filter tabs (All/Active/Paused/Draft/Closed), search, table with status badges, action dropdown, delete confirmation
- Created `src/app/dashboard/jobs/new/page.jsx` + `PostJobForm.jsx` — 3-section job posting form (Details, Description, Deadline & Settings) with validation, draft/publish/preview
- Created `src/app/dashboard/company/page.jsx` + `CompanyProfileForm.jsx` — Company profile form pre-filled with Safaricom PLC mock data, logo upload, social links
- Created `src/app/dashboard/billing/page.jsx` + `BillingContent.jsx` — 4 stat cards, service pricing reference, order history table with 6 mock orders
- Created `src/app/dashboard/alerts/page.jsx` + `AlertsContent.jsx` — Job alerts list with toggle, create new alert dialog, summary stats
- Created `src/app/dashboard/settings/page.jsx` + `SettingsContent.jsx` — 4-tab settings (Account, Password, Notifications with 6 toggles, Danger Zone with delete confirmation)

Stage Summary:
- 6 new employer/shared pages built: jobs, jobs/new, company, billing, alerts, settings
- All pages use shadcn components (Table, Badge, Card, Tabs, AlertDialog, DropdownMenu, etc.)
- Mock data throughout with realistic Kenyan companies and M-Pesa payment references
- Build verified: all 10 dashboard pages compile successfully

---
## Task ID: 10 - api-routes
### Work Task
Build 6 backend API routes for JobReady.co.ke: Saved Jobs, Alerts, Search, Dashboard Stats, Newsletter, and Notifications.

### Work Summary
Read prisma/schema.prisma (28 tables), existing lib files (db.js, auth.js, format.js, slug.js), and existing API routes (user/profile, auth/register) to understand project patterns. Created 6 API route files:

**1. `src/app/api/saved-jobs/route.js`** — Saved Jobs CRUD
- GET: Returns user's saved jobs with pagination, includes job relation (title, slug, company, location, jobType, salaryMin, salaryMax, deadline)
- POST: Saves a job (validates job exists, checks not already saved, uses @@unique userId_jobId)
- DELETE: Removes saved job using composite unique key
- Auth required for all methods. Uses Prisma parallel queries for count+data.

**2. `src/app/api/alerts/route.js`** — Job Alerts CRUD
- GET: Returns user's alerts with all fields (id, query, location, jobType, category, isActive, lastSentAt, emailOpenCount, emailClickCount)
- POST: Creates alert. Maps `keyword` param to schema `query` field. Validates at least one search criterion.
- PUT: Updates alert fields (isActive, keyword→query, location, categoryId→category). Verifies ownership.
- DELETE: Deletes alert with ownership check.
- Note: Schema has `query` not `keyword`, and no `frequency` field. API accepts `keyword` and `frequency` for backward compatibility but only persists `query`, `location`, `category`.

**3. `src/app/api/search/route.js`** — Global Search (Public)
- GET: No auth required. Searches across jobs (title, description, company.name), opportunities (title, description, organizationName), companies (name, description, industry), articles (title, excerpt, content).
- Filters: category, location, jobType. Type filter: "all", "jobs", "opportunities", "companies", "articles".
- Uses Prisma `contains` with `mode: "insensitive"` for case-insensitive search.
- Returns results grouped by type with items and total counts per type.
- Pagination with page/limit params.

**4. `src/app/api/dashboard/stats/route.js`** — Dashboard Stats
- GET: Auth required. Returns stats for job seekers (default role since User model has no role field).
- Stats: savedJobsCount, unreadNotifications, jobAlertsCount, ordersCount. Application-related counts return 0 (no Applications table in v1).
- Recent: Last 5 saved jobs with full job relation.
- Employer path included as stub for future use.

**5. `src/app/api/newsletter/route.js`** — Newsletter Subscription (Public)
- POST: No auth required. Validates email format and subscription type (job_alerts, career_tips, opportunity_alerts, employer_updates).
- Handles existing subscriptions: re-activates and updates type if email already exists (unique constraint on email).
- Uses upsert pattern to handle race conditions with P2002 error fallback.

**6. `src/app/api/notifications/route.js`** — Notifications CRUD
- GET: Auth required. Returns paginated notifications with unreadCount. Supports unreadOnly filter and optional markReadId param to mark-as-read inline.
- PUT: Supports marking single notification as read ({ id, isRead: true }) or all as read ({ markAllRead: true }).

**Schema Adaptations:**
- All IDs are String (cuid), not integer — adapted all API inputs/outputs accordingly
- JobAlert.query field used instead of "keyword" (mapped in API layer)
- JobAlert has no frequency field (accepted but not persisted)
- No Applications table exists (dashboard returns 0 for application counts)
- User model has no role field (defaults to JOB_SEEKER)
- NewsletterSubscription email is unique (one record per email)

**Build Results:**
- ESLint: zero errors
- `next build`: Compiled successfully in 9.2s
- All 6 new API routes registered as ƒ (Dynamic): /api/saved-jobs, /api/alerts, /api/search, /api/dashboard/stats, /api/newsletter, /api/notifications

---
Task ID: 5a
Agent: full-stack-developer
Task: Phase 5A-B — Jobs CRUD API + Applications API

Work Log:
- Created `src/app/api/jobs/route.js` — GET (list/search with filters: q, category, jobType, experienceLevel, location, isRemote, sort, pagination) + POST (EMPLOYER create job with auto-slug, draft/publish support)
- Created `src/app/api/jobs/[slug]/route.js` — GET (single job + similar jobs, increment viewCount) + PUT (owner-only update, re-slug if title changed) + DELETE (soft delete: isActive=false)
- Created `src/app/api/jobs/[slug]/apply/route.js` — POST (JOB_SEEKER apply, duplicate check, transactional applicationCount increment) + GET (check if applied)
- Created `src/app/api/applications/route.js` — GET (role-based: job seeker sees own, employer sees company's, filterable by status)
- Created `src/app/api/applications/[id]/route.js` — PUT (employer update status: SHORTLISTED/INTERVIEW/REJECTED/HIRED)
- Updated `prisma/schema.prisma` — Added `applications` table (#29) with userId, jobId, coverLetter, cvUrl, status, employerNotes, timestamps + unique [userId, jobId]
- Updated `src/lib/auth.js` — Added `role` field to JWT token and session

Stage Summary:
- 5 new API route files with 11 endpoints total
- Full CRUD for jobs with search, filters, pagination
- Application workflow: apply → status tracking (Pending → Shortlisted → Interview → Hired/Rejected)
- Transaction-safe applicationCount increment
- Schema extended with applications table

---
Task ID: 5b
Agent: full-stack-developer
Task: Phase 5C-F — Saved Jobs, Alerts, Search, Stats, Newsletter, Notifications APIs

Work Log:
- Created `src/app/api/saved-jobs/route.js` — GET (user's saved jobs with job relation) + POST (save job) + DELETE (unsave job)
- Created `src/app/api/alerts/route.js` — GET (user's alerts) + POST (create alert) + PUT (toggle/update) + DELETE (remove)
- Created `src/app/api/search/route.js` — GET (global search across jobs, opportunities, companies, articles with type filter)
- Created `src/app/api/dashboard/stats/route.js` — GET (role-based stats: job seeker gets applications/saved/views counts, employer gets activeJobs/applications/shortlisted counts)
- Created `src/app/api/newsletter/route.js` — POST (subscribe, public, upsert on duplicate email)
- Created `src/app/api/notifications/route.js` — GET (user notifications with unreadCount) + PUT (mark read/mark all)

Stage Summary:
- 6 new API route files with 13 endpoints total
- Total API endpoints: 24 (6 existing + 18 new)
- All endpoints have proper auth checks, error handling, pagination
- Build verified: all routes registered as dynamic server-rendered endpoints
---
Task ID: 6
Agent: Main Agent
Task: Phase 6 — SEO (sitemaps, robots, manifest, JSON-LD, noindex)

Work Log:
- Enhanced src/lib/seo.js with 7 new JSON-LD generator functions: generateFAQJsonLd, generateServiceJsonLd, generateCollectionPageJsonLd, generateItemListJsonLd, generateContactPageJsonLd, generateWebPageJsonLd, mergeJsonLd
- Created src/app/sitemap.js — dynamic sitemap generating 47 URLs (12 static pages + 23 job hubs + 8 opportunity hubs + 4 legal pages) with priority and changeFrequency
- Created src/app/robots.js — robots.txt allowing all crawlers on content pages, blocking dashboard/api/auth pages, blocking AI scrapers (GPTBot, ChatGPT-User, CCBot, anthropic-ai)
- Created src/app/manifest.js — Web app manifest with PWA config, shortcuts, icons, theme colors
- Added JSON-LD to Jobs listing page: CollectionPage + BreadcrumbList schemas
- Added JSON-LD to CV Services page: FAQPage (6 FAQs from mock data) + Service (3 pricing tiers with aggregate rating 4.8) + BreadcrumbList
- Added JSON-LD to Opportunities listing page: CollectionPage + BreadcrumbList schemas
- Added JSON-LD to Organizations listing page: CollectionPage + BreadcrumbList schemas
- Added JSON-LD to About page: WebPage + BreadcrumbList schemas
- Added JSON-LD to Contact page: ContactPage (with contact points, address, languages) + BreadcrumbList schemas
- Added noindex metadata to auth layout (src/app/(auth)/layout.jsx) — blocks Google from indexing login, register, forgot-password, etc.
- Added noindex metadata to dashboard layout (src/app/dashboard/layout.jsx) — blocks Google from indexing all dashboard pages
- Refactored dashboard layout: extracted client sidebar logic into DashboardShell.jsx, made layout.jsx a server component to support metadata export
- Build verified clean: 79 static pages generated, zero errors

Stage Summary:
- Phase 6 complete — full SEO infrastructure in place
- 7 new JSON-LD generators in seo.js (total: 12 generators)
- 3 SEO files generated at build time: /sitemap.xml, /robots.txt, /manifest.webmanifest
- All 8 major public pages now have proper JSON-LD structured data:
  1. Homepage: WebSite + SearchAction
  2. Jobs listing: CollectionPage + BreadcrumbList
  3. Job detail: JobPosting + BreadcrumbList
  4. Opportunities listing: CollectionPage + BreadcrumbList
  5. Organizations listing: CollectionPage + BreadcrumbList
  6. Career Advice listing: Blog + BreadcrumbList
  7. Article detail: Article + BreadcrumbList
  8. CV Services: FAQPage + Service + BreadcrumbList
  9. About: WebPage + BreadcrumbList
  10. Contact: ContactPage + BreadcrumbList
  11. Company profile: Organization + BreadcrumbList
  12. Search results: SearchResultsPage + ItemList
- Dashboard and auth pages have noindex to prevent wasting crawl budget
- AI scrapers (GPTBot, CCBot, etc.) blocked entirely via robots.txt
---
Task ID: 7
Agent: Main
Task: Phase 7 Seed Data — Populate MySQL with realistic mock data

Work Log:
- Read Prisma schema (28 tables, 329 columns) to understand data structure
- Read hub-config.js to get all 23 job hub categories and 8 opportunity types
- Created seed-7c-jobs.js: 70 jobs across all 23 hub categories, spread across 19 companies
- Created seed-7d-opportunities.js: 37 opportunities across 8 types (Scholarships, Grants, Fellowships, Bursaries, Competitions, Conferences, Volunteer, Apprenticeships)
- Created seed-7e-articles.js: 15 blog articles with full content, tagged with 25 tags, by 5 authors
- Created seed-7f-users.js: 18 users (15 seekers + 3 employers) with applications, saved jobs, alerts
- Created seed-7g-services.js: 7 service tiers, 10 FAQs, 4 site pages, 4 ad placements
- Updated seed.js to integrate all phases with PHASES env var for selective running
- Fixed excerpt/metaDescription column length issues (VARCHAR(191) limit)
- Optimized Phase 7f to use batch operations (createMany) to avoid timeouts
- All phases tested and verified working against MySQL database
- Committed and pushed to GitHub (commit 727bfb3)

Stage Summary:
- Database populated with ~200+ records across 15+ tables
- 19 Kenyan companies seeded (Safaricom, Equity, KCB, KPMG, etc.)
- 70 jobs covering all 23 hub categories
- 37 opportunities covering all 8 types
- 15 full-length blog articles with tag associations
- 18 users with applications, saved jobs, alerts, and notifications
- Service pricing, FAQs, site pages, and ad placements configured
- Seed script supports selective phase execution via SEED_PHASE env var
- GitHub push: 727bfb3
---
## Task ID: 8a-part3
### Work Task
Create 1 API route for company profiles at `/src/app/api/companies/[slug]/route.js` — GET handler for fetching a single company by slug with its active jobs (paginated) and similar companies.

### Work Summary
- Read worklog.md, existing `/api/jobs/[slug]/route.js` for patterns, and Prisma schema for Company/Job models
- Created `/src/app/api/companies/[slug]/route.js` with single GET handler:
  - Validates slug param, returns 400 if missing
  - Finds company by slug via `db.company.findUnique()`, returns 404 if not found or inactive (`isActive: false`)
  - Parses `page` (default 1) and `limit` (default 10, max 50) from query params
  - Builds active jobs where clause: `companyId` match, `isActive=true`, `publishedAt` not null and ≤ now, `deadline` not past or null
  - Counts total active jobs via `db.job.count()` for pagination
  - Fetches paginated jobs with `isFeatured desc, publishedAt desc` ordering, includes company select (name, slug, logo, logoColor, isVerified)
  - Fetches similar companies: same industry, different id, active, ordered by `isFeatured desc, jobCount desc`, take 5 (only if company has an industry)
  - Returns `{ company, jobs, pagination: { page, limit, total, totalPages }, similarCompanies }`
- Public route (no auth) — no next-auth imports
- Follows exact same code patterns as `/api/jobs/[slug]/route.js`: try/catch with console.error, NextResponse.json, same date helper logic
- ESLint passes with zero errors
- File verified to exist at `/home/z/my-project/src/app/api/companies/[slug]/route.js`

---
## Task ID: 8a-part1 - api-developer
### Work Task
Create 2 API routes for opportunities: GET /api/opportunities (listing with filters/pagination) and GET /api/opportunities/[slug] (detail with similar opportunities).

### Work Summary
Created 2 API route files following the exact same patterns as the existing `/api/jobs/` routes:

**1. `/src/app/api/opportunities/route.js` — GET /api/opportunities**
- Query params: `q`, `opportunityType`, `category`, `location`, `isRemote`, `sort` (newest/featured/deadline), `page`, `limit`
- Filters: isActive=true, publishedAt not null and <= now, deadline not past (or null)
- Search: title, description, organizationName (case insensitive via `mode: "insensitive"`)
- Uses `select` for listing response (excludes description/SEO fields from listing)
- Organization fields: organizationName, organizationLogo, organizationType
- Returns `{ opportunities, pagination: { page, limit, total, totalPages } }`
- Public route (no auth)
- Limit clamped to max 50

**2. `/src/app/api/opportunities/[slug]/route.js` — GET /api/opportunities/[slug]**
- Finds opportunity by slug with all fields (full details)
- Increments viewsCount fire-and-forget (no await, .catch(() => {}))
- Finds similar opportunities: same opportunityType, different id, isActive=true, published, deadline not past
- Limits similar results to 5, ordered by publishedAt desc
- Returns `{ opportunity, similarOpportunities }`
- Public route (no auth)

**Key differences from Jobs API:**
- No company FK relation — uses organizationName/organizationLogo/organizationType string fields
- No experienceLevel, salaryMin, salaryMax, jobType fields
- Search includes organizationName in addition to title and description
- Similar opportunities matched by opportunityType instead of category
- Uses `db.opportunity` instead of `db.job`

- ESLint: zero errors. Both files verified to exist.

---
## Task ID: 8a-part2 - backend-developer
### Work Task
Create 2 API routes for blog articles: GET /api/articles (list/search with filters) and GET /api/articles/[slug] (single article with related articles and view count). All files must be `.js`, follow exact same patterns as existing `/api/jobs/route.js`.

### Work Summary
Created 2 API route files for blog articles:

**1. `/src/app/api/articles/route.js`** — GET /api/articles (130 lines)
- Query params: `q`, `category` (slug), `tag` (slug), `author` (slug), `sort` (newest/featured/popular), `page`, `limit`
- Filters: `isPublished=true`, search in title/excerpt/content (case-insensitive)
- Includes: category (id, name, slug, color), author (id, name, slug, title, avatar), tags via articleTags→tag (id, name, slug) normalized to flat array
- Sort: newest=publishedAt desc, featured=isFeatured desc then publishedAt desc, popular=viewsCount desc then publishedAt desc
- Returns `{ articles, pagination: { page, limit, total, totalPages } }`
- Public route (no auth), limit clamped to max 50

**2. `/src/app/api/articles/[slug]/route.js`** — GET /api/articles/[slug] (111 lines)
- Finds article by slug, must be isPublished=true (returns 404 if not found/unpublished)
- Includes: author full details (id, name, slug, title, bio, avatar, linkedinUrl, articleCount, totalViews, peopleCoached), category (id, name, slug, color, gradient), tags via articleTags→tag normalized to flat array
- Increments article viewsCount (fire and forget with .catch)
- Increments author totalViews (fire and forget with .catch)
- Related articles: same categoryId, different id, isPublished=true, take 3, ordered by publishedAt desc, includes category and author
- Returns `{ article, relatedArticles }`

Both files follow exact same patterns as `/api/jobs/route.js`: try/catch with console.error, NextResponse.json, AND conditions array for clean where clause composition. ESLint: zero errors (pre-existing errors in seed/hub files are unrelated).

---
## Task ID: 8b-part1 - frontend-developer
### Work Task
Wire 2 frontend pages (Search Results and Job Detail) to use real API data instead of mock data.

### Work Summary
Replaced mock data imports with live API calls on 2 pages across 4 files. All existing UI preserved — only data sources changed.

**Files Modified:**

**1. `src/app/(website)/search/_components/SearchResultsList.jsx`** — Full rewrite of data layer
- Removed imports of `mockJobResults` and `mockOpportunityResults` from `./mock-data`
- Added `useState` (results, loading, error) + `useEffect` + `useCallback` for `fetch()`
- Added new props: `location` (string) and `initialType` (string, "jobs"|"opportunities")
- Fetches from `/api/search?q=${query}&type=${activeTab}&location=${location}&limit=10`
- Maps API response shape `{ results: { jobs: { items, total }, opportunities: { items, total } } }` to tab counts and lists
- Passes `opp.opportunityType?.toLowerCase()` as `type` prop to OpportunityCard for color mapping
- Added loading spinner (FiLoader + "Searching..." text)
- Added error state with retry button
- Added empty result states for both jobs and opportunities tabs ("No jobs/opportunities found matching your search")
- Kept all existing UI: tab toggle, results header with sort dropdown, CV Service Nudge, JobCard/OpportunityCard rendering

**2. `src/app/(website)/search/page.jsx`** — Minimal change (1 line)
- Added `location={location}` and `initialType={type}` props to `<SearchResultsList>`

**3. `src/app/(website)/job/[slug]/page.jsx`** — Converted from mock to async API fetch
- Removed `import { jobDetail } from "../_components/mock-data"`
- Added `import { notFound } from "next/navigation"`
- Added `fetchJob(slug)` helper: fetches `/api/jobs/${slug}` with `cache: "no-store"`, returns null on 404/error
- Made `generateMetadata` async: fetches job, returns dynamic title/description from API data (falls back to "Job Not Found" if 404)
- Made page component `async`: fetches job, calls `notFound()` if null
- Normalizes API data: maps `company.employeeSize` → `company.size` for component compatibility
- Passes `similarJobs` from API response to `JobDetailSidebar`
- Passes `companyJobs={[]}` since API doesn't provide company jobs
- Added `|| 0` fallbacks for `applicantCount` references
- Kept all existing UI: breadcrumbs, ad leaderboard, header, pain trigger, body, service nudge, tools bar, sidebar, mobile apply bar

**4. `src/app/(website)/job/_components/JobDetailSidebar.jsx`** — Changed to props-based data
- Removed `import { similarJobs, companyJobs } from "./mock-data"`
- Changed function signature: `({ job })` → `({ job, similarJobs = [], companyJobs = [] })`
- All existing UI preserved — component now receives data via props instead of imports

**Key Design Decisions:**
- Search page is client component ("use client") — uses useEffect/useState/fetch pattern
- Job detail page is async server component — uses top-level await with fetch
- `params` is awaited (Next.js 15+ pattern: `const { slug } = await params`)
- API data normalized before passing to components to maintain backward compatibility
- No TypeScript used — all files are .jsx
- ESLint passes with zero errors on all 4 changed files

---
## Task ID: 8b-part2 - frontend-integrator
### Work Task
Wire 2 frontend page groups (Jobs Listing and Job Hub pages) to use real API data from `/api/jobs` instead of mock data.

### Work Summary
Replaced mock data with live API calls across 2 page groups (6 files modified, 2 new utility functions added). All existing UI preserved — only the data source changed.

**PAGE GROUP 1: Jobs Listing (`/jobs`)**

Files modified:
1. **`src/app/(website)/jobs/_components/JobsContent.jsx`** — Full rewrite of data layer:
   - Removed `allJobs` mock import; kept `trendingJobsSidebar` and `popularTags` (no API for sidebar data)
   - Added `useSearchParams()` to read `q` and `location` from URL (set by search hero)
   - Added state: `jobs`, `loading`, `totalJobs`, `totalPages`, `currentPage`, `sort`, `filters`
   - `useCallback` + `useEffect` fetches `/api/jobs?...` whenever filters/sort/page/searchParams change
   - `buildQueryString()` maps: URL `q` → `q`, sidebar `category` → `category`, `jobType`, `experienceLevel`, `location`, `isRemote`, plus `sort` and `page`/`limit`
   - `enrichJob()` maps API enum values to display strings via `formatJobType()`/`formatExperienceLevel()` and computes `isNew` (published < 24h ago) and `isUrgent` (deadline < 20 days away)
   - Loading spinner and empty state with "Clear all filters" button added
   - Pagination wired to API's `pagination.totalPages`
   - Scroll-to-top on page change

2. **`src/app/(website)/jobs/_components/JobFilters.jsx`** — Changed from internal state to controlled props:
   - Accepts `filters` object and `onFiltersChange` callback
   - Each filter group (category, jobType, experienceLevel, location) is now single-select
   - Remote toggle still controlled via `filters.isRemote`
   - Passes single-value arrays to `FilterSection` (compatible with existing checkbox UI)

3. **`src/app/(website)/jobs/_components/JobSortBar.jsx`** — Changed from internal to controlled:
   - Accepts `sort` and `onSortChange` props instead of `useState`
   - All existing UI (sort dropdown, mobile filter button) preserved

**PAGE GROUP 2: Job Hub Pages (`/jobs/[hubSlug]`)**

Files modified:
4. **`src/app/(website)/jobs/[hubSlug]/_components/HubContent.jsx`** — Replaced mock data with API fetch:
   - Removed `mockHubJobs(hub)` import and `useMemo` client-side filtering
   - Added `useEffect` + `useState` for API fetch with 300ms search debounce
   - `buildHubQueryString()` iterates `hub.filters` object, skipping null/undefined values, appends `q`, `sort`, `page`, `limit`
   - Hub hero job count now uses `pagination.total` from API instead of `allJobs.length`
   - Service nudge applicant count uses `totalJobs` from API
   - Loading spinner and empty state added
   - Sidebar filters (`activeFilter`) kept as cosmetic (matching previous behavior — was never used in filtering)
   - All existing UI preserved: hero, search bar, sort, mobile filter drawer, job cards, pagination, service nudge, sidebar

5. **`src/app/(website)/jobs/[hubSlug]/_components/hub-data.js`** — Removed `mockHubJobs` function:
   - Removed 160+ lines of mock job generation code
   - Kept `hubSidebarFilters()` and `getRelatedJobHubs()` (still used by UI)

**Shared utilities:**
6. **`src/lib/format.js`** — Added 2 new formatters:
   - `formatJobType(value)`: `"FULL_TIME"` → `"Full-time"`, `"PART_TIME"` → `"Part-time"`, `"CONTRACT"` → `"Contract"`, `"INTERNSHIP"` → `"Internship"`
   - `formatExperienceLevel(value)`: `"ENTRY"` → `"Entry Level"`, `"MID"` → `"Mid Level"`, `"SENIOR"` → `"Senior"`, `"MANAGER"` → `"Manager"`, `"EXECUTIVE"` → `"Executive"`

7. **`src/app/(website)/jobs/_components/mock-data.js`** — Updated filter values:
   - `filterCategories` values changed to API-compatible uppercase enums (e.g., `"Technology"` → `"TECHNOLOGY"`, `"Marketing"` → `"MARKETING_COMMUNICATIONS"`)
   - `filterJobTypes` values changed (e.g., `"Full-time"` → `"FULL_TIME"`)
   - `filterExperienceLevels` values changed (e.g., `"Entry"` → `"ENTRY"`, `"Senior"` → `"SENIOR"`)
   - Labels remain unchanged — UI stays identical

**Files NOT modified (no changes needed):**
- `src/app/(website)/jobs/page.jsx` — Server component, unchanged
- `src/app/(website)/jobs/[hubSlug]/page.jsx` — Server component, unchanged
- `src/app/(website)/_components/JobCard.jsx` — Receives enriched job objects with display fields
- `src/app/(website)/_components/Pagination.jsx` — Works with new controlled state

**ESLint: zero errors on all modified files.**

---
## Task ID: 8c - api-integration
### Work Task
1. Fix Jobs listing sidebar trending jobs to fetch from API instead of mock data
2. Wire Job Hub pages sidebar filters to API query params

### Work Summary

**Task 1: Fix Jobs listing sidebar trending jobs (`src/app/(website)/jobs/_components/JobsContent.jsx`)**
- Removed `import { trendingJobsSidebar, popularTags } from "./mock-data"` — no more mock-data dependency for this component
- Added `const [trendingJobs, setTrendingJobs] = useState([])` state
- Added `useEffect` on mount to fetch `/api/jobs?sort=featured&limit=5` — API supports `sort=featured` (orders by `isFeatured desc, publishedAt desc`) and returns jobs with `company` relation (`name`, `slug`, `logoColor`, `isVerified`)
- Moved `popularTags` inline as a static const array (12 search terms: CPA-K, IFRS, Excel, QuickBooks, etc.) — not DB data, just label strings
- Updated sidebar JSX: `trendingJobsSidebar.map(...)` → `trendingJobs.map(...)` with proper nested company access: `job.company?.name` (was `job.company`), `job.company?.logoColor` (was `job.logoColor`)
- Added fallback empty state message "No trending jobs yet" when array is empty
- Used optional chaining (`?.`) throughout for null-safety on API data

**Task 2: Wire Job Hub sidebar filters to API (`src/app/(website)/jobs/[hubSlug]/_components/HubContent.jsx`)**
- Note: The hub page already fetched from `/api/jobs?${qs}` using `hub.filters` from `hub-config.js` — no mock job data was used. However, the `activeFilter` state (sidebar FilterList selection) was tracked but NOT passed to the API query.
- Added `mapSidebarFilter(hubSlug, filterValue)` function that converts sidebar filter label values to API query params:
  - **Location hubs** (nairobi/mombasa/kisumu/nakuru): category slugs → `category` enum (e.g., "technology" → "TECHNOLOGY")
  - **Remote hub**: job type labels → `jobType` enum on top of base `isRemote=true` filter (e.g., "full-time" → "FULL_TIME")
  - **Default/category hubs**: job type labels → `jobType` enum (e.g., "full-time" → "FULL_TIME", "remote" → `isRemote=true`)
  - **Special hubs** (internships, part-time, entry-level): unmappable values (paid, weekend, trainee) → fallback as `q` search term
- Updated `buildHubQueryString()` to accept `activeFilter` and `hubSlug` params, merging mapped filter params into the query
- Added search query merging: if sidebar filter sets `q` and user also types a search, they combine as `"filterValue searchTerm"`
- Added `activeFilter` to `fetchJobs` useCallback dependency array so API refetches when sidebar filter changes
- Verified `hub-data.js` exports (`getRelatedJobHubs`, `hubSidebarFilters`) remain as static config — they derive from `hub-config.js`, not DB data
- Verified `page.jsx` for hub route already passes `hub` prop correctly with `filters` from `hub-config.js`

**Files modified:**
- `src/app/(website)/jobs/_components/JobsContent.jsx` — removed mock import, added trending API fetch, inline popularTags
- `src/app/(website)/jobs/[hubSlug]/_components/HubContent.jsx` — added `mapSidebarFilter()`, wired `activeFilter` to API query builder

**Files NOT modified (verified correct as-is):**
- `src/app/(website)/jobs/[hubSlug]/_components/hub-data.js` — static config functions, no DB data
- `src/app/(website)/jobs/[hubSlug]/page.jsx` — already passes hub object with filters correctly
- `src/app/(website)/jobs/[hubSlug]/_components/HubSearchBar.jsx` — already wired correctly
- `src/config/hub-config.js` — read-only reference for filter mapping

**ESLint:** Both modified files pass with zero errors. Pre-existing errors in other files (opportunities hub, require-imports) are unrelated.

---
## Task ID: 8e - full-stack-developer
### Work Task
Wire 3 pages to API data: Organizations Listing (verify), Organization Profile (convert to async + fetch), and Homepage (convert to async + fetch from multiple APIs + update sidebar to props-based). All files must be `.jsx` (no TypeScript).

### Work Summary

**Created 1 new file:**

**1. `/src/lib/normalize.js`** — Data normalization helpers that transform API responses into shapes expected by UI components:
- `getInitials(name)` — "Safaricom PLC" → "SP"
- `formatTimeLeft(deadline)` — "5h 23m", "1d 5h", "12d"
- `normalizeJobForCard(job)` / `normalizeJobs(jobs)` — Formats `jobType` (FULL_TIME → Full-time) and `experienceLevel` (SENIOR → Senior) from DB enum to display strings
- `normalizeCompany(company, pagination)` — Builds `description` array, `keyDetails` grid, `stats` object, `initials`, `location` from city/country
- `normalizeSimilarCompanies(companies)` — Adds `initials`, maps `jobCount` → `openJobs`
- `normalizeOpportunity(opp)` / `normalizeOpportunities(opportunities)` — Adds lowercase `type` for color mapping

**Part 1: Organizations Listing (`/organizations/page.jsx`)** — No changes needed. The `OrganizationsContent.jsx` client component already receives `companies` as props from the parent server component. No `/api/companies` listing route exists, so mock data is kept for this page.

**Part 2: Organization Profile (`/organizations/[slug]/page.jsx`)** — Fully rewired:
- Removed all mock-data imports (`company`, `companyJobs`, `similarCompanies`)
- Added `notFound()` import from `next/navigation`
- `generateMetadata()` now fetches from `/api/companies/${slug}` to build dynamic SEO title/description
- Page function fetches from `/api/companies/${slug}` with `{ next: { revalidate: 60 } }` ISR caching
- Returns `notFound()` on 404 or fetch errors
- Uses `normalizeCompany()` to build description array, keyDetails, stats, initials from raw API company
- Uses `normalizeJobs()` to format jobType/experienceLevel for JobCard
- Uses `normalizeSimilarCompanies()` to build sidebar list with initials
- `browseIndustries` kept as static config (no API for industry counts)
- Filter pills changed from `<button>` to `<span>` (display-only, no client handler needed)
- Pagination now dynamically rendered from API `pagination.totalPages`
- Website link in keyDetails now uses `<a>` with `target="_blank"`

**Part 3: Homepage (`/page.jsx`) + `HomepageSidebar.jsx`** — Fully rewired:
- `page.jsx` converted from sync server component to async server component
- Fetches 5 API endpoints in parallel via `Promise.allSettled()`:
  - `/api/jobs?sort=featured&limit=5` → featuredJobs
  - `/api/jobs?sort=newest&limit=10` → latestJobs
  - `/api/jobs?jobType=INTERNSHIP&limit=5` → internshipJobs
  - `/api/opportunities?sort=newest&limit=5` → opportunities
  - `/api/jobs?sort=deadline&limit=10` → deadline jobs (filtered for 7-day window)
- Graceful fallback: if API returns empty/error, falls back to mock-data
- Sidebar data derived from API responses: topEmployers (deduplicated company map from jobs), sidebarFeaturedJobs (first 4 featured), sidebarDeadlines (computed via `formatTimeLeft`)
- Categories, trustedLogos, locations kept as static constants in page.jsx
- Conditional rendering: Featured Jobs, Urgent Deadlines, Internships, Scholarships sections only render if data exists
- `HomepageSidebar.jsx` converted from importing mock-data to accepting all data as props: `topEmployers`, `sidebarFeaturedJobs`, `sidebarDeadlines`, `locations`
- HomepageSidebar sections conditionally render when their prop arrays have data

**ESLint:** Zero errors on all changed/new files (9 pre-existing errors in prisma seed files are unrelated).

---
## Task ID: 8d - api-wiring
### Work Task
Wire Opportunities listing, Opportunity hub pages, Career Advice listing, and Career Advice article detail pages to real API endpoints instead of mock data. All files must be .jsx (no TypeScript).

### Work Summary
Replaced all mock data imports with live API calls across 4 page groups (15 files modified). ESLint passes with zero errors on `src/app`.

**Part 1: Opportunities Listing (`/opportunities`)**
- `src/app/(website)/opportunities/page.jsx` — Converted to async server component. Fetches featured (`/api/opportunities?sort=featured&limit=10`) and all opportunities (`/api/opportunities?limit=20`) in parallel via `Promise.all`. Related hubs sidebar derived statically from `hub-config.js` using `getOpportunityHubs()`. Collection JSON-LD uses real `totalOpportunities` from API. Passes `totalOpportunities` to hero via prop.
- `src/app/(website)/opportunities/_components/OpportunitySearchHero.jsx` — Accepts `totalOpportunities` prop instead of importing `opportunityStats` from mock-data. Simplified stats to show only total count from API.
- `src/app/(website)/opportunities/_components/OpportunityFilters.jsx` — Moved `opportunityTypes` array inline (removed mock-data import). All other logic unchanged.

**Part 2: Opportunity Hub Pages (`/opportunities/[hubSlug]`)**
- `src/app/(website)/opportunities/[hubSlug]/_components/HubContent.jsx` — Converted from mock data to client-side API fetching. Uses `buildQueryString(hub)` to construct filter params from `hub.filters` (opportunityType, category, location, isRemote). Fetches featured items and paginated results from `/api/opportunities`. Added loading spinner, error state with retry button, and wired `Pagination` component for server-side pagination. Search and sort trigger refetch.
- `src/app/(website)/opportunities/[hubSlug]/_components/hub-data.js` — Removed `mockHubOpportunities()` function. Kept `getRelatedOpportunityHubs()` as static config derived from `hub-config.js`.

**Part 3: Career Advice Listing (`/career-advice`)**
- `src/app/(website)/career-advice/page.jsx` — Converted to async server component. Fetches featured (`/api/articles?sort=featured&limit=10`) and all articles (`/api/articles?limit=20`) in parallel. Sidebar categories and popular tags kept as static config (no API needed). `collectionJsonLd.totalItems` comes from API total.
- `src/app/(website)/career-advice/_components/CareerAdviceClient.jsx` — Removed `categorySlugs` import from mock-data. Category filtering now matches against `a.category?.slug` or `a.category?.name` (API returns `{id, name, slug, color}` objects).
- `src/app/(website)/career-advice/_components/FeaturedArticle.jsx` — Updated to handle API article shape: `category?.name`, `author?.name`, `author?.initials` computed from name. Handles null/undefined safely with optional chaining.
- `src/app/(website)/career-advice/_components/PopularArticles.jsx` — Converted to client component that fetches from `/api/articles?sort=popular&limit=5`. Shows loading state. Displays `viewsCount` from API.
- `src/app/(website)/career-advice/_components/ArticleCategoryPills.jsx` — Moved `categories` array inline (removed mock-data import).

**Part 4: Career Advice Article Detail (`/career-advice/[slug]`)**
- `src/app/(website)/career-advice/[slug]/page.jsx` — Converted to async server component. Fetches from `/api/articles/${slug}` with `{ cache: "no-store" }`. Calls `notFound()` on 404. Dynamic metadata from API data (title, subtitle/excerpt, publishedTime, modifiedTime). Author data normalized with fallbacks (initials computed from name, bio/social/counts from author object). Falls back to `getArticleHtml()` if `article.content` is empty. Related articles use API data with computed gradient/pill colors.
- `src/app/(website)/career-advice/[slug]/_components/ArticleHeader.jsx` — Updated for API shape: null-safe access to `author.name`, `author.title`, `author.initials`. Category from string prop. Subtitle, readingTime, viewsCount all optional.
- `src/app/(website)/career-advice/[slug]/_components/ArticleBody.jsx` — Added null check for `htmlContent` (won't render dangerouslySetInnerHTML if empty).
- `src/app/(website)/career-advice/[slug]/_components/AuthorBio.jsx` — Full defensive coding: returns null if no author name. All fields accessed via optional chaining. Defaults for initials, bio, linkedin, twitter, stats.
- `src/app/(website)/career-advice/[slug]/_components/ArticleSidebar.jsx` — Removed unused `activeReaction` state. Kept as pure presentational client component.
- `src/app/(website)/career-advice/[slug]/_components/ShareButtons.jsx` — Defensive: uses `article?.slug` and `article?.title`.
- `src/app/(website)/career-advice/[slug]/_components/ArticleTags.jsx` — Handles both string tags and `{name}` objects. Returns null for empty array.

**Technical Notes:**
- All server-side fetches use `cache: "no-store"` for fresh data
- `NEXT_PUBLIC_BASE_URL` fallback to `http://localhost:3000` for server-side fetches
- API response shapes differ from mock data (e.g., `category` is object not string, `author` has different fields) — all components updated for API shape
- mock-data.js files NOT deleted (kept for reference) — just no longer imported
- All 15 modified files pass ESLint with zero errors
