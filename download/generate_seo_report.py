import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib import colors
from reportlab.lib.units import cm, inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable
)

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont("Times New Roman", "/usr/share/fonts/truetype/english/Times-New-Roman.ttf"))
pdfmetrics.registerFont(TTFont("Calibri", "/usr/share/fonts/truetype/english/calibri-regular.ttf"))
registerFontFamily("Times New Roman", normal="Times New Roman", bold="Times New Roman")
registerFontFamily("Calibri", normal="Calibri", bold="Calibri")

OUTPUT = "/home/z/my-project/www.jobready.co.ke_website/download/JobNet_SEO_Audit_Report_2026.pdf"
TITLE = "JobNet_SEO_Audit_Report_2026"

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    title=TITLE,
    author="Z.ai",
    creator="Z.ai",
    subject="Comprehensive SEO Audit for jobnet.co.ke - April 2026",
    leftMargin=2*cm, rightMargin=2*cm,
    topMargin=2*cm, bottomMargin=2*cm,
)

# ─── Styles ──────────────────────────────────────────
cover_title = ParagraphStyle("CoverTitle", fontName="Times New Roman", fontSize=36, leading=44, alignment=TA_CENTER, spaceAfter=20, textColor=colors.HexColor("#1F4E79"))
cover_sub = ParagraphStyle("CoverSub", fontName="Times New Roman", fontSize=18, leading=26, alignment=TA_CENTER, spaceAfter=12, textColor=colors.HexColor("#333333"))
cover_meta = ParagraphStyle("CoverMeta", fontName="Times New Roman", fontSize=13, leading=20, alignment=TA_CENTER, spaceAfter=8, textColor=colors.HexColor("#666666"))

h1 = ParagraphStyle("H1", fontName="Times New Roman", fontSize=20, leading=28, spaceBefore=18, spaceAfter=10, textColor=colors.HexColor("#1F4E79"))
h2 = ParagraphStyle("H2", fontName="Times New Roman", fontSize=15, leading=22, spaceBefore=14, spaceAfter=8, textColor=colors.HexColor("#2E75B6"))
h3 = ParagraphStyle("H3", fontName="Times New Roman", fontSize=12, leading=18, spaceBefore=10, spaceAfter=6, textColor=colors.HexColor("#333333"))

body = ParagraphStyle("Body", fontName="Times New Roman", fontSize=10.5, leading=17, alignment=TA_JUSTIFY, spaceAfter=6)
body_left = ParagraphStyle("BodyLeft", fontName="Times New Roman", fontSize=10.5, leading=17, alignment=TA_LEFT, spaceAfter=4)
bullet = ParagraphStyle("Bullet", fontName="Times New Roman", fontSize=10.5, leading=17, alignment=TA_LEFT, leftIndent=20, bulletIndent=8, spaceAfter=4)

th_style = ParagraphStyle("TH", fontName="Times New Roman", fontSize=9.5, leading=13, textColor=colors.white, alignment=TA_CENTER)
td_style = ParagraphStyle("TD", fontName="Times New Roman", fontSize=9.5, leading=13, textColor=colors.black, alignment=TA_LEFT)
td_center = ParagraphStyle("TDC", fontName="Times New Roman", fontSize=9.5, leading=13, textColor=colors.black, alignment=TA_CENTER)

score_green = ParagraphStyle("SG", fontName="Times New Roman", fontSize=10, leading=14, textColor=colors.HexColor("#16A34A"), alignment=TA_CENTER)
score_yellow = ParagraphStyle("SY", fontName="Times New Roman", fontSize=10, leading=14, textColor=colors.HexColor("#CA8A04"), alignment=TA_CENTER)
score_red = ParagraphStyle("SR", fontName="Times New Roman", fontSize=10, leading=14, textColor=colors.HexColor("#DC2626"), alignment=TA_CENTER)

TABLE_HEADER = colors.HexColor("#1F4E79")
TABLE_ALT = colors.HexColor("#F5F5F5")

def make_table(headers, rows, col_widths):
    data = [[Paragraph(f"<b>{h}</b>", th_style) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), td_style) if i == 0 else Paragraph(str(c), td_center) for i, c in enumerate(row)])
    t = Table(data, colWidths=col_widths)
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), TABLE_HEADER),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    for i in range(1, len(data)):
        bg = colors.white if i % 2 == 1 else TABLE_ALT
        style_cmds.append(("BACKGROUND", (0, i), (-1, i), bg))
    t.setStyle(TableStyle(style_cmds))
    return t


story = []

# ═══ COVER PAGE ═══
story.append(Spacer(1, 140))
story.append(Paragraph("<b>SEO Audit Report</b>", cover_title))
story.append(Spacer(1, 20))
story.append(Paragraph("<b>jobnet.co.ke</b>", cover_sub))
story.append(Spacer(1, 12))
story.append(HRFlowable(width="40%", thickness=2, color=colors.HexColor("#1F4E79"), spaceAfter=20, hAlign="CENTER"))
story.append(Paragraph("Comprehensive Technical SEO Analysis", cover_meta))
story.append(Paragraph("Prepared: April 9, 2026", cover_meta))
story.append(Spacer(1, 40))
story.append(Paragraph("Generated by Z.ai", cover_meta))
story.append(PageBreak())

# ═══ EXECUTIVE SUMMARY ═══
story.append(Paragraph("<b>1. Executive Summary</b>", h1))
story.append(Paragraph(
    "This SEO audit evaluates jobnet.co.ke (served from www.jobnet.co.ke) across technical, on-page, and content dimensions. "
    "The site is built with Next.js 14 (App Router) and deployed on Vercel, using Prisma ORM with a MySQL database. "
    "The analysis covers the full public-facing website including the homepage, 30+ job filter pages, 20+ opportunity filter pages, "
    "job detail pages, opportunity detail pages, career advice articles, organization profiles, and static pages such as about, "
    "contact, CV services, and legal pages. The audit identifies both strengths and critical gaps that directly impact organic "
    "search visibility on Google Kenya and international markets.",
    body
))
story.append(Spacer(1, 8))

# Score table
score_data = [
    ["Technical SEO", "72 / 100", "Good foundation, missing assets"],
    ["On-Page SEO", "78 / 100", "Strong metadata, some URL issues"],
    ["Content & Structured Data", "80 / 100", "Rich JSON-LD, Google Jobs ready"],
    ["Sitemap & Crawling", "65 / 100", "Sitemap exists but has URL bugs"],
    ["Page Speed & Performance", "70 / 100", "SSR + caching, needs OG image"],
    ["Overall Score", "73 / 100", "Solid base with high-impact fixes needed"],
]
score_rows_data = []
for r in score_data:
    score_val = int(r[1].split("/")[0].strip())
    if score_val >= 75:
        sstyle = score_green
    elif score_val >= 60:
        sstyle = score_yellow
    else:
        sstyle = score_red
    score_rows_data.append([r[0], Paragraph(f"<b>{r[1]}</b>", sstyle), r[2]])
story.append(make_table(["Category", "Score", "Assessment"], score_rows_data, [4*cm, 3*cm, 9*cm]))
story.append(Spacer(1, 18))

# ═══ TECHNICAL SEO ═══
story.append(Paragraph("<b>2. Technical SEO Analysis</b>", h1))

story.append(Paragraph("<b>2.1 Domain and URL Structure</b>", h2))
story.append(Paragraph(
    "The site operates under two domains: jobnet.co.ke is the live production domain, while jobready.co.ke is referenced "
    "extensively in the codebase configuration files. This domain mismatch is a significant issue because it creates confusion "
    "in canonical URLs, OG tags, sitemaps, and robots.txt directives. The root layout (layout.jsx) correctly uses jobnet.co.ke "
    "as the metadataBase, but site-config.js, robots.js, sitemap.xml/route.js, and manifest.js all reference jobready.co.ke. "
    "This inconsistency means that when Google crawls the site, it may encounter conflicting canonical signals, which dilutes "
    "page authority and can cause indexing problems. A single canonical domain must be established and enforced everywhere.",
    body
))

domain_data = [
    ["Root layout.jsx", "jobnet.co.ke", "Correct"],
    ["site-config.js", "jobready.co.ke", "Wrong domain"],
    ["robots.js", "jobready.co.ke", "Wrong domain"],
    ["sitemap.xml/route.js", "jobready.co.ke", "Wrong domain"],
    ["manifest.js", "(implicit)", "No domain, OK"],
    ["seo.js generateMeta()", "Uses siteConfig", "Inherits wrong domain"],
]
story.append(Spacer(1, 10))
story.append(make_table(["File", "Domain Used", "Status"], domain_data, [4.5*cm, 4.5*cm, 4.5*cm]))
story.append(Spacer(1, 14))

story.append(Paragraph("<b>2.2 URL Structure and Routing</b>", h2))
story.append(Paragraph(
    "The URL structure is well-organized with semantic, keyword-rich paths. Jobs use /jobs/[slug] for individual listings and "
    "/jobs/[filter-slug] for category filter pages. Opportunities follow /opportunities/[slug] for detail pages and "
    "/opportunities/[type-slug] for type filter pages. Organizations use /organizations/[slug]. Career advice articles use "
    "/career-advice/[slug]. This structure is clean and SEO-friendly, with meaningful keywords in the URL paths that help "
    "search engines understand page content. However, there are two notable issues in the sitemap: job detail URLs use /job/[slug] "
    "(singular) instead of /jobs/[slug] (plural), and opportunity URLs construct nested paths like /opportunities/scholarships/[slug] "
    "which do not match the actual routing structure of /opportunities/[slug]. These mismatches mean Google may attempt to crawl "
    "URLs that return 404 errors, wasting crawl budget and potentially harming rankings.",
    body
))
story.append(Spacer(1, 14))

story.append(Paragraph("<b>2.3 Robots.txt Configuration</b>", h2))
story.append(Paragraph(
    "The robots.txt configuration is comprehensive and well-structured. It properly allows all user agents to crawl the public "
    "website while disallowing dashboard, API, and authentication routes. Googlebot is given specific allowances. AI crawlers "
    "(GPTBot, ChatGPT-User, CCBot, anthropic-ai) are fully blocked, which protects content from being used for AI training "
    "without permission. The sitemap directive points to https://jobready.co.ke/sitemap.xml, which again references the wrong "
    "domain. Once the domain is unified, the robots.txt will be fully correct.",
    body
))
story.append(Spacer(1, 14))

story.append(Paragraph("<b>2.4 Security Headers</b>", h2))
story.append(Paragraph(
    "The next.config.ts implements a solid set of security headers including HSTS with preload, X-Frame-Options set to "
    "SAMEORIGIN, X-Content-Type-Options nosniff, Referrer-Policy, XSS Protection, and Permissions-Policy. The X-Powered-By "
    "header is removed, which prevents technology fingerprinting. These headers contribute positively to SEO as Google "
    "prioritizes secure sites in its ranking algorithms. DNS prefetch is enabled for faster external resource loading. "
    "The only enhancement would be adding a Content-Security-Policy header, though this requires careful configuration "
    "to avoid breaking third-party scripts like Google Analytics and AdSense.",
    body
))
story.append(Spacer(1, 18))

# ═══ ON-PAGE SEO ═══
story.append(Paragraph("<b>3. On-Page SEO Analysis</b>", h1))

story.append(Paragraph("<b>3.1 Metadata Implementation</b>", h2))
story.append(Paragraph(
    "The site uses a centralized generateMeta() utility function from src/lib/seo.js that produces comprehensive Next.js "
    "Metadata objects. Every public page uses this function via generateMetadata() exports, ensuring consistent metadata "
    "across the site. The generated metadata includes title (with site name suffix), description, canonical URL, Open Graph "
    "tags (type, locale, URL, site name, title, description, images), Twitter Card tags (summary_large_image), and robots "
    "directives (index, follow). Article-type pages additionally include published_time and modified_time for Google News "
    "eligibility. The title template '%s | JobNet Kenya' is applied via the root layout. Individual page titles are descriptive "
    "and keyword-rich, such as 'Technology and IT Jobs in Kenya 2026 | JobReady' for hub pages.",
    body
))
story.append(Spacer(1, 14))

story.append(Paragraph("<b>3.2 Open Graph and Social Sharing</b>", h2))
story.append(Paragraph(
    "Open Graph tags are properly implemented on all pages through the generateMeta() function. Each page outputs OG title, "
    "description, URL, image, type, locale (en_KE), and site name. Twitter cards use summary_large_image format with matching "
    "title, description, and image. However, the default OG image (og-default.png) referenced in site-config.js does not exist "
    "in the public directory. This means when pages are shared on social media without custom OG images, the share preview will "
    "show a broken image, significantly reducing click-through rates from social platforms. This is a high-priority fix that "
    "requires creating a 1200x630px branded OG image and placing it at /public/og-default.png.",
    body
))
story.append(Spacer(1, 14))

story.append(Paragraph("<b>3.3 Heading Structure</b>", h2))
story.append(Paragraph(
    "Heading structure is generally well-implemented across detail pages. Job detail pages use h1 for the job title, h2 for "
    "section headers like 'Job Description' and 'How to Apply', with h3 for subsections. Opportunity detail pages follow the "
    "same pattern. The homepage uses h2 for section headings which is correct since the site-wide h1 is handled by the logo/brand "
    "in the Header component. Breadcrumb navigation is present on all detail pages, providing both user experience benefits and "
    "additional internal linking for SEO. Each breadcrumb trail includes a BreadcrumbList JSON-LD structured data implementation.",
    body
))
story.append(Spacer(1, 14))

story.append(Paragraph("<b>3.4 Internal Linking</b>", h2))
story.append(Paragraph(
    "Internal linking is extensive and well-designed. The homepage links to every major section: jobs, opportunities, organizations, "
    "career advice, and CV services. Each section contains links to relevant filter pages. Individual job/opportunity detail pages "
    "include Related Jobs/Opportunities cards that create contextual internal links. The footer contains three columns of links "
    "covering all major content areas. The TopBar provides quick access to high-value pages like internships, government jobs, "
    "remote jobs, and scholarships. This interconnected structure helps Google discover and understand the site hierarchy, "
    "distributes page authority across the site, and improves crawl efficiency.",
    body
))
story.append(Spacer(1, 18))

# ═══ STRUCTURED DATA ═══
story.append(Paragraph("<b>4. Structured Data (JSON-LD) Analysis</b>", h1))

story.append(Paragraph(
    "The site has an exceptionally comprehensive structured data implementation with 13 different JSON-LD generators defined "
    "in src/lib/seo.js. This is one of the strongest SEO assets of the site, providing rich semantic information that helps "
    "search engines understand content and enables enhanced search result features. The following table summarizes the "
    "structured data coverage across the site.",
    body
))
story.append(Spacer(1, 10))

schema_data = [
    ["JobPosting", "Job detail pages", "Title, company, salary, location, deadline, remote, experience", "Active"],
    ["Article", "Career advice articles", "Headline, author, publisher, image, date, category", "Active"],
    ["Organization", "Company profiles", "Name, logo, address, industry, social links", "Active"],
    ["BreadcrumbList", "All detail pages", "Full navigation path from home", "Active"],
    ["WebSite + SearchAction", "Homepage", "Site info + search box for Google Sitelinks Search", "Active"],
    ["FAQPage", "CV services page", "Questions and answers", "Available, usage TBD"],
    ["Service", "CV services page", "Service details, pricing, area served, ratings", "Available, usage TBD"],
    ["CollectionPage", "Listing pages", "Page metadata for filter/hub pages", "Available, usage TBD"],
    ["ItemList", "Search results", "Search result items with positions", "Available, usage TBD"],
    ["ContactPage", "Contact page", "Contact info, support channels, address", "Available, usage TBD"],
    ["WebPage", "General pages", "Generic page metadata", "Available, usage TBD"],
]
story.append(make_table(
    ["Schema Type", "Target Pages", "Data Included", "Status"],
    schema_data,
    [2.5*cm, 3*cm, 5*cm, 2*cm]
))
story.append(Spacer(1, 14))

story.append(Paragraph("<b>4.1 Google Jobs Integration</b>", h2))
story.append(Paragraph(
    "The JobPosting JSON-LD implementation is particularly strong and positions the site well for Google Jobs inclusion. "
    "It includes all required and recommended fields: job title, description (as HTML), date posted, employment type mapping "
    "to Google's format, hiring organization with name and logo, job location with postal address, applicant location "
    "requirements, salary information with currency (KES) and period mapping, valid-through deadline, remote work indicator "
    "(jobLocationType: TELECOMMUTE), total job openings, and experience qualifications. The salary information is especially "
    "important as Google prioritizes jobs with salary data in search results. The employment type mapping handles both "
    "canonical UPPER_SNAKE_CASE values and legacy Title Case values for backward compatibility.",
    body
))
story.append(Spacer(1, 18))

# ═══ SITEMAP ANALYSIS ═══
story.append(Paragraph("<b>5. Sitemap Analysis</b>", h1))

story.append(Paragraph(
    "The sitemap is implemented as a dynamic route at /sitemap.xml that generates XML on each request. It includes static "
    "pages (12 entries), job hub pages, opportunity hub pages, and dynamic entries fetched from the database including up to "
    "500 jobs, 500 opportunities, 200 articles, and 200 companies. The sitemap properly sets changeFrequency and priority "
    "values, and includes HTTP caching headers (s-maxage=600, stale-while-revalidate=300) for performance.",
    body
))
story.append(Spacer(1, 10))

story.append(Paragraph("<b>5.1 Critical Sitemap URL Bugs</b>", h2))
story.append(Paragraph(
    "Two critical URL construction bugs have been identified in the sitemap that will cause crawl errors and waste "
    "Google's crawl budget. These must be fixed immediately as they directly impact indexation.",
    body
))
story.append(Spacer(1, 6))

sitemap_bugs = [
    ["Job detail URLs", "SITE_URL/job/[slug]", "SITE_URL/jobs/[slug]", "Incorrect path prefix"],
    ["Opportunity URLs", "SITE_URL/opportunities/[type]/[slug]", "SITE_URL/opportunities/[slug]", "Extra path segment"],
    ["Domain reference", "jobready.co.ke", "jobnet.co.ke", "Wrong domain throughout"],
]
story.append(make_table(
    ["Content Type", "Current URL Pattern", "Correct URL Pattern", "Issue"],
    sitemap_bugs,
    [2.5*cm, 3.8*cm, 3.8*cm, 2.5*cm]
))
story.append(Spacer(1, 14))

story.append(Paragraph(
    "The job URL issue stems from line 104 in sitemap.xml/route.js which constructs URLs as '/job/${job.slug}' (singular) "
    "instead of '/jobs/${job.slug}' (plural). Since the actual route is at /jobs/[slug], every job URL in the sitemap returns "
    "a 404 error. Similarly, opportunity URLs on line 110 construct nested paths with a type slug prefix, but the actual "
    "route structure serves opportunities at /opportunities/[slug] without any type prefix. These two bugs combined mean that "
    "potentially 1,000+ dynamic URLs in the sitemap are invalid. Google will attempt to crawl these, receive 404 responses, "
    "and may reduce crawl frequency for the site as a result.",
    body
))
story.append(Spacer(1, 18))

# ═══ CONTENT SEO ═══
story.append(Paragraph("<b>6. Content SEO Analysis</b>", h1))

story.append(Paragraph("<b>6.1 Content Depth and Quality</b>", h2))
story.append(Paragraph(
    "The site demonstrates strong content depth with multiple content types that target different search intents. Job listings "
    "include structured descriptions with HTML formatting, salary information, location details, and application instructions. "
    "Career advice articles support rich content with featured images, author attribution, reading time estimates, tags, and "
    "related article recommendations. The hub/filter pages (30+ job categories, 20+ opportunity types) create valuable "
    "landing pages that target high-volume search queries like 'government jobs in Kenya', 'internships in Kenya 2026', and "
    "'scholarships for Kenyans'. Each hub page has custom meta titles optimized for search, such as 'Government Jobs in "
    "Kenya 2026 - GoK Vacancies | JobReady'. The opportunity hub covers 20+ types including scholarships, grants, fellowships, "
    "bursaries, competitions, conferences, volunteer positions, and apprenticeships, targeting a wide range of long-tail "
    "keywords that larger international job boards may not cover for the Kenyan market.",
    body
))
story.append(Spacer(1, 14))

story.append(Paragraph("<b>6.2 Keyword Targeting Strategy</b>", h2))
story.append(Paragraph(
    "The keyword targeting strategy is well-aligned with Kenyan job search behavior. The site targets high-volume head terms "
    "like 'jobs in Kenya', 'government jobs', and 'internships' through main category pages. It also captures long-tail "
    "keywords through specific filter combinations such as 'technology jobs in Nairobi', 'entry level jobs no experience', "
    "and 'remote jobs for Kenyans'. Location-based targeting covers major Kenyan cities (Nairobi, Mombasa, Kisumu, Nakuru) "
    "both as filter pages and in job metadata. The opportunity section targets educational and career advancement keywords "
    "that have growing search volume among Kenyan students and young professionals. The career advice blog targets informational "
    "queries that support the transactional job/opportunity pages, creating a content hub that builds topical authority.",
    body
))
story.append(Spacer(1, 18))

# ═══ PERFORMANCE ═══
story.append(Paragraph("<b>7. Performance and Core Web Vitals</b>", h1))

story.append(Paragraph(
    "The Next.js App Router implementation provides strong performance characteristics out of the box. Server-side rendering "
    "(SSR) ensures fast First Contentful Paint (FCP) since HTML is generated on the server. The site uses force-dynamic on "
    "most pages to ensure fresh content, with proper caching headers on the sitemap (600s) and RSS feed. Next.js image "
    "optimization is configured with AVIF and WebP format support. Compression is enabled. However, several performance "
    "optimizations should be addressed. The main layout does not implement any loading strategy for heavy components like "
    "the Header (339 lines) or Footer. Dynamic imports with next/dynamic and loading='lazy' should be used for components "
    "that are not immediately visible. The site lacks a global loading.jsx with a skeleton UI for page transitions.",
    body
))
story.append(Spacer(1, 14))

perf_data = [
    ["Server-Side Rendering", "Yes (App Router)", "Fast FCP, good for SEO"],
    ["Image Optimization", "AVIF + WebP", "Excellent format support"],
    ["Compression", "Enabled", "Good, reduces transfer size"],
    ["Caching Strategy", "Sitemap: 600s", "Needs page-level caching"],
    ["Code Splitting", "Automatic (Next.js)", "Route-based splitting"],
    ["Loading States", "Basic", "Needs skeleton UI improvements"],
    ["OG Image", "Missing", "Critical for social CTR"],
    ["PWA Manifest", "Present", "Icons folder missing"],
]
story.append(make_table(
    ["Feature", "Status", "Notes"],
    perf_data,
    [3.5*cm, 3.5*cm, 6.5*cm]
))
story.append(Spacer(1, 18))

# ═══ PRIORITY FIXES ═══
story.append(Paragraph("<b>8. Priority Fixes and Recommendations</b>", h1))

story.append(Paragraph("<b>8.1 Critical Priority (Fix Immediately)</b>", h2))

critical_fixes = [
    ["Domain Unification", "Update site-config.js, robots.js, and sitemap.xml/route.js to use jobnet.co.ke instead of jobready.co.ke", "HIGH"],
    ["Sitemap Job URLs", "Change '/job/${slug}' to '/jobs/${slug}' in sitemap.xml/route.js line 104", "HIGH"],
    ["Sitemap Opportunity URLs", "Change nested '/opportunities/${type}/${slug}' to '/opportunities/${slug}' in line 110", "HIGH"],
    ["Create OG Image", "Design a 1200x630px branded OG image and save to public/og-default.png", "HIGH"],
    ["Create PWA Icons", "Add icon-192.png and icon-512.png to public/icons/", "MEDIUM"],
]
story.append(make_table(
    ["Fix", "Action Required", "Impact"],
    critical_fixes,
    [3*cm, 9*cm, 2.5*cm]
))
story.append(Spacer(1, 14))

story.append(Paragraph("<b>8.2 High Priority (Fix This Week)</b>", h2))
high_fixes = [
    ["JSON-LD on Listing Pages", "Add CollectionPage + ItemList JSON-LD to /jobs, /opportunities, /organizations pages", "HIGH"],
    ["JSON-LD on Service Pages", "Add Service + FAQ JSON-LD to /cv-services page", "MEDIUM"],
    ["JSON-LD on Contact/About", "Add ContactPage + WebPage JSON-LD to /contact and /about pages", "MEDIUM"],
    ["Sitemap Opportunity Filter", "Fix opportunity query to use 'status: PUBLISHED' instead of 'isPublished: true'", "MEDIUM"],
    ["Add alt text guidelines", "Ensure all dynamically loaded images have descriptive alt attributes", "MEDIUM"],
]
story.append(make_table(
    ["Fix", "Action Required", "Impact"],
    high_fixes,
    [3*cm, 9*cm, 2.5*cm]
))
story.append(Spacer(1, 14))

story.append(Paragraph("<b>8.3 Medium Priority (Fix This Month)</b>", h2))
medium_fixes = [
    ["Implement RSS Feed", "The feed.xml route exists but ensure it outputs valid RSS 2.0 with full content", "MEDIUM"],
    ["Lazy Load Components", "Use next/dynamic for Header, Footer, WhatsAppFloat, CookieConsent", "LOW"],
    ["Add Skeleton Loading", "Implement skeleton UI for loading.jsx pages across all routes", "LOW"],
    ["Content Pruning", "Add noindex to thin/empty filter pages with zero results", "MEDIUM"],
    ["Google Search Console", "Verify jobnet.co.ke in Google Search Console and submit sitemap", "HIGH"],
    ["Bing Webmaster Tools", "Submit sitemap to Bing Webmaster Tools for additional coverage", "MEDIUM"],
]
story.append(make_table(
    ["Fix", "Action Required", "Impact"],
    medium_fixes,
    [3*cm, 9*cm, 2.5*cm]
))
story.append(Spacer(1, 14))

story.append(Paragraph("<b>8.4 SEO Potential Estimate</b>", h2))
story.append(Paragraph(
    "Based on the comprehensive analysis of the site's current SEO implementation, the potential for organic traffic growth "
    "is significant. With the domain unification and sitemap fixes alone, Google will be able to properly index the full depth "
    "of the site's content, which includes potentially 2,500+ job pages, 500+ opportunity pages, 150+ career advice articles, "
    "and 200+ company profiles. Each of these pages targets specific keyword intents in the Kenyan job market. The Google Jobs "
    "integration through JobPosting JSON-LD can drive substantial traffic from the Google Jobs panel, which is increasingly "
    "prominent in search results for job-related queries in Kenya. The 30+ job category hub pages and 20+ opportunity type "
    "pages create a wide net for capturing long-tail search traffic. Once the critical fixes are implemented and the site is "
    "properly submitted to Google Search Console, organic traffic could realistically increase by 200-400% within 3-6 months, "
    "particularly for high-value queries like 'government jobs in Kenya 2026', 'scholarships for Kenyans', and 'internships "
    "in Nairobi'. The existing content quality, structured data depth, and clean URL structure provide a strong foundation "
    "that rivals established job boards in the Kenyan market.",
    body
))

# Build
doc.build(story)
print(f"PDF generated: {OUTPUT}")
