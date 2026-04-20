# JobNet.co.ke — Complete Build Documentation

> **Version**: 0.2.0  
> **Last Updated**: April 2026  
> **Status**: Production (Live at [https://www.jobnet.co.ke](https://www.jobnet.co.ke))  
> **Future Domain**: www.jobready.co.ke  
> **Current HEAD**: `897c4af` (UX fixes — filter toggle, no sticky, natural scrolling)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Database Schema (Prisma + MySQL)](#3-database-schema-prisma--mysql)
4. [Project Folder Structure](#4-project-folder-structure)
5. [Routing Architecture](#5-routing-architecture)
6. [SEO Strategy](#6-seo-strategy)
7. [Filter System & Enum Data](#7-filter-system--enum-data)
8. [Catch-All Routes & Combo Filters](#8-catch-all-routes--combo-filters)
9. [Authentication System](#9-authentication-system)
10. [Component Architecture](#10-component-architecture)
11. [API Routes](#11-api-routes)
12. [M-Pesa Payment Integration](#12-mpesa-payment-integration)
13. [UX Features](#13-ux-features)
14. [Configuration & Environment](#14-configuration--environment)
15. [Deployment](#15-deployment)
16. [Seed Data](#16-seed-data)
17. [Legal & Compliance](#17-legal--compliance)
18. [Key Development Rules](#18-key-development-rules)
19. [Git Commit History](#19-git-commit-history)
20. [Pending Enhancements](#20-pending-enhancements)

---

## 1. Project Overview

JobNet.co.ke (brand: JobReady Kenya) is a comprehensive **Kenyan job board and career services platform** built with Next.js 14 (App Router), Prisma ORM, and MySQL. The platform serves job seekers, employers, and career professionals with four core pillars:

- **Job Listings**: Browse and search thousands of jobs across 44+ categories, with filtering by employment type, experience level, location (47 Kenyan counties + 10 other African/international countries), and remote work.
- **Opportunities**: Scholarships, grants, fellowships, bursaries, bootcamps, mentorships, and 23 other opportunity types for Kenyan students and professionals.
- **Organizations**: Company profiles for employers across 11 organization types (NGOs, government, startups, international orgs, etc.) and 35 industries.
- **Career Services**: Professional CV writing, cover letter, and LinkedIn profile optimization with tiered pricing (KSh 500 – KSh 3,500), integrated M-Pesa payments.
- **Career Advice**: Blog with 7 categories, tag cloud, author profiles, emoji reactions, and rich article content.
- **Job Seeker Dashboard**: Saved jobs, job applications, order tracking, alerts, profile management, and notification center.

### Key Statistics
- **~6,000+ SEO pages** generated via catch-all filter routes
- **64 standalone filter pages** across jobs, opportunities, and organizations
- **44 job categories** with 600+ subcategories
- **47 Kenyan county** location filters + 10 other countries
- **23 opportunity types**
- **11 organization types** and **35 industries**
- **28 Prisma models** covering the full platform

---

## 2. Tech Stack

### Core Framework
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.1 | React framework (App Router) |
| **React** | 19.0.0 | UI library |
| **TypeScript** | 5.x | Type safety (build-time only) |
| **Prisma** | 6.19.3 | ORM for MySQL |
| **MySQL** | 8.x | Production database |

### Styling & UI
| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | 4.x | Utility-first CSS |
| **shadcn/ui** | Latest | 50+ pre-built UI components |
| **Radix UI** | Various | Accessible primitives |
| **Lucide React** | 0.525.0 | Icon library |
| **React Icons** | 5.6.0 | Additional icons |
| **Framer Motion** | 12.23.2 | Animations |

### Authentication & Security
| Technology | Version | Purpose |
|---|---|---|
| **NextAuth.js** | 4.24.11 | JWT-based auth (email/password + Google OAuth) |
| **bcryptjs** | 3.0.3 | Password hashing |
| **jsonwebtoken** | 9.0.3 | JWT token handling |

### Backend & Integration
| Technology | Version | Purpose |
|---|---|---|
| **mysql2** | 3.20.0 | MySQL driver |
| **nodemailer** | 7.0.13 | Transactional email |
| **zod** | 4.0.2 | Schema validation |
| **zustand** | 5.0.6 | Client-side state management |
| **@tanstack/react-query** | 5.82.0 | Server state management |
| **sharp** | 0.34.3 | Image processing |

### Content & Rich Text
| Technology | Version | Purpose |
|---|---|---|
| **@mdxeditor/editor** | 3.39.1 | Rich text editor |
| **react-markdown** | 10.1.0 | Markdown rendering |
| **react-syntax-highlighter** | 15.6.1 | Code highlighting |

### Data & Forms
| Technology | Version | Purpose |
|---|---|---|
| **react-hook-form** | 7.60.0 | Form management |
| **@hookform/resolvers** | 5.1.1 | Zod integration |
| **@tanstack/react-table** | 8.21.3 | Data tables |
| **recharts** | 2.15.4 | Charts |
| **date-fns** | 4.1.0 | Date utilities |

### Deployment
| Technology | Purpose |
|---|---|
| **Vercel** | Hosting & CI/CD |
| **Bun** | JavaScript runtime (dev & production) |
| **GitHub** | Version control |

---

## 3. Database Schema (Prisma + MySQL)

The schema is defined in `prisma/schema.prisma` with **28 models** across 6 functional domains. Key design decisions:
- Enums stored as `String`, validated in app code against `src/data/org_data.js`
- Location stored as structured fields (`country`, `county`, `town`)
- No `JobCategory` table — categories driven by `hub-config.js` / `org_data.js`
- JSON type for array fields (MySQL JSON columns)
- Nullable `userId` on orders (walk-in WhatsApp orders)
- Denormalized counters (`jobCount`, `opportunityCount`, `viewCount`, `applicantCount`) for performance

### 3.1 User & Auth Domain (4 models)

| Model | Table | Description | Key Fields |
|---|---|---|---|
| **User** | `users` | Job seekers, employers, admins | id, email, phone, googleId, name, passwordHash, role, avatar, bio, location, linkedinUrl, education, skills (JSON), cvUrl, emailVerified, phoneVerified |
| **AuthAccount** | `auth_accounts` | Multi-provider auth tokens | provider ("google"/"email"/"phone"), providerAccountId, accessToken, refreshToken, idToken, expiresAt, scope |
| **Otp** | `otps` | One-time passwords | phone, code, purpose ("auth"/"reset"/"verify"), verified, expiresAt |
| **Application** | `applications` | Job applications | jobId FK, userId FK, coverLetter, cvUrl, status, employerNotes |

### 3.2 Content Domain (7 models)

| Model | Table | Description | Key Fields |
|---|---|---|---|
| **Company** | `companies` | Employer organizations | id, name, slug, logo, logoColor, description, organizationType, industry, size, county, town, country, website, socialLinks (JSON), contactEmail, phoneNumber, isVerified, isFeatured, isActive, jobCount, opportunityCount |
| **Job** | `jobs` | Job listings (core) | id, title, slug, description (LongText), categories (JSON), shortDescription, featuredImage, companyId FK, country, county, town, isRemote, salaryMin, salaryMax, salaryCurrency, salaryPeriod, employmentType, experienceLevel, industry, positions, applicationDeadline, howToApply, createdBy, isFeatured, isActive, status, tags (JSON), metaTitle, metaDescription, viewCount, applicantCount, publishedAt |
| **Opportunity** | `opportunities` | Scholarships, grants, etc. | id, title, slug, description (LongText), excerpt, featuredImage, companyId (nullable FK), opportunityType, deadline, howToApply, createdBy, tags (JSON), status, isFeatured, isActive, noIndex, metaTitle, metaDescription, ogImage, viewCount, publishedAt |
| **BlogCategory** | `blog_categories` | 7 blog categories | name, slug, description, color, gradient, articleCount |
| **BlogArticle** | `blog_articles` | Career advice articles | title, slug, excerpt, content (LongText), featuredImage, authorId FK, categoryId FK, readingTime, viewsCount, wordCount, isFeatured, isPublished, noIndex, metaTitle, metaDescription, ogImage, canonicalUrl, publishedAt |
| **Author** | `authors` | Career coaches/writers | name, slug, title, bio, avatar, twitterUrl, linkedinUrl, articleCount, totalViews, peopleCoached |
| **BlogTag** | `blog_tags` | Article tags (M:N) | name, slug, articleCount |
| **ArticleTag** | `article_tags` | M:N junction | articleId PK, tagId PK |
| **SitePage** | `site_pages` | CMS legal/info pages | title, slug, content (LongText), metaTitle, metaDescription, status, lastReviewedAt |

### 3.3 Commerce Domain (6 models)

| Model | Table | Description | Key Fields |
|---|---|---|---|
| **ServiceTier** | `service_tiers` | Pricing tiers | serviceType ("CV_WRITING"/"COVER_LETTER"/"LINKEDIN_PROFILE"), tier ("BASIC"/"PROFESSIONAL"/"PREMIUM"), name, description, price, currency, features (JSON), deliveryDays, revisionCount |
| **Order** | `orders` | Service orders | orderNumber, userId (nullable), email, phone, fullName, status, totalAmount, paidAmount, balanceDue, paymentStatus, notes, confirmedAt, completedAt |
| **OrderItem** | `order_items` | Line items | orderId FK, serviceTierId FK, serviceName, tierName, price, quantity, subtotal |
| **Payment** | `payments` | M-Pesa records | orderId FK, checkoutRequestId, mpesaReceiptNumber, phoneNumber, amount, status, resultDesc, resultCode, mpesaCallbackData (JSON) |
| **OrderActivity** | `order_activity` | Status timeline | orderId FK, action, description, metadata (JSON), performedBy |
| **OrderAttachment** | `order_attachments` | File attachments | orderId FK, fileName, filePath, fileSize, fileType, uploadedBy |

### 3.4 Engagement Domain (5 models)

| Model | Table | Description | Key Fields |
|---|---|---|---|
| **SavedJob** | `saved_jobs` | User bookmarks | userId FK, jobId FK |
| **SavedArticle** | `saved_articles` | Article bookmarks | userId FK, articleId FK |
| **JobAlert** | `job_alerts` | Email job alerts | userId FK, query, location, jobType, category, isActive, lastSentAt, emailOpenCount, emailClickCount |
| **ArticleReaction** | `article_reactions` | Emoji reactions | articleId FK, userId (nullable), reactionType, fingerprint, ipAddress |
| **Notification** | `notifications` | In-app notifications | userId FK, type, title, message, data (JSON), isRead |

### 3.5 Analytics Domain (3 models)

| Model | Table | Description | Key Fields |
|---|---|---|---|
| **PageView** | `page_views` | Page tracking | pageType, pageId, sessionId, ipAddress, userAgent, referer |
| **WhatsAppClick** | `whatsapp_clicks` | CTA tracking | pageType, pageId, sessionId, phoneNumber, context |
| **Faq** | `faqs` | FAQs | question, answer, category, sortOrder |

### 3.6 Compliance Domain (1 model)

| Model | Table | Description | Key Fields |
|---|---|---|---|
| **DataRequest** | `data_requests` | DPA compliance | email, requestType ("ACCESS"/"CORRECTION"/"DELETION"/"OBJECTION"/"PORTABILITY"), status, dataRequested (JSON), processedAt, responseNote |
| **NewsletterSubscription** | `newsletter_subscriptions` | Email subscriptions | email, userId (nullable), type ("career_tips"/"job_alerts"), isActive, subscribedAt, unsubscribedAt |

---

## 4. Project Folder Structure

```
www.jobready.co.ke_website/
├── .gitignore
├── Caddyfile                          # Reverse proxy config (production)
├── eslint.config.mjs
├── next.config.ts                     # Security headers, image optimization, CORS
├── package.json                       # Dependencies & scripts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── worklog.md                         # Build log (appended by agents)
│
├── prisma/
│   ├── schema.prisma                  # Full database schema (28 models)
│   ├── seed.js                        # Master seed script
│   ├── seed-7c-jobs.js                # Job seeding data
│   ├── seed-7d-opportunities.js       # Opportunity seeding data
│   ├── seed-7e-articles.js            # Blog article seeding
│   ├── seed-7f-users.js               # User seeding
│   ├── seed-7g-services.js            # Service tier seeding
│   └── worklog.md
│
├── public/
│   ├── logo.svg                       # JobReady logo
│   └── prototype.html                 # Original HTML prototype
│
├── scripts/
│   ├── generate-job-pages.js          # Static job page generator
│   ├── generate-opportunity-pages.js  # Static opportunity page generator
│   └── generate-organization-pages.js # Static organization page generator
│
├── src/
│   ├── app/
│   │   ├── layout.jsx                 # Root layout (Analytics, AuthProvider)
│   │   ├── globals.css                # Global styles + Tailwind
│   │   ├── loading.jsx                # Global loading spinner
│   │   ├── not-found.jsx              # Custom 404
│   │   ├── error.jsx                  # Error boundary
│   │   ├── manifest.js                # PWA manifest
│   │   ├── robots.js                  # robots.txt generator
│   │   │
│   │   ├── (auth)/                    # Auth route group (no header/footer)
│   │   │   ├── layout.jsx
│   │   │   ├── login/page.jsx
│   │   │   ├── register/page.jsx
│   │   │   ├── forgot-password/page.jsx
│   │   │   ├── reset-password/page.jsx
│   │   │   ├── set-password/page.jsx
│   │   │   ├── onboarding/page.jsx
│   │   │   ├── verify-email/page.jsx
│   │   │   ├── verify-phone/page.jsx
│   │   │   └── _components/
│   │   │       ├── AuthCard.jsx
│   │   │       ├── InputField.jsx
│   │   │       ├── OtpInput.jsx
│   │   │       ├── PasswordStrength.jsx
│   │   │       └── SocialLoginButtons.jsx
│   │   │
│   │   ├── (website)/                 # Public website route group
│   │   │   ├── layout.jsx             # TopBar + Header + Footer + CookieConsent
│   │   │   ├── page.jsx               # Homepage
│   │   │   ├── loading.jsx
│   │   │   ├── error.jsx
│   │   │   │
│   │   │   ├── jobs/
│   │   │   │   ├── page.jsx           # Main jobs listing
│   │   │   │   ├── loading.jsx
│   │   │   │   ├── [...slug]/         # Catch-all: detail + combo filters
│   │   │   │   │   ├── page.jsx       # Job detail OR filtered listing
│   │   │   │   │   └── loading.jsx
│   │   │   │   ├── agriculture/page.jsx
│   │   │   │   ├── architecture-construction/page.jsx
│   │   │   │   ├── consulting/page.jsx
│   │   │   │   ├── contract/page.jsx
│   │   │   │   ├── creative-design/page.jsx
│   │   │   │   ├── customer-service/page.jsx
│   │   │   │   ├── director/page.jsx
│   │   │   │   ├── education-training/page.jsx
│   │   │   │   ├── engineering/page.jsx
│   │   │   │   ├── entry-level/page.jsx
│   │   │   │   ├── executive/page.jsx
│   │   │   │   ├── finance-accounting/page.jsx
│   │   │   │   ├── fitness-wellness/page.jsx
│   │   │   │   ├── full-time/page.jsx
│   │   │   │   ├── government/page.jsx
│   │   │   │   ├── government-public-sector/page.jsx
│   │   │   │   ├── healthcare/page.jsx
│   │   │   │   ├── hospitality-tourism/page.jsx
│   │   │   │   ├── human-resources/page.jsx
│   │   │   │   ├── insurance/page.jsx
│   │   │   │   ├── internship/page.jsx
│   │   │   │   ├── internships/page.jsx
│   │   │   │   ├── lead/page.jsx
│   │   │   │   ├── legal-compliance/page.jsx
│   │   │   │   ├── logistics-supply-chain/page.jsx
│   │   │   │   ├── manager/page.jsx
│   │   │   │   ├── marketing-communications/page.jsx
│   │   │   │   ├── media-publishing/page.jsx
│   │   │   │   ├── mid-level/page.jsx
│   │   │   │   ├── nonprofit/page.jsx
│   │   │   │   ├── operations-admin/page.jsx
│   │   │   │   ├── part-time/page.jsx
│   │   │   │   ├── real-estate/page.jsx
│   │   │   │   ├── remote/page.jsx
│   │   │   │   ├── sales-business/page.jsx
│   │   │   │   ├── science-research/page.jsx
│   │   │   │   ├── senior/page.jsx
│   │   │   │   ├── skilled-trades/page.jsx
│   │   │   │   ├── specialised-services/page.jsx
│   │   │   │   ├── technology/page.jsx
│   │   │   │   ├── temporary/page.jsx
│   │   │   │   ├── transportation/page.jsx
│   │   │   │   └── volunteer/page.jsx
│   │   │   │
│   │   │   ├── opportunities/
│   │   │   │   ├── page.jsx           # Main opportunities listing
│   │   │   │   ├── loading.jsx
│   │   │   │   ├── [...slug]/         # Catch-all: detail + combo filters
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   └── loading.jsx
│   │   │   │   ├── accelerators/page.jsx
│   │   │   │   ├── apprenticeships/page.jsx
│   │   │   │   ├── awards/page.jsx
│   │   │   │   ├── bootcamps/page.jsx
│   │   │   │   ├── bursaries/page.jsx
│   │   │   │   ├── certifications/page.jsx
│   │   │   │   ├── competitions/page.jsx
│   │   │   │   ├── conferences/page.jsx
│   │   │   │   ├── exchanges/page.jsx
│   │   │   │   ├── fellowships/page.jsx
│   │   │   │   ├── funding/page.jsx
│   │   │   │   ├── grants/page.jsx
│   │   │   │   ├── incubators/page.jsx
│   │   │   │   ├── internships/page.jsx
│   │   │   │   ├── mentorships/page.jsx
│   │   │   │   ├── research/page.jsx
│   │   │   │   ├── residencies/page.jsx
│   │   │   │   ├── scholarships/page.jsx
│   │   │   │   ├── sponsorships/page.jsx
│   │   │   │   ├── training/page.jsx
│   │   │   │   ├── university-admissions/page.jsx
│   │   │   │   ├── volunteer/page.jsx
│   │   │   │   └── workshops/page.jsx
│   │   │   │
│   │   │   ├── organizations/
│   │   │   │   ├── page.jsx           # Main organizations listing
│   │   │   │   ├── loading.jsx
│   │   │   │   ├── [...slug]/         # Catch-all: detail + combo filters
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── county-government/page.jsx
│   │   │   │   ├── foundations/page.jsx
│   │   │   │   ├── government/page.jsx
│   │   │   │   ├── international/page.jsx
│   │   │   │   ├── ngos/page.jsx
│   │   │   │   ├── private/page.jsx
│   │   │   │   ├── religious/page.jsx
│   │   │   │   ├── smes/page.jsx
│   │   │   │   ├── startups/page.jsx
│   │   │   │   ├── state-corporations/page.jsx
│   │   │   │   └── universities/page.jsx
│   │   │   │
│   │   │   ├── career-advice/
│   │   │   │   ├── page.jsx           # Blog listing
│   │   │   │   ├── loading.jsx
│   │   │   │   └── [slug]/page.jsx    # Article detail
│   │   │   │
│   │   │   ├── cv-services/
│   │   │   │   ├── page.jsx           # CV services landing
│   │   │   │   └── _components/
│   │   │   │       ├── FAQAccordion.jsx
│   │   │   │       ├── HowItWorks.jsx
│   │   │   │       ├── OrderModal.jsx
│   │   │   │       ├── PricingTable.jsx
│   │   │   │       ├── ServiceCard.jsx
│   │   │   │       ├── Testimonials.jsx
│   │   │   │       └── mock-data.js
│   │   │   │
│   │   │   ├── search/
│   │   │   │   ├── page.jsx           # Search + inline filters
│   │   │   │   └── loading.jsx
│   │   │   │
│   │   │   ├── about/page.jsx
│   │   │   ├── contact/
│   │   │   │   ├── page.jsx
│   │   │   │   └── _components/ContactForm.jsx
│   │   │   ├── privacy/page.jsx
│   │   │   ├── terms/page.jsx
│   │   │   ├── cookies/page.jsx
│   │   │   ├── disclaimer/page.jsx
│   │   │   ├── refunds/page.jsx
│   │   │   └── data-protection/page.jsx
│   │   │
│   │   ├── (website)/_components/     # Shared website components
│   │   │   ├── AdPlaceholder.jsx
│   │   │   ├── BookmarkButton.jsx
│   │   │   ├── CVServiceStrip.jsx
│   │   │   ├── CVServicesCTA.jsx
│   │   │   ├── CVWritingCTA.jsx
│   │   │   ├── CareerBlog.jsx
│   │   │   ├── CategoryGrid.jsx
│   │   │   ├── CompanyAboutCard.jsx
│   │   │   ├── ContactInfoCard.jsx
│   │   │   ├── DeadlineStrip.jsx
│   │   │   ├── EntryInternLocation.jsx
│   │   │   ├── FeaturedJobs.jsx
│   │   │   ├── FilterSidebarWrapper.jsx  # ★ Filter toggle + mobile drawer
│   │   │   ├── Footer.jsx
│   │   │   ├── GovVacancies.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── HomeHero.jsx
│   │   │   ├── HomeSidebar.jsx
│   │   │   ├── JobFilterView.jsx     # ★ All 35+ job filter sub-pages
│   │   │   ├── JobList.jsx
│   │   │   ├── LegalLayout.jsx
│   │   │   ├── OpportunityFilterView.jsx
│   │   │   ├── OpportunityGrid.jsx
│   │   │   ├── OrganizationFilterView.jsx
│   │   │   ├── RelatedJobsCard.jsx
│   │   │   ├── ServiceNudge.jsx
│   │   │   ├── ShareStrip.jsx        # ★ Social sharing (tailored labels)
│   │   │   ├── SubscribeForm.jsx
│   │   │   ├── TopBar.jsx
│   │   │   ├── TrendingNow.jsx
│   │   │   ├── TrustedByBar.jsx
│   │   │   ├── UniCvBursaries.jsx
│   │   │   └── WhatsAppFloat.jsx
│   │   │
│   │   ├── dashboard/                 # Protected user dashboard
│   │   │   ├── layout.jsx
│   │   │   ├── page.jsx               # Dashboard overview
│   │   │   ├── loading.jsx
│   │   │   ├── error.jsx
│   │   │   ├── _components/
│   │   │   │   ├── AppSidebar.jsx
│   │   │   │   ├── DashboardBanner.jsx
│   │   │   │   ├── DashboardHeader.jsx
│   │   │   │   ├── DashboardOverview.jsx
│   │   │   │   └── DashboardShell.jsx
│   │   │   ├── jobs/
│   │   │   │   ├── page.jsx           # My jobs
│   │   │   │   └── new/
│   │   │   │       ├── page.jsx
│   │   │   │       └── _components/PostJobForm.jsx
│   │   │   ├── opportunities/new/
│   │   │   │   ├── page.jsx
│   │   │   │   └── _components/PostOpportunityForm.jsx
│   │   │   ├── applications/page.jsx
│   │   │   ├── saved-jobs/
│   │   │   │   ├── layout.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── alerts/
│   │   │   │   ├── page.jsx
│   │   │   │   └── _components/AlertsContent.jsx
│   │   │   ├── profile/
│   │   │   │   ├── layout.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── settings/
│   │   │   │   ├── page.jsx
│   │   │   │   └── _components/SettingsContent.jsx
│   │   │   ├── orders/
│   │   │   │   ├── page.jsx
│   │   │   │   └── _components/OrdersContent.jsx
│   │   │   ├── billing/
│   │   │   │   ├── page.jsx
│   │   │   │   └── _components/BillingContent.jsx
│   │   │   └── company/
│   │   │       ├── page.jsx
│   │   │       └── _components/CompanyProfileForm.jsx
│   │   │
│   │   ├── api/                       # API routes (55 endpoints)
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.js  # NextAuth handler
│   │   │   │   ├── complete-profile/route.js
│   │   │   │   ├── forgot-password/route.js
│   │   │   │   ├── link-google/route.js
│   │   │   │   ├── phone-session/route.js
│   │   │   │   ├── register/route.js
│   │   │   │   ├── reset-password/route.js
│   │   │   │   ├── send-email-verification/route.js
│   │   │   │   ├── send-otp/route.js
│   │   │   │   ├── set-password/route.js
│   │   │   │   ├── verify-email-link/route.js
│   │   │   │   └── verify-otp/route.js
│   │   │   ├── jobs/
│   │   │   │   ├── route.js           # GET /jobs (list) + POST (create)
│   │   │   │   └── [slug]/
│   │   │   │       ├── route.js       # GET /jobs/:slug (detail) + PUT + DELETE
│   │   │   │       └── apply/route.js # POST application
│   │   │   ├── opportunities/
│   │   │   │   ├── route.js
│   │   │   │   └── [slug]/route.js
│   │   │   ├── organizations/
│   │   │   │   ├── route.js
│   │   │   │   └── [slug]/route.js
│   │   │   ├── companies/
│   │   │   │   ├── route.js
│   │   │   │   ├── [slug]/route.js
│   │   │   │   └── logo/route.js
│   │   │   ├── articles/
│   │   │   │   ├── route.js
│   │   │   │   └── [slug]/route.js
│   │   │   ├── career-advice/route.js
│   │   │   ├── search/route.js
│   │   │   ├── saved-jobs/route.js
│   │   │   ├── applications/
│   │   │   │   ├── route.js
│   │   │   │   └── [id]/route.js
│   │   │   ├── alerts/route.js
│   │   │   ├── notifications/route.js
│   │   │   ├── newsletter/route.js
│   │   │   ├── contact/route.js
│   │   │   ├── dashboard/stats/route.js
│   │   │   ├── orders/
│   │   │   │   ├── route.js
│   │   │   │   ├── my/route.js
│   │   │   │   └── [id]/route.js
│   │   │   ├── payments/
│   │   │   │   ├── route.js
│   │   │   │   ├── [id]/route.js
│   │   │   │   ├── mpesa/callback/route.js
│   │   │   │   ├── stk-push/route.js
│   │   │   │   ├── stk-query/route.js
│   │   │   │   └── order/[orderId]/route.js
│   │   │   ├── user/
│   │   │   │   ├── account/route.js
│   │   │   │   ├── avatar/route.js
│   │   │   │   ├── change-password/route.js
│   │   │   │   ├── profile/route.js
│   │   │   │   ├── send-update-email/route.js
│   │   │   │   ├── send-verify-email/route.js
│   │   │   │   ├── send-verify-phone/route.js
│   │   │   │   ├── verify-email/route.js
│   │   │   │   └── verify-phone/route.js
│   │   │   └── services/tiers/route.js
│   │   │
│   │   ├── feed.xml/route.js          # RSS feed
│   │   └── sitemap.xml/route.js       # Dynamic XML sitemap
│   │
│   ├── components/                    # Shared components
│   │   ├── AuthProvider.jsx           # NextAuth session provider
│   │   ├── ProtectedRoute.jsx         # Auth guard component
│   │   ├── CookieConsent.jsx          # GDPR/DPA cookie banner
│   │   ├── AdSense.jsx                # Google AdSense integration
│   │   ├── Analytics.jsx              # Analytics tracking
│   │   └── ui/                        # 50+ shadcn/ui components
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── select.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── tabs.tsx
│   │       ├── table.tsx
│   │       ├── toast.tsx
│   │       ├── tooltip.tsx
│   │       └── ... (40+ more)
│   │
│   ├── config/
│   │   ├── site-config.js             # ★ Centralized site config (brand, domain, WhatsApp, emails, nav)
│   │   └── hub-config.js              # ★ 26 hub pages (jobs + opportunities) with filters & SEO
│   │
│   ├── data/
│   │   └── org_data.js                # ★ Master enum data: categories, locations, industries, etc.
│   │
│   ├── lib/
│   │   ├── auth.js                    # NextAuth configuration (JWT + Google OAuth)
│   │   ├── auth-identity.js           # User identity resolution & linking
│   │   ├── db.js                      # Prisma client singleton
│   │   ├── email.js                   # Nodemailer email templates
│   │   ├── filter-parser.js           # ★ URL slug → DB filter mapping + sitemap URL generators
│   │   ├── format.js                  # Date, currency, number formatters
│   │   ├── mpesa.js                   # Daraja M-Pesa STK Push integration
│   │   ├── normalize.js               # Phone/email normalization
│   │   ├── parse-filter-segments.js   # Additional filter segment parsing
│   │   ├── rate-limit.js              # API rate limiting
│   │   ├── seo.js                     # ★ 12 JSON-LD generators + generateMeta()
│   │   ├── service-mapper.js          # Service tier mapping
│   │   ├── slug.js                    # Slug generation utility
│   │   ├── sms.js                     # SMS sending (Africa's Talking)
│   │   ├── useSession.js              # Client-side session hook
│   │   └── utils.ts                   # Tailwind merge utility (cn)
│   │
│   ├── hooks/
│   │   ├── use-mobile.ts              # Mobile breakpoint detection hook
│   │   └── use-toast.ts               # Toast notification hook
│   │
│   └── middleware.js                  # Auth middleware (JWT-based route protection)
│
├── .zscripts/                         # Hosting scripts
│   ├── build.sh
│   ├── dev.sh
│   ├── start.sh
│   └── ...
│
├── download/                          # Generated assets & prototypes
│   ├── JobNet_SEO_Audit_Report_2026.pdf
│   └── *.png, *.html                 # Screenshots & HTML prototypes
│
└── examples/                          # Example code
    └── websocket/
        ├── frontend.tsx
        └── server.ts
```

---

## 5. Routing Architecture

### 5.1 Route Groups

Next.js App Router uses route groups `(parentheses)` to organize layouts without affecting URL paths:

| Route Group | Layout | Purpose |
|---|---|---|
| `(website)` | TopBar + Header + Main + Footer + CookieConsent + AdSense | All public pages |
| `(auth)` | AuthCard wrapper (no header/footer) | Login, register, password reset |
| `dashboard` | AppSidebar + DashboardHeader (protected) | User dashboard |
| `api/` | None (JSON responses) | REST API endpoints |

### 5.2 Dynamic Routes

| Route Pattern | Handler | Purpose |
|---|---|---|
| `/jobs/[...slug]` | `jobs/[...slug]/page.jsx` | Job detail (1 segment) OR combo filter (2+ segments) |
| `/opportunities/[...slug]` | `opportunities/[...slug]/page.jsx` | Opportunity detail OR combo filter |
| `/organizations/[...slug]` | `organizations/[...slug]/page.jsx` | Company profile OR combo filter |
| `/career-advice/[slug]` | `career-advice/[slug]/page.jsx` | Blog article detail |
| `/api/jobs/[slug]` | API | Get/put/delete single job |
| `/api/jobs/[slug]/apply` | API | Apply to job |
| `/api/opportunities/[slug]` | API | Get/put/delete single opportunity |
| `/api/organizations/[slug]` | API | Get/put/delete single organization |
| `/api/articles/[slug]` | API | Get article by slug |

### 5.3 Middleware Protection

Defined in `src/middleware.js`:
- **Protected routes** (require JWT): `/dashboard/*`
- **Public routes** (no auth needed): All website pages, `/api/*`, `/auth/*`, static assets
- **Onboarding gate**: Google-only users without a password are redirected to `/onboarding`
- **JWT auto-refresh**: Tokens older than 5 minutes are refreshed from DB

---

## 6. SEO Strategy

### 6.1 Meta Tags (Per-Page)

Every page generates metadata via `generateMeta()` in `src/lib/seo.js`:

```javascript
generateMeta({
  title: "Technology Jobs in Kenya",
  description: "Browse 200+ technology jobs in Kenya...",
  path: "/jobs/technology",
  ogImage: "/og-tech-jobs.png",
  ogType: "website",        // or "article"
  publishedTime: "...",      // for articles
  modifiedTime: "...",       // for articles
})
```

This produces:
- `<title>` with `"Page Title | JobReady Kenya"` template
- `<meta name="description">` 
- `<link rel="canonical">` 
- Full OpenGraph tags (og:title, og:description, og:image, og:url, og:locale, og:type)
- Twitter Card tags (summary_large_image)
- `<meta name="robots" content="index, follow">`

### 6.2 JSON-LD Structured Data (12 Generators)

All defined in `src/lib/seo.js`:

| Generator | Schema.org Type | Used On |
|---|---|---|
| `generateJobJsonLd()` | `JobPosting` | Every job detail page |
| `generateArticleJsonLd()` | `Article` | Every blog article |
| `generateOrganizationJsonLd()` | `Organization` | Every company profile |
| `generateBreadcrumbJsonLd()` | `BreadcrumbList` | All pages with breadcrumbs |
| `generateWebSiteJsonLd()` | `WebSite` + `SearchAction` | Homepage |
| `generateFAQJsonLd()` | `FAQPage` | CV Services, legal pages |
| `generateServiceJsonLd()` | `Service` | CV Services page |
| `generateCollectionPageJsonLd()` | `CollectionPage` | Listing pages |
| `generateItemListJsonLd()` | `ItemList` | Search results, filtered listings |
| `generateContactPageJsonLd()` | `ContactPage` | Contact page |
| `generateWebPageJsonLd()` | `WebPage` | About, general pages |
| `mergeJsonLd()` | Utility | Combines multiple JSON-LD objects |

**Google Jobs Compliance** (`generateJobJsonLd`):
- `datePosted` from `createdAt`
- `validThrough` from `applicationDeadline`
- `employmentType` mapped to Google's format (FULL_TIME, PART_TIME, CONTRACTOR, INTERN, VOLUNTEER, TEMPORARY)
- `baseSalary` with currency, min/max, and period
- `jobLocation` from structured `county`/`country` fields
- `jobLocationType: "TELECOMMUTE"` for remote jobs
- `hiringOrganization` with logo and `sameAs` social links
- `qualifications` mapped from `experienceLevel`
- `totalJobOpenings` from `positions` field

### 6.3 Sitemap

Dynamic sitemap at `/sitemap.xml` (route: `src/app/(website)/sitemap.xml/route.js`):

**Static Pages** (12 pages, priority 0.3–1.0):
- Homepage, Jobs, Opportunities, Organizations, Career Advice, CV Services, Search, About, Contact, Privacy, Terms, Cookies

**Hub Pages** (26 pages, priority 0.8):
- 21 job hubs + 8 opportunity hubs from `hub-config.js`

**Standalone Filter Pages** (76 pages, priority 0.7):
- 32 job filter pages + 15 opportunity filter pages + 11 organization filter pages + additional overrides

**Combo Filter URLs** (auto-generated from `filter-parser.js`):
- Job Category × 47 Kenyan counties (~2,000 URLs)
- Job Category × 11 countries (~480 URLs)
- Employment Type × 47 counties (~330 URLs)
- Experience Level × 47 counties (~370 URLs)
- Opportunity Type × 47 counties + 11 countries (~2,200 URLs)
- Organization Type × 47 counties (~520 URLs)
- **Total: ~5,900+ combo URLs**

**Dynamic Database Pages** (up to 1,400 URLs):
- Published jobs (500 latest)
- Published opportunities (500 latest)
- Published articles (200 latest)
- Verified companies (200 latest)

**Grand Total: ~6,400+ sitemap URLs**

### 6.4 robots.txt

Defined in `src/app/robots.js`:
- All crawlers: Allow `/`, disallow `/dashboard`, `/api`, auth pages
- Googlebot: Same but more permissive
- AI crawlers (GPTBot, ChatGPT-User, CCBot, anthropic-ai): Disallow `/` (blocked)
- Sitemap: `${SITE_URL}/sitemap.xml`

### 6.5 RSS Feed

XML feed at `/feed.xml` via `src/app/(website)/feed.xml/route.js`.

### 6.6 PWA Manifest

Defined in `src/app/manifest.js`:
- App name, short name, icons (192x192, 512x512)
- Shortcuts: Browse Jobs, Scholarships, CV Services
- Categories: jobs, education, business

### 6.7 SEO Architecture Decisions
- **Centralized `SITE_URL`**: Single source of truth from `site-config.js`, referenced by all JSON-LD generators, sitemap, meta tags, and canonical URLs
- **Title template**: `"%s | JobNet Kenya"` in root layout, individual pages override via `generateMeta()`
- **MetadataBase**: Set once in root layout from `site-config.url`
- **noIndex support**: Jobs, Opportunities, Articles, Companies all have `noIndex` boolean for SEO control
- **Canonical URLs**: Set on every page via `alternates.canonical`

---

## 7. Filter System & Enum Data

### 7.1 Master Data Source

All enum/lookup data is defined in `src/data/org_data.js`:

### 7.2 Organization Types (11 values)

| Enum Value | Display Label |
|---|---|
| `PRIVATE` | Private Company |
| `SMALL_BUSINESS` | Small Business / SME |
| `STARTUP` | Startup |
| `NGO` | NGO / Non-Profit |
| `INTERNATIONAL_ORG` | International Organization |
| `NATIONAL_GOV` | National Government |
| `COUNTY_GOV` | County Government |
| `STATE_CORPORATION` | State Corporation |
| `EDUCATION` | Education / University |
| `FOUNDATION` | Foundation |
| `RELIGIOUS_ORG` | Religious Organization |

### 7.3 Industries (35 values)

`AGRICULTURE`, `ARCHITECTURE_CONSTRUCTION`, `AUTOMOTIVE`, `AVIATION`, `BANKING`, `CHEMICAL`, `CONSTRUCTION`, `CONSULTING`, `CREATIVE_ARTS`, `DEFENCE_SECURITY`, `EDUCATION`, `ENERGY`, `ENGINEERING`, `ENTERTAINMENT`, `FINANCE`, `FITNESS_WELLNESS`, `FMCG`, `FOOD_BEVERAGE`, `GOVERNMENT`, `HEALTHCARE`, `HOSPITALITY`, `HUMAN_RESOURCES`, `ICT`, `INSURANCE`, `LEGAL`, `LOGISTICS`, `MANUFACTURING`, `MEDIA`, `MINING`, `NGO_DEVELOPMENT`, `PHARMACEUTICAL`, `REAL_ESTATE`, `RETAIL`, `TELECOMMUNICATIONS`, `TOURISM`, `TRANSPORT`

### 7.4 Locations (11 countries, 135+ regions)

**Kenya (47 counties)**: Nairobi, Mombasa, Kisumu, Nakuru, Uasin Gishu, Kiambu, Machakos, Meru, Kakamega, Nyandarua, Nyeri, Laikipia, Bungoma, Trans Nzoia, Kajiado, Embu, Murang'a, Kitui, Kericho, Kilifi, Homa Bay, Migori, Narok, Bomet, Tharaka Nithi, Siaya, Kirinyaga, Kisii, Nyamira, Vihiga, West Pokot, Nandi, Elgeyo Marakwet, Garissa, Lamu, Wajir, Mandera, Marsabit, Isiolo, Samburu, Tana River, Taita Taveta, Kwale, Busia, Turkana, Pokot

**Other countries**: Uganda (10), Tanzania (10), Rwanda (8), Ethiopia (9), Nigeria (10), South Africa (10), Ghana (9), US (10), UK (10), Canada (10)

### 7.5 Job Categories (44 parent categories, 600+ subcategories)

Hierarchical structure — each parent has multiple subcategories. Examples:

| Parent Category | Subcategories (examples) |
|---|---|
| `TECHNOLOGY` (18) | Software Development, Data Science, Cybersecurity, Cloud Computing, AI/ML, DevOps, Mobile Development, Web Development, Database Administration, IT Support, Systems Administration, Product Management, UI/UX Design, QA/Testing, Blockchain, IoT, Game Development, Tech Consulting |
| `FINANCE_ACCOUNTING` (12) | Accounting, Audit, Banking, Financial Analysis, Insurance, Investment, Tax, Microfinance, Forensic Accounting, Credit Management, Risk Management, Treasury |
| `ENGINEERING` (14) | Civil, Mechanical, Electrical, Chemical, Biomedical, Agricultural, Environmental, Petroleum, Mining, Aerospace, Marine, Structural, Geotechnical, Industrial |
| `HEALTHCARE` (12) | Nursing, Medical Doctor, Pharmacy, Lab Technology, Public Health, Dental, Clinical, Nutrition, Radiology, Physiotherapy, Health Administration, Mental Health |
| `EDUCATION` (10) | Teaching, Lecturing, Curriculum Development, Educational Admin, E-Learning, Special Needs, Early Childhood, Guidance Counseling, Research, Adult Education |
| `MARKETING_COMMUNICATIONS` (12) | Digital Marketing, Content Marketing, Social Media, SEO/SEM, Brand Management, PR, Copywriting, Event Marketing, Growth Hacking, Marketing Analytics, Email Marketing, Influencer Marketing |
| `GOVERNMENT_PUBLIC_SECTOR` (8) | National Government, County Government, Parastatals, Public Service Commission, Judiciary, Military, Police, Diplomatic Service |
| `NONPROFIT` (8) | NGO Management, Program Coordination, Monitoring & Evaluation, Fundraising, Community Development, Humanitarian, Research & Policy, Volunteer Coordination |
| ... (37 more categories) | |

### 7.6 Experience Levels (8 values)

`ENTRY_LEVEL`, `JUNIOR`, `MID_LEVEL`, `SENIOR`, `LEAD`, `MANAGER`, `DIRECTOR`, `EXECUTIVE`

### 7.7 Employment Types (6 values)

`FULL_TIME`, `PART_TIME`, `CONTRACT`, `TEMPORARY`, `INTERNSHIP`, `VOLUNTEER`

### 7.8 Opportunity Types (23 values)

`SCHOLARSHIP`, `GRANT`, `FELLOWSHIP`, `BURSARY`, `INTERNSHIP`, `APPRENTICESHIP`, `MENTORSHIP`, `BOOTCAMP`, `TRAINING`, `CERTIFICATION`, `CONFERENCE`, `COMPETITION`, `AWARD`, `VOLUNTEER`, `SPONSORSHIP`, `FUNDING`, `ACCELERATOR`, `INCUBATOR`, `RESEARCH`, `EXCHANGE`, `RESIDENCY`, `UNIVERSITY_ADMISSION`, `WORKSHOP`

### 7.9 Salary Periods (5 values)

`HOURLY`, `DAILY`, `WEEKLY`, `MONTHLY`, `ANNUALLY`

### 7.10 Currencies (13 values)

`KES`, `USD`, `EUR`, `GBP`, `UGX`, `TZS`, `RWF`, `ZAR`, `NGN`, `CAD`, `AUD`, `INR`, `CNY`

### 7.11 Job Status (6 values)

`DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `CLOSED`, `EXPIRED`, `ON_HOLD`

---

## 8. Catch-All Routes & Combo Filters

### 8.1 How It Works

The filter system uses Next.js catch-all routes `[...slug]` combined with a sophisticated URL parser in `src/lib/filter-parser.js`. URL segments are parsed from left to right, each matched against known filter types:

1. **Special filters**: `remote` → `{ isRemote: true }`
2. **Category**: `technology` → `{ category: "TECHNOLOGY" }`
3. **Employment type**: `full-time` → `{ employmentType: "FULL_TIME" }`
4. **Experience level**: `senior` → `{ experienceLevel: "SENIOR" }`
5. **Location**: `nairobi` → `{ county: "Nairobi", country: "Kenya" }`
6. **Country**: `uganda` → `{ country: "Uganda" }`

### 8.2 URL Pattern Examples

| URL | Interpretation |
|---|---|
| `/jobs/senior-accountant-safaricom` | **Job detail page** (single slug, no filter match) |
| `/jobs/technology` | **Single filter page** (standalone page at `/jobs/technology/page.jsx`) |
| `/jobs/technology/nairobi` | **Combo filter**: Technology + Nairobi |
| `/jobs/full-time/mombasa` | **Combo filter**: Full-time + Mombasa |
| `/jobs/entry-level/technology` | **Combo filter**: Entry Level + Technology |
| `/jobs/remote/technology` | **Combo filter**: Remote + Technology |
| `/jobs/senior/finance-accounting` | **Combo filter**: Senior + Finance |
| `/jobs/internship/kisumu` | **Combo filter**: Internship + Kisumu |
| `/opportunities/scholarships` | **Single filter page** |
| `/opportunities/scholarships/kenya` | **Combo filter**: Scholarships + Kenya |
| `/opportunities/grants/nairobi` | **Combo filter**: Grants + Nairobi |
| `/organizations/ngos` | **Single filter page** |
| `/organizations/ngos/nairobi` | **Combo filter**: NGOs + Nairobi |
| `/organizations/startups/kenya` | **Combo filter**: Startups + Kenya |

### 8.3 Dispatch Logic

For the catch-all `[...slug]` routes:

1. **1 segment**: Try to find a matching entity by slug (job detail, opportunity detail, company profile). If not found, return 404.
2. **2+ segments**: Parse as combo filter via `parseJobFilters()`, `parseOpportunityFilters()`, or `parseOrganizationFilters()`. If all segments are recognized, render `JobFilterView`/`OpportunityFilterView`/`OrganizationFilterView`. If any segment is unrecognized, return 404.

### 8.4 SEO for Combo Pages

Combo filter pages generate unique:
- **Title**: e.g., "Technology Jobs in Nairobi Kenya 2026 | JobReady Kenya"
- **Description**: e.g., "Browse technology jobs in Nairobi. Updated daily. Apply now on JobReady.co.ke"
- **JSON-LD**: `CollectionPage` + `ItemList` structured data
- **Canonical URL**: Based on the combo URL path
- **OpenGraph**: Full OG tags with combo-specific title/description

---

## 9. Authentication System

### 9.1 Architecture

**Strategy**: JWT (stateless) via NextAuth.js v4 — no database sessions.

**Providers**:
1. **Credentials** (email/password) — bcryptjs hashing
2. **Google OAuth** — offline access with refresh tokens

### 9.2 JWT Token Contents

The JWT embeds user data for client-side access:
```
id, name, email, phone, avatar, role, googleId,
emailVerified, phoneVerified, hasPassword, missingFields, issuedAt
```

### 9.3 JWT Auto-Refresh

Tokens refresh from the database when:
- `session.update()` is explicitly called
- Token is older than 5 minutes (`issuedAt` check)

### 9.4 Google OAuth Identity Resolution

Three cases in the `signIn` callback:

1. **Existing Google user** (matched by `googleId`): Login directly, upsert AuthAccount tokens
2. **Email exists but no googleId**: Create orphaned AuthAccount (userId: null), redirect to `/login?link=google&email=...` for password verification and account linking
3. **New user**: Create account with `googleId`, send welcome email, link any walk-in orders

### 9.5 One-Time Migration

On first import, `migrateExistingGoogleUsers()` populates `googleId` on existing users from the `AuthAccount` table. This is idempotent.

### 9.6 Walk-In Order Linking

When a Google user is created, `linkWalkInOrders()` matches existing orders by email/phone to the new user account.

### 9.7 Onboarding Gate

Middleware checks if authenticated users are missing a password (Google-only signups) and redirects them to `/onboarding` before accessing the dashboard.

---

## 10. Component Architecture

### 10.1 Shared Website Components (`src/app/(website)/_components/`)

| Component | Purpose | Key Features |
|---|---|---|
| `FilterSidebarWrapper` | Filter toggle + mobile drawer | Desktop show/hide button, mobile slide-in drawer with overlay |
| `JobFilterView` | All 35+ job filter sub-pages | Accepts `filterKey`, `filterValue`, `title`, queries DB |
| `OpportunityFilterView` | All 23 opportunity filter sub-pages | Same pattern as JobFilterView |
| `OrganizationFilterView` | All 11 organization filter sub-pages | Same pattern |
| `ShareStrip` | Social sharing bar | Tailored labels per page type (job, article, company) |
| `Header` | Main navigation | Desktop nav + mobile hamburger, search bar |
| `TopBar` | Top utility bar | Quick links (Internships, Govt Jobs, Remote, Scholarships, CV Writing) |
| `Footer` | Site footer | 3-column links, social media, legal links, newsletter |
| `HomeHero` | Homepage hero section | Stats, search CTA |
| `FeaturedJobs` | Featured jobs grid | Homepage display |
| `CategoryGrid` | Job category cards | Homepage hub links |
| `TrustedByBar` | Employer logo strip | Social proof |
| `TrendingNow` | Trending jobs sidebar | Based on viewCount |
| `GovVacancies` | Government jobs CTA | Homepage section |
| `UniCvBursaries` | Scholarships CTA | Homepage section |
| `CareerBlog` | Latest articles sidebar | Homepage section |
| `HomeSidebar` | Homepage sidebar | Combines trending, alerts, subscribe form |
| `JobList` | Reusable job listing | Card grid with pagination |
| `BookmarkButton` | Save/unsave job | Heart icon toggle |
| `RelatedJobsCard` | Similar jobs sidebar | On job detail pages |
| `DeadlineStrip` | Application deadline badge | Urgency indicator |
| `EntryInternLocation` | Quick filter badges | Entry-level, internship, location links |
| `CVServiceStrip` | CV writing CTA banner | On job/opportunity pages |
| `CVServicesCTA` | CV services callout | Inline promo component |
| `ServiceNudge` | Service recommendation | Context-aware suggestions |
| `CompanyAboutCard` | Company info card | On job detail pages |
| `ContactInfoCard` | Contact information | On company profile pages |
| `WhatsAppFloat` | Floating WhatsApp button | Site-wide CTA |
| `SubscribeForm` | Newsletter signup | Email subscription |
| `AdPlaceholder` | Ad space placeholder | For future AdSense units |
| `LegalLayout` | Legal page layout | With table of contents |
| `CookieConsent` | Cookie banner | GDPR/DPA compliance |

### 10.2 shadcn/ui Components (`src/components/ui/`)

50+ pre-built accessible components using Radix UI primitives: Accordion, AlertDialog, Badge, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, Dialog, Drawer, DropdownMenu, Form, HoverCard, Input, Label, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toast, Toggle, ToggleGroup, Tooltip

---

## 11. API Routes

### 11.1 Authentication APIs (`/api/auth/`)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler |
| `/api/auth/register` | POST | Email/password registration |
| `/api/auth/forgot-password` | POST | Send password reset email |
| `/api/auth/reset-password` | POST | Reset password with token |
| `/api/auth/set-password` | POST | Set password (onboarding) |
| `/api/auth/send-email-verification` | POST | Send email verification link |
| `/api/auth/verify-email-link` | GET | Verify email via link token |
| `/api/auth/send-otp` | POST | Send phone OTP |
| `/api/auth/verify-otp` | POST | Verify phone OTP |
| `/api/auth/phone-session` | POST | Create phone auth session |
| `/api/auth/complete-profile` | POST | Complete onboarding profile |
| `/api/auth/link-google` | POST | Link Google to existing email account |

### 11.2 Content APIs

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/jobs` | GET/POST | List/create jobs |
| `/api/jobs/[slug]` | GET/PUT/DELETE | Get/update/delete job |
| `/api/jobs/[slug]/apply` | POST | Apply to a job |
| `/api/opportunities` | GET/POST | List/create opportunities |
| `/api/opportunities/[slug]` | GET/PUT/DELETE | Get/update/delete opportunity |
| `/api/organizations` | GET | List organizations |
| `/api/organizations/[slug]` | GET/PUT/DELETE | Get/update/delete organization |
| `/api/companies` | GET | List companies |
| `/api/companies/[slug]` | GET | Get company by slug |
| `/api/company/logo` | GET | Serve company logo |
| `/api/articles` | GET | List articles |
| `/api/articles/[slug]` | GET | Get article by slug |
| `/api/career-advice` | GET | List career advice articles |
| `/api/search` | GET | Global search (jobs, opportunities, companies) |

### 11.3 User APIs (`/api/user/`)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/user/profile` | GET/PUT | Get/update user profile |
| `/api/user/account` | GET/PUT | Account settings |
| `/api/user/avatar` | POST | Upload avatar |
| `/api/user/change-password` | POST | Change password |
| `/api/user/send-update-email` | POST | Send email update verification |
| `/api/user/send-verify-email` | POST | Resend email verification |
| `/api/user/send-verify-phone` | POST | Resend phone verification |
| `/api/user/verify-email` | POST | Verify email |
| `/api/user/verify-phone` | POST | Verify phone |

### 11.4 Engagement APIs

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/saved-jobs` | GET/POST/DELETE | Manage saved jobs |
| `/api/applications` | GET/POST | List/create applications |
| `/api/applications/[id]` | GET | Get application details |
| `/api/alerts` | GET/POST/DELETE | Manage job alerts |
| `/api/notifications` | GET/PUT | Get/update notifications |
| `/api/newsletter` | POST | Subscribe to newsletter |

### 11.5 Payment APIs (`/api/payments/`)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/payments/stk-push` | POST | Initiate M-Pesa STK Push |
| `/api/payments/stk-query` | POST | Query payment status |
| `/api/payments/mpesa/callback` | POST | M-Pesa callback endpoint |
| `/api/payments/[id]` | GET | Get payment details |
| `/api/payments/order/[orderId]` | GET | Get payments for order |

### 11.6 Order APIs

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/orders` | POST | Create order |
| `/api/orders/my` | GET | Get current user's orders |
| `/api/orders/[id]` | GET | Get order details |
| `/api/services/tiers` | GET | Get service pricing tiers |

### 11.7 Other APIs

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/contact` | POST | Submit contact form |
| `/api/dashboard/stats` | GET | Dashboard statistics |
| `/api/company/logo` | GET | Serve company logos |

---

## 12. M-Pesa Payment Integration

### 12.1 Daraja API Integration

M-Pesa STK Push integration via `src/lib/mpesa.js`:

**Flow**:
1. User places an order (CV service)
2. Frontend calls `/api/payments/stk-push` with order details
3. Backend generates Daraja STK Push request to Safaricom
4. User receives M-Pesa prompt on phone (PIN entry)
5. User pays → Safaricom sends callback to `/api/payments/mpesa/callback`
6. Callback updates Payment record, Order status, and triggers notification

**Payment Record** (in `payments` table):
- `checkoutRequestId` — Daraja checkout request ID (unique)
- `mpesaReceiptNumber` — Actual M-Pesa receipt (e.g., "SHK7Y4XB2Z")
- `phoneNumber` — User's M-Pesa phone number
- `amount` — Amount paid in KES
- `status` — PENDING → SUCCESS / FAILED / CANCELLED / TIMEOUT
- `mpesaCallbackData` — Raw Safaricom callback JSON (audit trail)

### 12.2 Partial Payment Support

Orders support partial payments:
- `totalAmount` — Total order value
- `paidAmount` — Amount paid so far
- `balanceDue` — Remaining (totalAmount - paidAmount)
- `paymentStatus` — UNPAID → PARTIALLY_PAID → PAID → REFUNDED

### 12.3 Walk-In Orders

Users can place orders without an account (via WhatsApp). These have `userId: null` but require `email` and `phone`. When they later register, walk-in orders are automatically linked via `linkWalkInOrders()`.

---

## 13. UX Features

### 13.1 Filter Sidebar Toggle

**Component**: `FilterSidebarWrapper.jsx`

- **Desktop**: "Show/Hide Filters" toggle button above the sidebar
- **Mobile**: Slide-in drawer from left with dark overlay backdrop
- **Applied to**: All job listing pages, all 35+ job filter sub-pages
- **Not applied to**: Search page (has its own inline toggle), Organizations (inline filter bar)

### 13.2 No Sticky Components

All sidebar components scroll naturally with the page — no `sticky`, `fixed`, or `position: sticky` CSS classes on any sidebar element. This was applied to:
- Job filters sidebar
- Company profile sidebar
- Career advice article sidebar
- Legal pages table of contents

### 13.3 Independent Sidebar Scrolling

Each sidebar area scrolls independently within its own container, rather than scrolling with the main content.

### 13.4 Social Sharing

**Component**: `ShareStrip.jsx`

Tailored sharing labels per content type:
- **Jobs**: "Apply Now →" / "Share this job"
- **Articles**: "Must-read career advice!"
- **Companies**: "Check out this employer"

Supports: WhatsApp, Twitter/X, Facebook, LinkedIn, Email, Copy Link

### 13.5 WhatsApp Integration

- **Floating button**: Site-wide WhatsApp CTA (bottom-right)
- **Context-aware messages**: Different pre-filled messages for general inquiry, CV service, payment help, free CV review, employer inquiry
- **Analytics**: WhatsApp clicks tracked in `whatsapp_clicks` table with page context

### 13.6 Cookie Consent

GDPR/DPA-compliant cookie banner with accept/reject options.

### 13.7 Responsive Design

- Mobile-first approach with Tailwind breakpoints
- Mobile navigation drawer
- Responsive filter panels (sidebar on desktop, drawer on mobile)
- Touch-friendly UI elements

---

## 14. Configuration & Environment

### 14.1 Centralized Site Config (`src/config/site-config.js`)

All brand/domain settings are centralized and overridable via environment variables:

| Config Key | Env Variable | Default |
|---|---|---|
| `domain` | `NEXT_PUBLIC_SITE_DOMAIN` | `jobnet.co.ke` |
| `url` | `NEXT_PUBLIC_SITE_URL` | `https://jobnet.co.ke` |
| `brandName` | `NEXT_PUBLIC_BRAND_NAME` | `JobReady.co.ke` |
| `companyLegalName` | `NEXT_PUBLIC_COMPANY_NAME` | `JobReady Kenya` |
| WhatsApp number | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `254786090635` |
| Social links | `NEXT_PUBLIC_SOCIAL_*` | JobReady social URLs |
| AdSense ID | `NEXT_PUBLIC_ADSENSE_ID` | `ca-pub-8031704055036556` |
| ODPC reg. | `NEXT_PUBLIC_ODPC_REG` | `ODPC/KEN/DPI/2026/XXXX` |

### 14.2 Environment Variables

**Required for production**:
```
DATABASE_URL              # MySQL connection string
NEXTAUTH_SECRET           # JWT signing secret
GOOGLE_CLIENT_ID          # Google OAuth client ID
GOOGLE_CLIENT_SECRET      # Google OAuth client secret
NEXT_PUBLIC_SITE_DOMAIN   # Domain name
NEXT_PUBLIC_SITE_URL      # Full site URL
NEXT_PUBLIC_BRAND_NAME    # Display brand name
```

**Optional**:
```
MPESA_CALLBACK_URL        # M-Pesa callback URL
MPESA_CONSUMER_KEY        # Daraja consumer key
MPESA_CONSUMER_SECRET     # Daraja consumer secret
MPESA_PASSKEY             # Daraja passkey
MPESA_SHORTCODE           # Business shortcode
SMTP_HOST                 # Email SMTP host
SMTP_PORT                 # Email SMTP port
SMTP_USER                 # Email SMTP user
SMTP_PASS                 # Email SMTP password
NEXT_PUBLIC_ADSENSE_ID    # Google AdSense
NEXT_PUBLIC_WHATSAPP_NUMBER  # WhatsApp number
```

### 14.3 Navigation Config

Main nav, top bar links, mobile nav extras, and footer columns are all defined in `site-config.js` — no hardcoding in components.

---

## 15. Deployment

### 15.1 Hosting Stack

- **Platform**: Vercel (serverless)
- **Runtime**: Bun (Node.js compatible)
- **CI/CD**: Push to `main` branch → automatic deploy
- **Domain**: `www.jobnet.co.ke` (via CNAME to Vercel)
- **Future domain**: `www.jobready.co.ke`

### 15.2 Build Process

```bash
# Build
prisma generate && next build && (cp -r .next/static .next/standalone/.next/) && (cp -r public .next/standalone/)

# Start (production)
NODE_ENV=production bun .next/standalone/server.js
```

### 15.3 Next.js Config Highlights

- **Security headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Image optimization**: AVIF + WebP formats, remote patterns for jobnet.co.ke, jobready.co.ke, Google, Unsplash
- **Compression**: Enabled (`compress: true`)
- **TypeScript**: Build errors ignored (`ignoreBuildErrors: true`) — JSX files are primary
- **Powered-by header**: Disabled

### 15.4 GitHub

- **Repository**: `https://github.com/AmungaLucas/www.jobready.co.ke_website.git`
- **Branch**: `main`
- **Current HEAD**: `897c4af`

---

## 16. Seed Data

### 16.1 Seed Scripts

Located in `prisma/`:

| Script | Purpose |
|---|---|
| `seed.js` | Master seed (runs all sub-scripts) |
| `seed-7c-jobs.js` | Job listings with companies |
| `seed-7d-opportunities.js` | Opportunities (scholarships, grants, etc.) |
| `seed-7e-articles.js` | Blog articles with authors and categories |
| `seed-7f-users.js` | Demo users |
| `seed-7g-services.js` | Service tiers and pricing |

### 16.2 Running Seeds

```bash
npx prisma db seed       # Runs seed.js (master)
node prisma/seed-7c-jobs.js   # Individual seed
```

---

## 17. Legal & Compliance

### 17.1 Legal Pages

Static pages at:
- `/privacy` — Privacy Policy
- `/terms` — Terms of Service
- `/cookies` — Cookie Policy
- `/disclaimer` — Disclaimer
- `/refunds` — Refund Policy
- `/data-protection` — DPA Notice (Kenya Data Protection Act 2019)

### 17.2 DPA Compliance

- **ODPC Registration**: Referenced in `site-config.js` (registration number placeholder)
- **Data Request Model**: Supports ACCESS, CORRECTION, DELETION, OBJECTION, PORTABILITY
- **DPA Officer**: Email at `privacy@jobready.co.ke`

### 17.3 Cookie Consent

GDPR/DPA-compliant cookie banner with accept/reject functionality.

### 17.4 AI Crawler Blocking

robots.txt blocks GPTBot, ChatGPT-User, CCBot, and anthropic-ai from crawling any pages.

---

## 18. Key Development Rules

### ⚠️ CRITICAL: Never Restore Old File Versions

**NEVER** use `git checkout <old-commit> -- <path>` to restore old file versions. This was the cause of a critical site breakage in a previous session (commit `95cbf4a`), which required a force-reset to `f680fc3` and a push to Vercel with an empty commit to trigger redeployment.

**Rule**: Always edit current files in place. Use `Edit` tool, not `Write` for existing files.

### Other Rules

1. **Always use `site-config.js`** for domain URLs, brand names, and WhatsApp numbers — never hardcode
2. **Use `generateMeta()`** for all page metadata — never hardcode meta tags
3. **Use `filter-parser.js`** for all URL-to-filter conversions
4. **Use `org_data.js`** for all enum values — never define inline
5. **Test locally** before committing — verify the site works at the `/` route
6. **Commits should be small and atomic** — one logical change per commit

---

## 19. Git Commit History

| Commit | Description |
|---|---|
| `897c4af` | **fix: UX** — remove sticky sidebars, add filter toggle + mobile drawer |
| `5e011d2` | chore: trigger Vercel redeploy |
| `f680fc3` | **fix: SEO polish** — JSON-LD URL bug, sitemap completeness, internal linking, brand consistency |
| `0343777` | **feat: centralize site config** — emails, brand, WhatsApp, legal pages via env vars |
| `c2c9ae5` | refactor: centralize SITE_URL — single source of truth for domain |
| `5fdaa7c` | **feat: catch-all filter combo routes** + sitemap fix |
| `d8689bc` | fix: critical sitemap URL bugs + opportunity query |
| `0c5a233` | **feat: enhanced ShareStrip** with tailored labels + Facebook/LinkedIn/Email sharing |
| `1f08e8a` | Fix .get() crash on all 23 opportunity sub-pages + fix UniCvBursaries link |
| `fdd4926` | Remove homepage-style hero from jobs page, replace with compact listing header |
| `2e793db` | Redesign /jobs page with modern layout + update JobFilterView to match |
| `e43fda8` | Render HTML descriptions with dangerouslySetInnerHTML on detail pages |
| `4458c57` | Make search and filters fully functional across the site |
| `f481665` | Add 3 missing job filter pages: specialised-services, temporary, internship |
| `bc26ff7` | **feat: Add 64 filter pages** across jobs, opportunities & organizations |

---

## 20. Pending Enhancements

These features have been discussed but not yet implemented:

| Feature | Description | Priority |
|---|---|---|
| **dangerouslySetInnerHTML** for descriptions | Job and opportunity descriptions rendered as raw HTML | Medium |
| **Sitemap enhancement** | Add 76 static filter pages + organization pages to sitemap | Medium |
| **Location pages** | Dedicated `/jobs/in-nairobi`, `/jobs/in-mombasa` pages | High |
| **Cross-filter pages** | Category × Location pages (e.g., `/jobs/technology/nairobi`) | High |
| **JSON-LD for Google Jobs** | Structured data on job detail pages | High |
| **Internal linking** | Related jobs, related articles, cross-linking between sections | Medium |
| **Admin dashboard** | Employer/company posting dashboard | Future |
| **Email job alerts cron** | Automated daily job alert emails | Future |
| **Denormalized counter sync** | Cron job for `jobCount`, `viewCount`, `applicantCount` | Medium |
| **Image upload** | File upload for company logos, job images, article images | Medium |

---

## Appendix A: Database Connection

```
Host: da27.host-ww.net:3306
Database: jobready_db
User: jobready_db_admin
Password: Amush@100%
```

Connection string: `mysql://jobready_db_admin:Amush@100%@da27.host-ww.net:3306/jobready_db`

## Appendix B: Useful Commands

```bash
# Development
bun dev                    # Start dev server on port 3000

# Database
bun prisma db push         # Push schema changes
bun prisma generate        # Generate Prisma client
bun prisma migrate dev     # Create migration
bun prisma studio          # Open database GUI

# Build & Deploy
bun run build              # Production build
bun run start              # Start production server
git push origin main       # Deploy to Vercel

# Code Quality
bun run lint               # Run ESLint
```

## Appendix C: Key File Quick Reference

| File | Purpose |
|---|---|
| `src/config/site-config.js` | ★ All brand/domain/WhatsApp/email settings |
| `src/config/hub-config.js` | ★ 26 hub pages with filters & SEO titles |
| `src/data/org_data.js` | ★ All enum data (categories, locations, industries) |
| `src/lib/seo.js` | ★ 12 JSON-LD generators + generateMeta() |
| `src/lib/filter-parser.js` | ★ URL slug → filter mapping + sitemap generators |
| `src/lib/auth.js` | NextAuth config (JWT + Google OAuth) |
| `src/middleware.js` | Auth middleware (route protection) |
| `prisma/schema.prisma` | Full database schema (28 models) |
| `next.config.ts` | Security headers, image optimization |
| `src/app/robots.js` | robots.txt configuration |
| `src/app/manifest.js` | PWA manifest |
| `src/app/(website)/sitemap.xml/route.js` | Dynamic sitemap generator |
| `src/app/(website)/_components/FilterSidebarWrapper.jsx` | ★ Filter toggle + mobile drawer |
| `src/app/(website)/_components/ShareStrip.jsx` | ★ Social sharing bar |
| `src/app/(website)/_components/JobFilterView.jsx` | ★ All 35+ job filter sub-pages |
