// ============================================================
// JobReady.co.ke — Seed Data Script
// ============================================================
// Run: npx prisma db seed
// Or: node prisma/seed.js
//
// Phases:
//   7a — Authors, Blog Categories, Blog Tags
//   7b — Companies
//   7c — Jobs
//   7d — Opportunities
//   7e — Blog Articles
//   7f — Users, Applications, Saved Jobs, Reactions
//   7g — Service Tiers, Orders, FAQs, Site Pages, Ads
// ============================================================

const { config } = require("dotenv");
config({ override: true });

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ============================================================
// PHASE 7a — Authors, Blog Categories, Blog Tags
// ============================================================

const AUTHORS = [
  {
    name: "Grace Wanjiku",
    slug: "grace-wanjiku",
    title: "Senior Career Coach",
    bio: "Grace Wanjiku is a certified career coach with over 10 years of experience helping Kenyan job seekers land their dream roles. She specializes in CV writing, interview preparation, and career transition strategies. Grace has coached over 3,000 professionals across Nairobi, Mombasa, and Kisumu, with a 92% success rate in helping clients secure interviews within two weeks of CV submission. She holds an MBA from the University of Nairobi and is a member of the International Association of Career Coaches.",
    avatar: null,
    twitterUrl: "https://twitter.com/gracewanjiku_ke",
    linkedinUrl: "https://linkedin.com/in/gracewanjiku",
    articleCount: 8,
    totalViews: 185000,
    peopleCoached: 3000,
  },
  {
    name: "Kevin Ochieng",
    slug: "kevin-ochieng",
    title: "Tech Career Strategist",
    bio: "Kevin Ochieng is a software engineering manager turned career strategist with a passion for helping Kenyan tech professionals navigate the fast-evolving technology landscape. With 8 years in the Kenyan tech ecosystem at companies like Safaricom and Andela, Kevin brings insider knowledge on what hiring managers look for in developer, data, and product roles. He runs a popular YouTube channel on tech careers in East Africa and has been featured in Techweez and Nation Africa.",
    avatar: null,
    twitterUrl: null,
    linkedinUrl: "https://linkedin.com/in/kevin-ochieng",
    articleCount: 4,
    totalViews: 95000,
    peopleCoached: 1200,
  },
  {
    name: "Faith Muthoni",
    slug: "faith-muthoni",
    title: "Finance & Accounting Career Expert",
    bio: "Faith Muthoni is a CPA-K holder and former audit manager at KPMG Kenya with extensive experience in recruitment for finance and accounting roles across East Africa. She understands firsthand what Big Four firms, banks, and corporate finance teams look for in candidates. Faith has reviewed over 5,000 CVs and conducts monthly career webinars for university students pursuing accounting degrees. She is passionate about demystifying the CPA-K journey and helping graduates build competitive profiles.",
    avatar: null,
    twitterUrl: "https://twitter.com/faithmuthoni_cpa",
    linkedinUrl: "https://linkedin.com/in/faith-muthoni-cpa",
    articleCount: 3,
    totalViews: 62000,
    peopleCoached: 800,
  },
  {
    name: "Daniel Kimutai",
    slug: "daniel-kimutai",
    title: "Government Jobs Specialist",
    bio: "Daniel Kimutai is a former Public Service Commission officer turned career advisor, specializing in government of Kenya recruitment processes. With 15 years inside the civil service system, Daniel has deep knowledge of how government hiring works, from public service adverts to county government opportunities. He has helped hundreds of candidates successfully navigate the application process for positions in ministries, state corporations, and county assemblies. Daniel writes extensively about government job opportunities and public service career paths.",
    avatar: null,
    twitterUrl: null,
    linkedinUrl: "https://linkedin.com/in/daniel-kimutai",
    articleCount: 3,
    totalViews: 78000,
    peopleCoached: 500,
  },
  {
    name: "Amina Hassan",
    slug: "amina-hassan",
    title: "Scholarships & Opportunities Researcher",
    bio: "Amina Hassan is a scholarships researcher and education advocate who has helped hundreds of Kenyan students secure fully-funded scholarships for undergraduate, masters, and PhD programs globally. She curates the most comprehensive database of scholarships available to Kenyan students and regularly publishes guides on application strategies, essay writing, and interview preparation for competitive fellowship programs. Amina herself holds a Master's degree from the University of Oxford on a full Chevening Scholarship.",
    avatar: null,
    twitterUrl: "https://twitter.com/amina_scholarships",
    linkedinUrl: "https://linkedin.com/in/amina-hassan",
    articleCount: 4,
    totalViews: 142000,
    peopleCoached: 600,
  },
];

const BLOG_CATEGORIES = [
  {
    name: "CV Writing Tips",
    slug: "cv-writing-tips",
    description: "Expert tips on writing, formatting, and optimizing your CV for Kenyan employers and ATS systems",
    color: "#2563eb",
    gradient: "linear-gradient(135deg, #2563eb, #3b82f6)",
    articleCount: 0,
    isActive: true,
  },
  {
    name: "Interview Tips",
    slug: "interview-tips",
    description: "Prepare for Kenyan job interviews with proven strategies, common questions, and employer-specific advice",
    color: "#059669",
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    articleCount: 0,
    isActive: true,
  },
  {
    name: "Job Search",
    slug: "job-search",
    description: "Strategies for finding and applying to jobs in Kenya, including networking, online platforms, and referrals",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    articleCount: 0,
    isActive: true,
  },
  {
    name: "Career Growth",
    slug: "career-growth",
    description: "Advance your career with advice on promotions, skill development, mentorship, and professional development",
    color: "#ea580c",
    gradient: "linear-gradient(135deg, #ea580c, #f97316)",
    articleCount: 0,
    isActive: true,
  },
  {
    name: "Government Jobs",
    slug: "government-jobs",
    description: "Guide to government of Kenya recruitment, PSC processes, county jobs, and public service career paths",
    color: "#dc2626",
    gradient: "linear-gradient(135deg, #dc2626, #ef4444)",
    articleCount: 0,
    isActive: true,
  },
  {
    name: "Scholarships",
    slug: "scholarships",
    description: "Fully-funded scholarships, fellowships, and grants available to Kenyan students and professionals",
    color: "#0d9488",
    gradient: "linear-gradient(135deg, #0d9488, #14b8a6)",
    articleCount: 0,
    isActive: true,
  },
  {
    name: "Salary & Negotiation",
    slug: "salary-negotiation",
    description: "Understand Kenyan salary benchmarks, negotiate better offers, and understand your market worth",
    color: "#ca8a04",
    gradient: "linear-gradient(135deg, #ca8a04, #eab308)",
    articleCount: 0,
    isActive: true,
  },
];

const BLOG_TAGS = [
  { name: "ATS", slug: "ats", articleCount: 0 },
  { name: "CPA-K", slug: "cpa-k", articleCount: 0 },
  { name: "LinkedIn", slug: "linkedin", articleCount: 0 },
  { name: "Remote Work", slug: "remote-work", articleCount: 0 },
  { name: "Cover Letter", slug: "cover-letter", articleCount: 0 },
  { name: "Safaricom", slug: "safaricom", articleCount: 0 },
  { name: "Fresh Graduate", slug: "fresh-graduate", articleCount: 0 },
  { name: "Salary Negotiation", slug: "salary-negotiation", articleCount: 0 },
  { name: "KRA", slug: "kra", articleCount: 0 },
  { name: "Freelancing", slug: "freelancing", articleCount: 0 },
  { name: "Networking", slug: "networking", articleCount: 0 },
  { name: "Nairobi Jobs", slug: "nairobi-jobs", articleCount: 0 },
  { name: "M-Pesa", slug: "m-pesa", articleCount: 0 },
  { name: "Government Jobs", slug: "government-jobs", articleCount: 0 },
  { name: "County Government", slug: "county-government", articleCount: 0 },
  { name: "Masters Degree", slug: "masters-degree", articleCount: 0 },
  { name: "PhD Scholarships", slug: "phd-scholarships", articleCount: 0 },
  { name: "Chevening", slug: "chevening", articleCount: 0 },
  { name: "Tech Careers", slug: "tech-careers", articleCount: 0 },
  { name: "Data Science", slug: "data-science", articleCount: 0 },
  { name: "Product Management", slug: "product-management", articleCount: 0 },
  { name: "Banking", slug: "banking", articleCount: 0 },
  { name: "Interview Questions", slug: "interview-questions", articleCount: 0 },
  { name: "CV Templates", slug: "cv-templates", articleCount: 0 },
  { name: "Career Change", slug: "career-change", articleCount: 0 },
];

async function seedPhase7a() {
  console.log("🌱 Phase 7a: Seeding Authors, Blog Categories, Blog Tags...");

  // --- Authors ---
  console.log("  → Creating 5 authors...");
  for (const author of AUTHORS) {
    await prisma.author.upsert({
      where: { slug: author.slug },
      update: {},
      create: author,
    });
    console.log(`    ✓ ${author.name} — ${author.title}`);
  }

  // --- Blog Categories ---
  console.log("  → Creating 7 blog categories...");
  for (const cat of BLOG_CATEGORIES) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    console.log(`    ✓ ${cat.name}`);
  }

  // --- Blog Tags ---
  console.log("  → Creating 25 blog tags...");
  for (const tag of BLOG_TAGS) {
    await prisma.blogTag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
    console.log(`    ✓ ${tag.name}`);
  }

  console.log("✅ Phase 7a complete: 5 authors, 7 categories, 25 tags\n");
}

// ============================================================
// PHASE 7b — Companies
// ============================================================

const COMPANIES = [
  {
    name: "Safaricom PLC",
    slug: "safaricom-plc",
    tagline: "Better Everyday for Everyone",
    description: "Safaricom is Kenya's leading telecommunications company, serving over 40 million customers with mobile voice, data, M-Pesa financial services, and enterprise solutions. As a listed company on the Nairobi Securities Exchange (NSE), Safaricom is one of East Africa's most profitable companies, driving innovation through M-Pesa, 5G networks, and digital transformation initiatives. The company employs over 5,000 people directly and supports thousands more through its ecosystem of partners and agents nationwide.",
    industry: "Telecommunications",
    foundedYear: 1999,
    employeeSize: "5,000+",
    tickerSymbol: "SCOM",
    companyType: "Listed Company",
    address: "Safaricom House, Waiyaki Way, Westlands",
    city: "Nairobi",
    website: "https://www.safaricom.co.ke",
    twitterUrl: "https://twitter.com/Safaricom_Care",
    linkedinUrl: "https://linkedin.com/company/safaricom",
    isVerified: true,
    isFeatured: true,
    logoColor: "#00a254,#00c853",
    jobCount: 12,
  },
  {
    name: "Equity Bank Kenya",
    slug: "equity-bank-kenya",
    tagline: "Equity for Everyone",
    description: "Equity Bank Kenya is one of the country's largest commercial banks, with over 190 branches serving millions of customers across all 47 counties. The bank offers retail banking, corporate banking, treasury services, and insurance through its Equity Group Holdings subsidiary. Known for its transformative role in financial inclusion, Equity has pioneered mobile banking, agency banking, and digital lending solutions that have brought millions of previously unbanked Kenyans into the formal financial system.",
    industry: "Banking & Finance",
    foundedYear: 1984,
    employeeSize: "5,000+",
    tickerSymbol: "EQTY",
    companyType: "Listed Company",
    address: "Equity Centre, Hospital Road, Upper Hill",
    city: "Nairobi",
    website: "https://equitybank.co.ke",
    linkedinUrl: "https://linkedin.com/company/equity-bank-kenya",
    isVerified: true,
    isFeatured: true,
    logoColor: "#f59e0b,#fbbf24",
    jobCount: 9,
  },
  {
    name: "KCB Group",
    slug: "kcb-group",
    tagline: "The Bank for You",
    description: "KCB Group is the largest commercial banking group in East Africa, with operations in Kenya, Uganda, Tanzania, Rwanda, Burundi, South Sudan, and Ethiopia. The bank offers a comprehensive range of financial services including retail banking, corporate banking, investment banking, and asset management. With over 250 branches in Kenya alone, KCB serves millions of customers and is known for its digital banking platforms including KCB M-Pesa and the KCB App.",
    industry: "Banking & Finance",
    foundedYear: 1896,
    employeeSize: "5,000+",
    tickerSymbol: "KCB",
    companyType: "Listed Company",
    address: "KCB Centre, Kenyatta Avenue",
    city: "Nairobi",
    website: "https://kcbgroup.com",
    linkedinUrl: "https://linkedin.com/company/kcb-group",
    isVerified: true,
    isFeatured: true,
    logoColor: "#2563eb,#3b82f6",
    jobCount: 11,
  },
  {
    name: "KPMG East Africa",
    slug: "kpmg-east-africa",
    tagline: "Cutting Through Complexity",
    description: "KPMG East Africa is one of the Big Four professional services firms operating in Kenya, providing audit, tax, and advisory services to multinational corporations, government agencies, and growing businesses. The firm is known for its rigorous audit standards, innovative tax advisory, and management consulting practices. KPMG East Africa serves clients across multiple sectors including financial services, technology, healthcare, and government, making it a top employer for accounting and finance professionals.",
    industry: "Professional Services",
    foundedYear: 1971,
    employeeSize: "500-1,000",
    companyType: "Private",
    address: "KPMG Centre, Mara Road, Upper Hill",
    city: "Nairobi",
    website: "https://kpmg.co.ke",
    linkedinUrl: "https://linkedin.com/company/kpmg",
    isVerified: true,
    isFeatured: true,
    logoColor: "#00338d,#0044cc",
    jobCount: 7,
  },
  {
    name: "NCBA Group",
    slug: "ncba-group",
    tagline: "Together We Move Forward",
    description: "NCBA Group is a leading financial services group in Kenya, formed by the merger of NIC Group and CBA Group in 2019. The bank offers retail banking, corporate and investment banking, wealth management, and insurance services. NCBA is known for its digital innovation, including the Loop banking platform and the NCBA Loop app, and is a major player in the Kenyan banking sector with over 90 branches nationwide.",
    industry: "Banking & Finance",
    foundedYear: 1959,
    employeeSize: "1,000-5,000",
    tickerSymbol: "NCBA",
    companyType: "Listed Company",
    address: "NCBA Centre, Community Road, Upper Hill",
    city: "Nairobi",
    website: "https://ncbagroup.com",
    linkedinUrl: "https://linkedin.com/company/ncba-group",
    isVerified: true,
    isFeatured: false,
    logoColor: "#dc2626,#ef4444",
    jobCount: 4,
  },
  {
    name: "Kenya Power and Lighting Company",
    slug: "kenya-power",
    tagline: "Energizing Lives",
    description: "Kenya Power (KPLC) is the primary electricity transmission and distribution company in Kenya, serving over 8 million customers across the country. The company manages the national grid, connecting homes, businesses, and industries to electricity generated from various sources including geothermal, hydro, wind, and solar. KPLC is listed on the NSE and is one of the largest employers in the energy sector, with engineering, technical, and corporate roles across its nationwide operations.",
    industry: "Energy & Utilities",
    foundedYear: 1922,
    employeeSize: "5,000+",
    tickerSymbol: "KPLC",
    companyType: "Listed Company",
    address: "Stima Plaza, Kolobot Road, Parklands",
    city: "Nairobi",
    website: "https://kplc.co.ke",
    linkedinUrl: "https://linkedin.com/company/kenya-power",
    isVerified: true,
    isFeatured: false,
    logoColor: "#059669,#10b981",
    jobCount: 7,
  },
  {
    name: "Andela Kenya",
    slug: "andela-kenya",
    tagline: "Find, Train, and Deploy Top Tech Talent",
    description: "Andela is a global talent network that connects top software engineers from Africa with leading technology companies worldwide. Founded in Nigeria with a major presence in Kenya, Andela runs a rigorous talent identification and training program that accepts less than 2% of applicants. Engineers at Andela work on cutting-edge projects for companies like Google, Microsoft, and Facebook, gaining world-class experience while based in Nairobi.",
    industry: "Technology",
    foundedYear: 2014,
    employeeSize: "1,000-5,000",
    companyType: "Private",
    address: "Pinewood Place, Second Ngong Avenue",
    city: "Nairobi",
    website: "https://andela.com",
    linkedinUrl: "https://linkedin.com/company/andela",
    isVerified: true,
    isFeatured: true,
    logoColor: "#2563eb,#7c3aed",
    jobCount: 6,
  },
  {
    name: "Airtel Kenya",
    slug: "airtel-kenya",
    tagline: "Airtel for Everyone",
    description: "Airtel Kenya is one of the country's major telecommunications providers, offering mobile voice, data, and mobile money services under the Airtel Money brand. As part of Bharti Airtel, one of the world's largest telecom companies, Airtel Kenya brings global expertise and investment to the Kenyan market. The company is known for competitive pricing and innovative data offerings, and has invested heavily in 4G network expansion across the country.",
    industry: "Telecommunications",
    foundedYear: 2000,
    employeeSize: "500-1,000",
    companyType: "Private",
    address: "Airtel Centre, Airtel Lane, Muthaiga",
    city: "Nairobi",
    website: "https://ke.airtel.com",
    linkedinUrl: "https://linkedin.com/company/airtel-kenya",
    isVerified: true,
    isFeatured: false,
    logoColor: "#dc2626,#f97316",
    jobCount: 4,
  },
  {
    name: "PwC Kenya",
    slug: "pwc-kenya",
    tagline: "Build Trust in Society and Solve Important Problems",
    description: "PricewaterhouseCoopers (PwC) Kenya is a leading professional services firm providing audit, assurance, tax, and advisory services. As part of the global PwC network, the Kenya office serves a diverse client base including multinational corporations, government entities, and high-growth startups. PwC Kenya is particularly known for its technology consulting practice, sustainability advisory, and deal advisory services, making it a top destination for top-tier consulting talent.",
    industry: "Professional Services",
    foundedYear: 1978,
    employeeSize: "500-1,000",
    companyType: "Private",
    address: "PwC Centre, Westlands Road",
    city: "Nairobi",
    website: "https://pwc.co.ke",
    linkedinUrl: "https://linkedin.com/company/pwc-kenya",
    isVerified: true,
    isFeatured: true,
    logoColor: "#dc2626,#f97316",
    jobCount: 5,
  },
  {
    name: "Britam Holdings",
    slug: "britam-holdings",
    tagline: "Enhancing Wealth, Enriching Lives",
    description: "Britam is a leading diversified financial services group in East Africa with operations in insurance, asset management, property, and banking. Listed on the NSE and with operations in five African countries, Britam offers life insurance, general insurance, health insurance, and investment products. The company has over 50 branches in Kenya and is known for innovative insurance products tailored to the Kenyan market.",
    industry: "Insurance",
    foundedYear: 1965,
    employeeSize: "1,000-5,000",
    tickerSymbol: "BRITAM",
    companyType: "Listed Company",
    address: "Britam Centre,junction of Kenyatta/Moi Avenues",
    city: "Nairobi",
    website: "https://britam.com",
    linkedinUrl: "https://linkedin.com/company/britam",
    isVerified: true,
    isFeatured: false,
    logoColor: "#0d9488,#14b8a6",
    jobCount: 5,
  },
  {
    name: "United Nations Environment Programme (UNEP)",
    slug: "unep-nairobi",
    tagline: "Working for People and Planet",
    description: "The United Nations Environment Programme (UNEP) is headquartered in Nairobi's Gigiri district, making Kenya the only developing country to host a UN headquarters body. UNEP works on climate change, biodiversity, pollution, and sustainable development across the globe. The Nairobi headquarters employs hundreds of international and local staff in environmental science, policy, communications, operations, and programme management roles.",
    industry: "NGO & Development",
    foundedYear: 1972,
    employeeSize: "1,000-5,000",
    companyType: "International Organization",
    address: "United Nations Avenue, Gigiri",
    city: "Nairobi",
    website: "https://unep.org",
    linkedinUrl: "https://linkedin.com/company/unep",
    isVerified: true,
    isFeatured: true,
    logoColor: "#16a34a,#22c55e",
    jobCount: 6,
  },
  {
    name: "Bata Shoe Company Kenya",
    slug: "bata-shoe-kenya",
    tagline: "Shoes for the World",
    description: "Bata Shoe Company Kenya is a subsidiary of the global Bata Shoe Organization, one of the world's largest footwear manufacturers and retailers. Operating in Kenya since 1939, Bata has an extensive retail network across the country with over 100 stores. The company also operates a major manufacturing facility in Limuru, employing hundreds of workers in production, retail, logistics, and corporate functions.",
    industry: "Manufacturing & Retail",
    foundedYear: 1939,
    employeeSize: "500-1,000",
    companyType: "Private",
    address: "Bata House, Mombasa Road, Industrial Area",
    city: "Nairobi",
    website: "https://bata.co.ke",
    linkedinUrl: "https://linkedin.com/company/bata",
    isVerified: true,
    isFeatured: false,
    logoColor: "#ca8a04,#eab308",
    jobCount: 3,
  },
  {
    name: "Ministry of Education",
    slug: "ministry-of-education-kenya",
    tagline: "Quality Education for Sustainable Development",
    description: "The Ministry of Education is responsible for education policy, curriculum development, and oversight of all educational institutions in Kenya. The ministry oversees primary, secondary, and tertiary education including universities, technical colleges, and TVET institutions. With headquarters in Nairobi and county offices across the country, the ministry employs thousands of teachers, administrators, and education officers.",
    industry: "Government",
    foundedYear: 1963,
    employeeSize: "10,000+",
    companyType: "Government Ministry",
    address: "Tiriki Road, off Parliament Road",
    city: "Nairobi",
    website: "https://education.go.ke",
    isVerified: true,
    isFeatured: false,
    logoColor: "#16a34a,#15803d",
    jobCount: 4,
  },
  {
    name: "Twiga Foods",
    slug: "twiga-foods",
    tagline: "Feeding Africa's Future",
    description: "Twiga Foods is a Kenyan technology-driven food supply platform that connects farmers with vendors through an efficient mobile-based marketplace. Since its founding in 2014, Twiga has grown to become one of Kenya's most prominent agri-tech startups, handling thousands of transactions daily. Backed by international investors including Goldman Sachs and the IFC, Twiga leverages technology to reduce food waste, improve farmer incomes, and lower food costs for urban consumers.",
    industry: "Agriculture & Agri-Tech",
    foundedYear: 2014,
    employeeSize: "200-500",
    companyType: "Private",
    address: "Muthithi Road, Westlands",
    city: "Nairobi",
    website: "https://twigafoods.com",
    linkedinUrl: "https://linkedin.com/company/twiga-foods",
    isVerified: true,
    isFeatured: false,
    logoColor: "#f97316,#fb923c",
    jobCount: 3,
  },
  {
    name: "Absa Bank Kenya",
    slug: "absa-bank-kenya",
    tagline: "Your Story Matters",
    description: "Absa Bank Kenya (formerly Barclays Bank Kenya) is a major commercial bank offering retail banking, corporate banking, wealth management, and investment banking services. As part of the Absa Group, one of Africa's largest financial services groups, the bank brings continental scale and expertise to the Kenyan market. Absa Kenya operates over 80 branches and is known for its innovative digital banking solutions and strong corporate and investment banking franchise.",
    industry: "Banking & Finance",
    foundedYear: 1916,
    employeeSize: "1,000-5,000",
    tickerSymbol: "ABSA",
    companyType: "Listed Company",
    address: "Absa Tower, Waiyaki Way, Westlands",
    city: "Nairobi",
    website: "https://absa.co.ke",
    linkedinUrl: "https://linkedin.com/company/absa-kenya",
    isVerified: true,
    isFeatured: false,
    logoColor: "#dc2626,#f97316",
    jobCount: 4,
  },
  {
    name: "Lupin Kenya",
    slug: "lupin-kenya",
    tagline: "Innovation in Healthcare",
    description: "Lupin Kenya is a subsidiary of Lupin Limited, one of the world's largest generic pharmaceutical companies headquartered in India. The Kenya operation manufactures and distributes a wide range of affordable pharmaceutical products including antibiotics, cardiovascular drugs, and anti-diabetes medications. With a manufacturing facility in Nairobi, Lupin plays a critical role in making essential medicines accessible and affordable across East Africa.",
    industry: "Healthcare & Pharmaceuticals",
    foundedYear: 2008,
    employeeSize: "200-500",
    companyType: "Private",
    address: "Lupin Road, Industrial Area",
    city: "Nairobi",
    website: "https://lupin.com",
    linkedinUrl: "https://linkedin.com/company/lupin",
    isVerified: true,
    isFeatured: false,
    logoColor: "#dc2626,#f97316",
    jobCount: 3,
  },
  {
    name: "Moringa School",
    slug: "moringa-school",
    tagline: "Transforming Africa Through Technology",
    description: "Moringa School is a Nairobi-based tech education institution that offers intensive software engineering, data science, and cybersecurity training programs. Since its founding in 2014, Moringa has trained over 4,000 students and has an 85% job placement rate within 6 months of graduation. The school partners with leading tech companies for curriculum development and job placements, making it a key player in Kenya's growing tech talent pipeline.",
    industry: "Education & Training",
    foundedYear: 2014,
    employeeSize: "50-200",
    companyType: "Private",
    address: "Ngong Lane, Off Ngong Road",
    city: "Nairobi",
    website: "https://moringaschool.com",
    linkedinUrl: "https://linkedin.com/company/moringa-school",
    isVerified: true,
    isFeatured: false,
    logoColor: "#16a34a,#4ade80",
    jobCount: 2,
  },
  {
    name: "Co-operative Bank of Kenya",
    slug: "cooperative-bank-kenya",
    tagline: "We Bring You Closer",
    description: "The Co-operative Bank of Kenya is a leading commercial bank with deep roots in Kenya's co-operative movement. The bank offers a full range of financial services including retail banking, corporate banking, insurance, and investment banking through its subsidiaries. With over 180 branches nationwide, Co-op Bank is known for its strong co-operative banking model, mobile banking platform (MCo-op Cash), and extensive presence in rural and semi-urban areas.",
    industry: "Banking & Finance",
    foundedYear: 1965,
    employeeSize: "1,000-5,000",
    tickerSymbol: "COOP",
    companyType: "Listed Company",
    address: "Co-op Bank House, Haile Selassie Avenue",
    city: "Nairobi",
    website: "https://co-opbank.co.ke",
    linkedinUrl: "https://linkedin.com/company/coop-bank-kenya",
    isVerified: true,
    isFeatured: false,
    logoColor: "#16a34a,#22c55e",
    jobCount: 4,
  },
  {
    name: "KRA (Kenya Revenue Authority)",
    slug: "kenya-revenue-authority",
    tagline: "Revenue for National Development",
    description: "The Kenya Revenue Authority is the government agency responsible for collecting and accounting for all government revenue. KRA administers customs, income tax, VAT, excise duty, and other taxes. The authority employs thousands of staff in tax assessment, audit, customs operations, ICT, and administration across Kenya. KRA has been at the forefront of digital transformation in government services with systems like iTax and the Customs System.",
    industry: "Government",
    foundedYear: 1995,
    employeeSize: "5,000+",
    companyType: "Government Agency",
    address: "KRA Towers, Times Tower, Haile Selassie Avenue",
    city: "Nairobi",
    website: "https://kra.go.ke",
    isVerified: true,
    isFeatured: false,
    logoColor: "#2563eb,#3b82f6",
    jobCount: 3,
  },
];

async function seedPhase7b() {
  console.log("🏗️ Phase 7b: Seeding Companies...");
  console.log(`  → Creating ${COMPANIES.length} companies...`);

  for (const company of COMPANIES) {
    await prisma.company.upsert({
      where: { slug: company.slug },
      update: { jobCount: company.jobCount },
      create: company,
    });
    console.log(`    ✓ ${company.name} — ${company.industry}`);
  }

  console.log(`✅ Phase 7b complete: ${COMPANIES.length} companies\n`);
}

// ============================================================
// PHASE 7c — Jobs
// ============================================================

const { JOBS, htmlDesc, makeSlug } = require("./seed-7c-jobs");

async function seedPhase7c() {
  console.log("💼 Phase 7c: Seeding Jobs...");
  console.log(`  → Creating ${JOBS.length} jobs...`);

  // Build company slug → id map
  const companies = await prisma.company.findMany({ select: { slug: true, id: true } });
  const companyMap = Object.fromEntries(companies.map(c => [c.slug, c.id]));

  let created = 0;
  let skipped = 0;
  const now = new Date();

  for (const job of JOBS) {
    const companyId = companyMap[job.companySlug];
    if (!companyId) {
      console.log(`    ⚠ Skipping "${job.title}" — company ${job.companySlug} not found`);
      skipped++;
      continue;
    }

    const slug = makeSlug(job.title, job.companySlug);
    const publishedAt = new Date(now);
    publishedAt.setDate(publishedAt.getDate() - Math.floor(Math.random() * 14));

    const deadline = job.deadlineDays
      ? (() => { const d = new Date(); d.setDate(d.getDate() + job.deadlineDays); return d; })()
      : null;

    const isNew = job.deadlineDays && job.deadlineDays <= 7;

    await prisma.job.upsert({
      where: { slug },
      update: {},
      create: {
        title: job.title,
        slug,
        description: htmlDesc(job.about, job.requirements, job.responsibilities, job.highlights),
        excerpt: job.about ? job.about.substring(0, 180) : null,
        companyId,
        location: job.location,
        isRemote: job.isRemote || false,
        salaryMin: job.salaryMin || null,
        salaryMax: job.salaryMax || null,
        salaryCurrency: "KES",
        showSalary: job.showSalary || false,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        employmentType: job.employmentType || "PERMANENT",
        category: job.category,
        requirements: job.requirements || [],
        responsibilities: job.responsibilities || [],
        skills: job.requirements ? job.requirements.slice(0, 5) : [],
        highlights: job.highlights || [],
        isFeatured: job.isFeatured || false,
        isNew,
        isUrgent: job.isUrgent || false,
        deadline,
        source: "DIRECT",
        isActive: true,
        isPaid: true,
        publishedAt,
        viewsCount: Math.floor(Math.random() * 2000) + 100,
      },
    });
    created++;
  }

  console.log(`✅ Phase 7c complete: ${created} jobs created, ${skipped} skipped\n`);
}

// ============================================================
// PHASE 7d — Opportunities
// ============================================================

const { OPPORTUNITIES, oppDesc, oppSlug } = require("./seed-7d-opportunities");

async function seedPhase7d() {
  console.log("🌐 Phase 7d: Seeding Opportunities...");
  console.log(`  → Creating ${OPPORTUNITIES.length} opportunities...`);

  const now = new Date();
  let created = 0;

  for (const opp of OPPORTUNITIES) {
    const slug = oppSlug(opp.title);
    const publishedAt = new Date(now);
    publishedAt.setDate(publishedAt.getDate() - Math.floor(Math.random() * 7));

    const deadline = opp.deadlineDays > 0
      ? (() => { const d = new Date(); d.setDate(d.getDate() + opp.deadlineDays); return d; })()
      : null;

    await prisma.opportunity.upsert({
      where: { slug },
      update: {},
      create: {
        title: opp.title,
        slug,
        description: oppDesc(opp.about, opp.eligibility, opp.benefits, opp.howToApply),
        excerpt: opp.about.body ? opp.about.body.substring(0, 180) : null,
        organizationName: opp.organizationName,
        organizationType: opp.organizationType,
        opportunityType: opp.opportunityType,
        category: opp.category || null,
        location: opp.location || null,
        isRemote: opp.location === "Remote",
        deadline,
        source: "DIRECT",
        isFeatured: opp.isFeatured || false,
        isActive: true,
        publishedAt,
        viewsCount: Math.floor(Math.random() * 1500) + 50,
      },
    });
    created++;
  }

  console.log(`✅ Phase 7d complete: ${created} opportunities created\n`);
}

// ============================================================
// PHASE 7e — Blog Articles
// ============================================================

const { ARTICLES, articleSlug } = require("./seed-7e-articles");

async function seedPhase7e() {
  console.log("📝 Phase 7e: Seeding Blog Articles...");

  // Fetch authors and tags
  const authors = await prisma.author.findMany({ select: { slug: true, id: true } });
  const authorMap = Object.fromEntries(authors.map(a => [a.slug, a.id]));

  const categories = await prisma.blogCategory.findMany({ select: { slug: true, id: true } });
  const categoryMap = Object.fromEntries(categories.map(c => [c.slug, c.id]));

  const tags = await prisma.blogTag.findMany({ select: { slug: true, id: true } });
  const tagMap = Object.fromEntries(tags.map(t => [t.slug, t.id]));

  let created = 0;
  const now = new Date();

  for (const article of ARTICLES) {
    const authorId = authorMap[article.authorSlug];
    const categoryId = categoryMap[article.categorySlug];
    if (!authorId || !categoryId) {
      console.log(`    ⚠ Skipping "${article.title}" — missing author or category`);
      continue;
    }

    const slug = articleSlug(article.title);
    const publishedAt = new Date(now);
    publishedAt.setDate(publishedAt.getDate() - (article.publishedDaysAgo || 7));

    const wordCount = article.content.replace(/<[^>]*>/g, '').split(/\s+/).length;

    const createdArticle = await prisma.blogArticle.upsert({
      where: { slug },
      update: {},
      create: {
        title: article.title,
        slug,
        excerpt: article.excerpt ? article.excerpt.substring(0, 180) : null,
        content: article.content,
        authorId,
        categoryId,
        readingTime: article.readingTime || 5,
        viewsCount: Math.floor(Math.random() * 5000) + 200,
        wordCount,
        isFeatured: article.isFeatured || false,
        isPublished: true,
        publishedAt,
        metaTitle: `${article.title} | JobReady.co.ke`,
        metaDescription: article.excerpt ? article.excerpt.substring(0, 160) : null,
      },
    });

    // Connect tags
    const articleTagIds = (article.tagSlugs || [])
      .map(s => tagMap[s])
      .filter(Boolean);

    if (articleTagIds.length > 0) {
      await prisma.articleTag.createMany({
        data: articleTagIds.map(tagId => ({
          articleId: createdArticle.id,
          tagId,
        })),
        skipDuplicates: true,
      });
    }

    created++;
    console.log(`    ✓ "${article.title.substring(0, 50)}..."`);
  }

  console.log(`✅ Phase 7e complete: ${created} articles created\n`);
}

// ============================================================
// PHASE 7f — Users, Applications, Saved Jobs, Alerts, Reactions
// ============================================================

const { JOB_SEEKERS, EMPLOYER_USERS } = require("./seed-7f-users");

async function seedPhase7f() {
  console.log("👥 Phase 7f: Seeding Users, Applications, Saved Jobs...");

  // 1. Create Users (batch)
  console.log("  → Creating users...");
  const passwordHash = await bcrypt.hash("Demo@1234", 10);
  const userIds = [];
  const allUsers = [...JOB_SEEKERS, ...EMPLOYER_USERS];

  for (const user of allUsers) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email, phone: user.phone, name: user.name, passwordHash,
        role: user.role, bio: user.bio || null, location: user.location,
        education: user.education || null, skills: user.skills || null,
        emailVerified: true, phoneVerified: true, lastLoginAt: new Date(),
      },
    });
    userIds.push({ ...user, id: created.id });
  }
  console.log(`    ✓ ${userIds.length} users created`);

  // 2. Create Applications (batch insert)
  const jobs = await prisma.job.findMany({ select: { id: true }, take: 30 });
  const seekerIds = userIds.filter(u => u.role === "JOB_SEEKER").map(u => u.id);
  const statuses = ["PENDING", "PENDING", "PENDING", "SHORTLISTED", "INTERVIEW", "REJECTED"];

  const appData = [];
  const appSet = new Set();
  for (let i = 0; i < 30 && i < jobs.length; i++) {
    const jobId = jobs[i].id;
    const userId = seekerIds[i % seekerIds.length];
    const key = `${userId}-${jobId}`;
    if (!appSet.has(key)) { appSet.add(key); appData.push({ jobId, userId, status: statuses[i % 6], createdAt: new Date(Date.now() - Math.random() * 30 * 86400000) }); }
  }
  await prisma.application.createMany({ data: appData, skipDuplicates: true });
  console.log(`    ✓ ${appData.length} applications created`);

  // 3. Saved Jobs (batch)
  const savedData = [];
  const savedSet = new Set();
  for (let i = 0; i < 20 && i < jobs.length; i++) {
    const jobId = jobs[i].id;
    const userId = seekerIds[i % seekerIds.length];
    const key = `${userId}-${jobId}`;
    if (!savedSet.has(key)) { savedSet.add(key); savedData.push({ jobId, userId }); }
  }
  await prisma.savedJob.createMany({ data: savedData, skipDuplicates: true });
  console.log(`    ✓ ${savedData.length} saved jobs created`);

  // 4. Job Alerts (batch)
  const alertData = [
    { query: "accounting jobs", location: "Nairobi", jobType: "FULL_TIME", category: "FINANCE_ACCOUNTING" },
    { query: "software developer", location: "Nairobi", jobType: "FULL_TIME", category: "TECHNOLOGY" },
    { query: "nursing jobs", jobType: "FULL_TIME", category: "HEALTHCARE" },
    { query: "data science", jobType: "FULL_TIME", category: "TECHNOLOGY" },
    { query: "remote jobs" },
    { query: "government jobs", location: "Nairobi", jobType: "FULL_TIME", category: "GOVERNMENT_PUBLIC_SECTOR" },
  ].map((a, i) => ({
    userId: seekerIds[i % seekerIds.length],
    ...a,
    lastSentAt: new Date(Date.now() - Math.random() * 7 * 86400000),
  }));
  await prisma.jobAlert.createMany({ data: alertData });
  console.log(`    ✓ ${alertData.length} job alerts created`);

  // 5. Notifications (batch)
  const notifData = [
    { type: "JOB_MATCH", title: "New Job Match", message: "A new job matching your profile has been posted" },
    { type: "ORDER_UPDATE", title: "Application Update", message: "Your application has been shortlisted" },
    { type: "SYSTEM", title: "Welcome to JobReady", message: "Complete your profile to get more matches" },
    { type: "PAYMENT", title: "Payment Confirmed", message: "Your CV Writing payment has been confirmed" },
  ].map((n, i) => ({
    userId: seekerIds[i % seekerIds.length],
    ...n,
    isRead: i % 2 === 0,
    data: {},
  }));
  await prisma.notification.createMany({ data: notifData });
  console.log(`    ✓ ${notifData.length} notifications created`);

  // 6. Newsletter Subscriptions (batch)
  const nlData = seekerIds.slice(0, 10).map((userId, i) => ({
    email: userIds.find(u => u.id === userId)?.email,
    userId,
    type: i % 2 === 0 ? "career_tips" : "job_alerts",
  }));
  await prisma.newsletterSubscription.createMany({ data: nlData, skipDuplicates: true });
  console.log(`    ✓ ${nlData.length} newsletter subscriptions created`);

  console.log(`✅ Phase 7f complete: ${userIds.length} users, ${appData.length} applications\n`);
}

// ============================================================
// PHASE 7g — Service Tiers, FAQs, Site Pages, Ads
// ============================================================

const { SERVICE_TIERS, FAQS, SITE_PAGES, AD_PLACEMENTS } = require("./seed-7g-services");

async function seedPhase7g() {
  console.log("🔧 Phase 7g: Seeding Service Tiers, FAQs, Pages, Ads...");

  // 1. Service Tiers
  console.log("  → Creating service tiers...");
  for (const tier of SERVICE_TIERS) {
    await prisma.serviceTier.upsert({
      where: { serviceType_tier: { serviceType: tier.serviceType, tier: tier.tier } },
      update: {},
      create: {
        serviceType: tier.serviceType,
        tier: tier.tier,
        name: tier.name,
        description: tier.description,
        price: tier.price,
        currency: tier.currency,
        features: tier.features,
        deliveryDays: tier.deliveryDays,
        revisionCount: tier.revisionCount,
        isActive: true,
        sortOrder: tier.sortOrder,
      },
    });
  }
  console.log(`    ✓ ${SERVICE_TIERS.length} service tiers created`);

  // 2. FAQs
  console.log("  → Creating FAQs...");
  for (const faq of FAQS) {
    await prisma.faq.create({ data: faq });
  }
  console.log(`    ✓ ${FAQS.length} FAQs created`);

  // 3. Site Pages
  console.log("  → Creating site pages...");
  for (const page of SITE_PAGES) {
    await prisma.sitePage.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }
  console.log(`    ✓ ${SITE_PAGES.length} site pages created`);

  // 4. Ad Placements
  console.log("  → Creating ad placements...");
  for (const ad of AD_PLACEMENTS) {
    await prisma.adPlacement.create({ data: ad });
  }
  console.log(`    ✓ ${AD_PLACEMENTS.length} ad placements created`);

  console.log(`✅ Phase 7g complete\n`);
}

// ============================================================
// MAIN
// ============================================================

const PHASES = process.env.SEED_PHASE ? process.env.SEED_PHASE.split(",") : ["7a", "7b", "7c", "7d", "7e", "7f", "7g"];

async function main() {
  try {
    console.log("========================================");
    console.log("JobReady.co.ke — Seed Data Runner");
    console.log(`Running phases: ${PHASES.join(", ")}`);
    console.log("========================================\n");

    if (PHASES.includes("7a")) await seedPhase7a();
    if (PHASES.includes("7b")) await seedPhase7b();
    if (PHASES.includes("7c")) await seedPhase7c();
    if (PHASES.includes("7d")) await seedPhase7d();
    if (PHASES.includes("7e")) await seedPhase7e();
    if (PHASES.includes("7f")) await seedPhase7f();
    if (PHASES.includes("7g")) await seedPhase7g();

    console.log("========================================");
    console.log("All seed phases completed successfully!");
    console.log("========================================");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
