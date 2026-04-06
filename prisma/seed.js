// ============================================================
// JobReady.co.ke — Clean Seed Data Script
// ============================================================
// Run: npx prisma db seed
// Or: node prisma/seed.js
//
// Creates:
//   - 3 Companies
//   - 5 Jobs
//   - 5 Opportunities
// ============================================================

const { config } = require("dotenv");
config({ override: true });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ============================================================
// COMPANIES (3)
// ============================================================

const COMPANIES = [
  {
    name: "Safaricom PLC",
    slug: "safaricom-plc",
    tagline: "Better Everyday for Everyone",
    description: "Safaricom is Kenya's leading telecommunications company, serving over 40 million customers with mobile voice, data, M-Pesa financial services, and enterprise solutions. Listed on the Nairobi Securities Exchange, Safaricom is one of East Africa's most profitable companies, driving innovation through M-Pesa, 5G networks, and digital transformation initiatives. The company employs over 5,000 people directly and supports thousands more through its ecosystem of partners and agents nationwide.",
    industry: "Telecommunications",
    country: "Kenya",
    city: "Nairobi",
    town: "Westlands",
    website: "https://www.safaricom.co.ke",
    socialLinks: [
      { platform: "LINKEDIN", url: "https://linkedin.com/company/safaricom" },
      { platform: "TWITTER", url: "https://twitter.com/Safaricom_Care" },
      { platform: "FACEBOOK", url: "https://facebook.com/Safaricom" },
    ],
    contactEmail: "careers@safaricom.co.ke",
    isVerified: true,
    isFeatured: true,
    logoColor: "#00a254,#00c853",
  },
  {
    name: "Equity Bank Kenya",
    slug: "equity-bank-kenya",
    tagline: "Equity for Everyone",
    description: "Equity Bank Kenya is one of the country's largest commercial banks, with over 190 branches serving millions of customers across all 47 counties. The bank offers retail banking, corporate banking, treasury services, and insurance through its Equity Group Holdings subsidiary. Known for its transformative role in financial inclusion, Equity has pioneered mobile banking, agency banking, and digital lending solutions that have brought millions of previously unbanked Kenyans into the formal financial system.",
    industry: "Banking & Finance",
    country: "Kenya",
    city: "Nairobi",
    town: "Upper Hill",
    website: "https://equitybank.co.ke",
    socialLinks: [
      { platform: "LINKEDIN", url: "https://linkedin.com/company/equity-bank-kenya" },
      { platform: "TWITTER", url: "https://twitter.com/EquityBankKE" },
    ],
    contactEmail: "careers@equitybank.co.ke",
    isVerified: true,
    isFeatured: true,
    logoColor: "#f59e0b,#fbbf24",
  },
  {
    name: "KPMG East Africa",
    slug: "kpmg-east-africa",
    tagline: "Cutting Through Complexity",
    description: "KPMG East Africa is one of the Big Four professional services firms operating in Kenya, providing audit, tax, and advisory services to multinational corporations, government agencies, and growing businesses. The firm is known for its rigorous audit standards, innovative tax advisory, and management consulting practices. KPMG East Africa serves clients across multiple sectors including financial services, technology, healthcare, and government, making it a top employer for accounting and finance professionals.",
    industry: "Professional Services",
    country: "Kenya",
    city: "Nairobi",
    town: "Upper Hill",
    website: "https://kpmg.co.ke",
    socialLinks: [
      { platform: "LINKEDIN", url: "https://linkedin.com/company/kpmg" },
      { platform: "TWITTER", url: "https://twitter.com/KPMG_EA" },
    ],
    contactEmail: "recruitment@kpmg.co.ke",
    isVerified: true,
    isFeatured: false,
    logoColor: "#00338d,#0044cc",
  },
];

// ============================================================
// JOBS (5)
// ============================================================

function makeJobSlug(title, companySlug) {
  const t = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
  return `${t}-at-${companySlug}`;
}

function jobDescription(about, requirements, responsibilities, highlights) {
  return `
<h3>About the Role</h3>
<p>${about}</p>

<h3>Key Responsibilities</h3>
<ul>${responsibilities.map((r) => `<li>${r}</li>`).join("\n")}</ul>

<h3>Requirements</h3>
<ul>${requirements.map((r) => `<li>${r}</li>`).join("\n")}</ul>

<h3>What We Offer</h3>
<ul>${highlights.map((h) => `<li>${h}</li>`).join("\n")}</ul>
`.trim();
}

const JOBS = [
  {
    title: "Senior Full Stack Developer",
    companySlug: "safaricom-plc",
    location: "Westlands, Nairobi",
    city: "Nairobi",
    town: "Westlands",
    country: "Kenya",
    category: "TECHNOLOGY",
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR",
    salaryMin: 180000,
    salaryMax: 280000,
    salaryPeriod: "MONTHLY",
    showSalary: true,
    isFeatured: true,
    positions: 2,
    deadlineDays: 21,
    about:
      "Lead the development of customer-facing web and mobile applications serving over 40 million Safaricom customers. You will architect scalable microservices and mentor a team of 6 developers working on M-Pesa integrations, USSD platforms, and the MySafaricom App.",
    requirements: [
      "Bachelor's degree in Computer Science or equivalent",
      "5+ years experience with React, Node.js, and cloud services (AWS/Azure)",
      "Experience with microservices architecture and RESTful API design",
      "Strong understanding of mobile app development (React Native or Flutter)",
      "Knowledge of payment systems and financial technology",
    ],
    responsibilities: [
      "Architect and develop scalable web and mobile applications",
      "Lead code reviews and maintain high code quality standards",
      "Collaborate with product managers and UX designers",
      "Mentor junior developers and conduct technical interviews",
      "Participate in on-call rotation for production systems",
    ],
    highlights: [
      "Health insurance for self and family",
      "Performance-based annual bonus",
      "Flexible hybrid work arrangement",
      "Professional development budget (KSh 200,000/year)",
      "Employee stock purchase plan",
    ],
    tags: ["React", "Node.js", "AWS", "Microservices", "Full Stack"],
  },
  {
    title: "Senior Financial Analyst",
    companySlug: "equity-bank-kenya",
    location: "Upper Hill, Nairobi",
    city: "Nairobi",
    town: "Upper Hill",
    country: "Kenya",
    category: "FINANCE_ACCOUNTING",
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR",
    salaryMin: 150000,
    salaryMax: 220000,
    salaryPeriod: "MONTHLY",
    showSalary: true,
    isFeatured: true,
    positions: 1,
    deadlineDays: 21,
    about:
      "Equity Bank is seeking a Senior Financial Analyst to join its Corporate Finance team. You will lead financial modeling, prepare board-level reports, and provide strategic recommendations on lending, investment, and capital allocation decisions.",
    requirements: [
      "CPA-K or ACCA qualification",
      "Bachelor's degree in Finance, Accounting, or Economics",
      "5+ years in financial analysis or corporate finance",
      "Advanced Excel and financial modeling skills",
      "Experience with ERP systems (SAP, Oracle, or Core Banking)",
    ],
    responsibilities: [
      "Prepare financial models for investment decisions",
      "Analyze financial statements and performance metrics",
      "Develop forecasts and budgets for business units",
      "Present financial analysis to senior management",
      "Support audit and regulatory reporting",
    ],
    highlights: [
      "Performance-based annual bonus",
      "Career progression to management roles",
      "Comprehensive health insurance",
      "Education reimbursement for MBA/CFA",
      "Staff banking benefits with preferential rates",
    ],
    tags: ["Financial Analysis", "CPA-K", "Modeling", "Budgeting"],
  },
  {
    title: "Audit Associate",
    companySlug: "kpmg-east-africa",
    location: "Upper Hill, Nairobi",
    city: "Nairobi",
    town: "Upper Hill",
    country: "Kenya",
    category: "FINANCE_ACCOUNTING",
    jobType: "FULL_TIME",
    experienceLevel: "ENTRY",
    salaryMin: 70000,
    salaryMax: 100000,
    salaryPeriod: "MONTHLY",
    showSalary: true,
    positions: 5,
    deadlineDays: 14,
    about:
      "KPMG East Africa is hiring Audit Associates to join its growing audit practice. You will work on engagements for listed companies, multinational corporations, and government entities, gaining exposure to diverse industries and complex audit procedures.",
    requirements: [
      "Bachelor's degree in Accounting, Finance, or related field",
      "CPA-K Section 4 completed or in progress",
      "Strong analytical and problem-solving skills",
      "Excellent written and verbal communication",
      "Proficiency in Microsoft Office suite",
    ],
    responsibilities: [
      "Execute audit procedures for assigned clients",
      "Prepare working papers and audit documentation",
      "Assist in planning and risk assessment",
      "Communicate findings to audit managers and partners",
      "Participate in fieldwork across Kenya",
    ],
    highlights: [
      "Big Four firm experience",
      "Structured career progression",
      "CPA exam support and study leave",
      "Exposure to diverse industries",
      "International secondment opportunities",
    ],
    tags: ["Audit", "CPA-K", "Big Four", "Entry Level"],
  },
  {
    title: "Backend Engineer — Payments Platform",
    companySlug: "safaricom-plc",
    location: "Westlands, Nairobi",
    city: "Nairobi",
    town: "Westlands",
    country: "Kenya",
    category: "TECHNOLOGY",
    jobType: "FULL_TIME",
    experienceLevel: "MID",
    salaryMin: 120000,
    salaryMax: 180000,
    salaryPeriod: "MONTHLY",
    showSalary: true,
    isRemote: true,
    positions: 3,
    deadlineDays: 14,
    about:
      "Join the M-Pesa engineering team to build and optimize backend systems that process millions of daily transactions. You'll work with Java, Kafka, and PostgreSQL to ensure the reliability and scalability of Africa's largest mobile money platform.",
    requirements: [
      "3+ years backend development experience",
      "Proficiency in Java or Go",
      "Experience with distributed systems and message queues (Kafka, RabbitMQ)",
      "Understanding of database design and optimization",
      "Familiarity with CI/CD pipelines and containerization (Docker/K8s)",
    ],
    responsibilities: [
      "Design and implement payment processing microservices",
      "Optimize database queries for high-throughput transaction processing",
      "Write unit and integration tests",
      "Monitor and troubleshoot production issues",
      "Document APIs and system architecture",
    ],
    highlights: [
      "Competitive salary with annual increments",
      "M-Pesa staff benefits",
      "Health and dental insurance",
      "Paid annual leave (24 days)",
      "Hybrid/Remote flexibility",
    ],
    tags: ["Java", "Kafka", "PostgreSQL", "Payments", "Microservices"],
  },
  {
    title: "Credit Risk Manager",
    companySlug: "equity-bank-kenya",
    location: "Upper Hill, Nairobi",
    city: "Nairobi",
    town: "Upper Hill",
    country: "Kenya",
    category: "FINANCE_ACCOUNTING",
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR",
    salaryMin: 180000,
    salaryMax: 250000,
    salaryPeriod: "MONTHLY",
    showSalary: true,
    isFeatured: true,
    positions: 1,
    deadlineDays: 28,
    about:
      "Equity Bank is looking for an experienced Credit Risk Manager to oversee credit risk assessment across its East African operations. You will develop credit policies, manage the credit scoring model, and ensure regulatory compliance with CBK guidelines.",
    requirements: [
      "Master's degree in Finance, Risk Management, or related field",
      "7+ years in credit risk management within banking",
      "Strong knowledge of CBK prudential guidelines",
      "Experience with credit scoring models and analytics",
      "Professional certification (FRM or CFA preferred)",
    ],
    responsibilities: [
      "Develop and maintain credit risk policies",
      "Oversee credit scoring and rating models",
      "Review and approve credit facilities above threshold",
      "Prepare credit risk reports for the Board",
      "Ensure compliance with regulatory requirements",
    ],
    highlights: [
      "Regional role with East African exposure",
      "Executive-level compensation",
      "Car allowance and fuel card",
      "Pension and life insurance",
      "Annual performance bonus",
    ],
    tags: ["Credit Risk", "FRM", "Banking", "CBK", "Analytics"],
  },
];

// ============================================================
// OPPORTUNITIES (5)
// ============================================================

function oppDescription(about, eligibility, benefits, howToApply) {
  return `
<h3>About This Opportunity</h3>
<p>${about}</p>

<h3>Eligibility</h3>
<ul>${eligibility.map((e) => `<li>${e}</li>`).join("\n")}</ul>

<h3>Benefits</h3>
<ul>${benefits.map((b) => `<li>${b}</li>`).join("\n")}</ul>

<h3>How to Apply</h3>
<p>${howToApply}</p>
`.trim();
}

function oppSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+$/, "")
    .substring(0, 100);
}

const OPPORTUNITIES = [
  {
    title: "MasterCard Foundation Scholars Program 2026 — University of Nairobi",
    opportunityType: "SCHOLARSHIP",
    category: "EDUCATION",
    companySlug: null,
    country: "Kenya",
    city: "Nairobi",
    isOnline: false,
    deadlineDays: 30,
    isFeatured: true,
    targetAudience: ["STUDENTS", "GRADUATES"],
    fieldOfInterest: ["EDUCATION", "GENERAL"],
    about:
      "The MasterCard Foundation Scholars Program at the University of Nairobi provides comprehensive scholarships to academically talented but economically disadvantaged young Africans. The program covers full tuition, accommodation, living expenses, mentoring, leadership development, and career support throughout the duration of undergraduate studies at the University of Nairobi. Since its inception, the program has supported over 1,000 scholars across Africa, with a focus on developing the next generation of ethical and transformative leaders.",
    eligibility: [
      "Kenyan citizen aged 18-25",
      "Completed KCSE with a mean grade of A- or above",
      "Demonstrated financial need",
      "Strong academic record and leadership potential",
      "Commitment to giving back to the community",
    ],
    benefits: [
      "Full tuition coverage for the entire undergraduate program",
      "Accommodation and meals allowance",
      "Books and learning materials stipend",
      "Laptop and internet allowance",
      "Leadership development and mentoring program",
    ],
    howToApply:
      "Applications are submitted online through the MasterCard Foundation Scholars Program portal at the University of Nairobi. You will need to upload academic transcripts, a personal statement, and financial documentation. Shortlisted candidates will be invited for an interview.",
    tags: ["Scholarship", "Undergraduate", "Fully Funded", "MasterCard"],
  },
  {
    title: "Chevening Scholarship 2026/2027 — Fully Funded UK Masters",
    opportunityType: "SCHOLARSHIP",
    category: "EDUCATION",
    companySlug: null,
    country: null,
    city: null,
    isOnline: false,
    deadlineDays: 45,
    isFeatured: true,
    targetAudience: ["PROFESSIONALS", "GRADUATES"],
    fieldOfInterest: ["EDUCATION", "GENERAL"],
    about:
      "Chevening Scholarships are the UK government's global scholarship program, funded by the Foreign, Commonwealth & Development Office and partner organizations. The scholarships enable outstanding emerging leaders from all over the world to pursue a one-year master's degree at any UK university. Over 1,500 scholarships are awarded globally each year, providing a unique opportunity for Kenyan professionals to develop professionally and academically.",
    eligibility: [
      "Kenyan citizen",
      "Completed an undergraduate degree",
      "At least 2 years of work experience",
      "Not previously studied in the UK at degree level",
      "Demonstrate leadership potential and a clear plan for contributing to Kenya's development",
    ],
    benefits: [
      "Full tuition fees for a one-year master's program",
      "Monthly living stipend",
      "Travel to and from the UK",
      "Arrival and departure allowances",
      "Access to Chevening's global alumni network",
    ],
    howToApply:
      "Apply online through the Chevening application portal. You will need to select three different UK master's courses and provide two references, a personal statement, and a leadership essay. The application window typically opens in August and closes in November each year.",
    tags: ["Scholarship", "Masters", "UK", "Chevening", "Fully Funded"],
  },
  {
    title: "Safaricom Hackathon 2026 — Reimagining M-Pesa",
    opportunityType: "COMPETITION",
    category: "TECHNOLOGY",
    companySlug: "safaricom-plc",
    country: "Kenya",
    city: "Nairobi",
    isOnline: false,
    deadlineDays: 30,
    isFeatured: true,
    targetAudience: ["DEVELOPERS", "PROFESSIONALS"],
    fieldOfInterest: ["TECHNOLOGY", "ENGINEERING"],
    about:
      "Safaricom's annual Hackathon challenges Kenyan developers to build innovative solutions around M-Pesa's platform. This year's theme, 'Reimagining M-Pesa,' invites teams to create new use cases, integrations, and features that expand M-Pesa's impact on financial inclusion and digital commerce. Teams of 3-5 developers compete for cash prizes, mentorship, and potential integration into Safaricom's product roadmap.",
    eligibility: [
      "Team of 3-5 members",
      "At least 18 years old",
      "Kenyan citizen or resident",
      "Developer skills in mobile, web, or API integration",
      "Original idea not previously entered in other competitions",
    ],
    benefits: [
      "Grand prize: KSh 2,000,000",
      "Second prize: KSh 1,000,000",
      "Third prize: KSh 500,000",
      "Mentorship from Safaricom engineering team",
      "Potential product integration opportunity",
    ],
    howToApply:
      "Register your team online through the Safaricom Hackathon portal. Submit a brief description of your idea, team composition, and technology stack. Selected teams will be invited for a 48-hour in-person hackathon event at Safaricom's headquarters in Westlands, Nairobi.",
    tags: ["Hackathon", "M-Pesa", "Safaricom", "Competition", "Developers"],
  },
  {
    title: "KCB Foundation 2jiajiri Enterprise Grant 2026",
    opportunityType: "GRANT",
    category: "BUSINESS",
    companySlug: null,
    country: "Kenya",
    city: null,
    isOnline: false,
    deadlineDays: 30,
    isFeatured: false,
    targetAudience: ["ENTREPRENEURS", "YOUTH"],
    fieldOfInterest: ["BUSINESS", "AGRICULTURE"],
    about:
      "The KCB Foundation 2jiajiri Program provides business grants and training to young entrepreneurs in Kenya aged 18-35. The program supports youth in agribusiness, manufacturing, construction, services, and the creative economy with seed capital, business mentorship, and market linkages. Since its launch, 2jiajiri has supported over 30,000 young entrepreneurs and created more than 50,000 direct and indirect jobs across Kenya.",
    eligibility: [
      "Kenyan youth aged 18-35",
      "Registered or intending to register a business",
      "Business in agribusiness, manufacturing, construction, or services",
      "Demonstrated entrepreneurial spirit and viability of business idea",
      "Willing to undergo 2-week business training",
    ],
    benefits: [
      "Business grants ranging from KSh 50,000 to KSh 500,000",
      "2-week intensive business management training",
      "Mentorship from experienced business leaders",
      "Market linkages and networking opportunities",
      "Access to KCB banking products with favorable terms",
    ],
    howToApply:
      "Apply online through the KCB Foundation 2jiajiri portal. You will need to provide your business plan or proposal, personal identification, and KCPE/KCSE certificates. Applications are reviewed on a rolling basis with intakes every quarter.",
    tags: ["Grant", "Entrepreneurship", "Youth", "KCB Foundation", "Business"],
  },
  {
    title: "Mandela Washington Fellowship for Young African Leaders 2026",
    opportunityType: "FELLOWSHIP",
    category: "LEADERSHIP",
    companySlug: null,
    country: null,
    city: null,
    isOnline: false,
    deadlineDays: 180,
    isFeatured: true,
    targetAudience: ["PROFESSIONALS", "YOUTH"],
    fieldOfInterest: ["LEADERSHIP", "GENERAL"],
    about:
      "The Mandela Washington Fellowship is the flagship program of the Young African Leaders Initiative (YALI), bringing 700 young African leaders to the United States each summer for academic and leadership training. Fellows participate in a 6-week program at U.S. universities focused on Business, Civic Engagement, or Public Management, followed by a Presidential Summit with U.S. leaders in Washington, D.C. The program has produced over 6,000 alumni across Africa.",
    eligibility: [
      "Kenyan citizen aged 25-35",
      "Not a U.S. citizen or permanent resident",
      "Fluent in English",
      "Proven leadership and community engagement record",
      "Available for the full 6-week program",
    ],
    benefits: [
      "6-week fully-funded leadership institute at a U.S. university",
      "Flight, accommodation, and meals covered",
      "Access to professional development and networking",
      "Eligibility for follow-on grants up to $25,000",
      "Membership in the YALI Network with 500,000+ members",
    ],
    howToApply:
      "Apply online through the YALI Network website. Applications include personal information, educational background, leadership experience essays, and a description of your community project. The application window typically opens in September and closes in October annually.",
    tags: ["Fellowship", "Leadership", "YALI", "USA", "Fully Funded"],
  },
];

// ============================================================
// MAIN SEED FUNCTION
// ============================================================

async function main() {
  console.log("🚀 Starting clean seed...\n");

  // ── 1. Clear existing data (reverse FK order) ──
  console.log("🗑️  Clearing existing data...");

  await prisma.application.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.job.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.company.deleteMany();

  console.log("   ✓ All old data cleared\n");

  // ── 2. Create Companies ──
  console.log("🏢 Creating companies...");
  const companyMap = {};

  for (const c of COMPANIES) {
    const { socialLinks, ...data } = c;
    const company = await prisma.company.create({
      data: {
        ...data,
        socialLinks: socialLinks || undefined,
        jobCount: 0,
        opportunityCount: 0,
      },
    });
    companyMap[company.slug] = company.id;
    console.log(`   ✓ ${company.name}`);
  }

  // ── 3. Create Jobs ──
  console.log("\n💼 Creating jobs...");
  const now = new Date();
  let companyJobCounts = {};

  for (const j of JOBS) {
    const companyId = companyMap[j.companySlug];
    if (!companyId) {
      console.log(`   ⚠ Skipping "${j.title}" — company ${j.companySlug} not found`);
      continue;
    }

    const {
      companySlug,
      deadlineDays,
      about,
      requirements,
      responsibilities,
      highlights,
      tags,
      ...data
    } = j;

    const publishedAt = new Date(now);
    publishedAt.setDate(publishedAt.getDate() - Math.floor(Math.random() * 14));

    const deadline = deadlineDays
      ? (() => {
          const d = new Date();
          d.setDate(d.getDate() + deadlineDays);
          return d;
        })()
      : null;

    const job = await prisma.job.create({
      data: {
        ...data,
        slug: makeJobSlug(data.title, companySlug),
        description: jobDescription(about, requirements, responsibilities, highlights),
        excerpt: about.substring(0, 180),
        companyId,
        deadline,
        salaryCurrency: "KES",
        tags: tags || undefined,
        status: "PUBLISHED",
        isActive: true,
        isNew: deadlineDays <= 7,
        source: "DIRECT",
        publishedAt,
        viewsCount: Math.floor(Math.random() * 500) + 50,
      },
    });

    companyJobCounts[companySlug] = (companyJobCounts[companySlug] || 0) + 1;
    console.log(`   ✓ ${job.title} at ${COMPANIES.find((c) => c.slug === companySlug).name}`);
  }

  // Update company job counts
  for (const [slug, count] of Object.entries(companyJobCounts)) {
    await prisma.company.update({
      where: { slug },
      data: { jobCount: count },
    });
  }

  // ── 4. Create Opportunities ──
  console.log("\n🌐 Creating opportunities...");
  let companyOppCounts = {};

  for (const o of OPPORTUNITIES) {
    const {
      companySlug,
      deadlineDays,
      about,
      eligibility,
      benefits,
      howToApply,
      targetAudience,
      fieldOfInterest,
      tags,
      ...data
    } = o;

    const companyId = companySlug ? companyMap[companySlug] : null;

    const publishedAt = new Date(now);
    publishedAt.setDate(publishedAt.getDate() - Math.floor(Math.random() * 7));

    const deadline = deadlineDays
      ? (() => {
          const d = new Date();
          d.setDate(d.getDate() + deadlineDays);
          return d;
        })()
      : null;

    const opp = await prisma.opportunity.create({
      data: {
        ...data,
        slug: oppSlug(data.title),
        description: oppDescription(about, eligibility, benefits, howToApply),
        excerpt: about.substring(0, 180),
        companyId: companyId || undefined,
        deadline,
        targetAudience: targetAudience || undefined,
        fieldOfInterest: fieldOfInterest || undefined,
        tags: tags || undefined,
        status: "PUBLISHED",
        isActive: true,
        source: "DIRECT",
        publishedAt,
        viewsCount: Math.floor(Math.random() * 300) + 20,
      },
    });

    if (companySlug && companyId) {
      companyOppCounts[companySlug] = (companyOppCounts[companySlug] || 0) + 1;
    }

    console.log(`   ✓ ${opp.title}`);
  }

  // Update company opportunity counts
  for (const [slug, count] of Object.entries(companyOppCounts)) {
    await prisma.company.update({
      where: { slug },
      data: { opportunityCount: count },
    });
  }

  console.log("\n✅ Seed complete!");
  console.log("   — 3 companies");
  console.log("   — 5 jobs");
  console.log("   — 5 opportunities\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
