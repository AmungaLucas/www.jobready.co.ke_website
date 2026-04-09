// Site-wide configuration
// ─── All values can be overridden via .env.local ───
// Just change .env.local and rebuild — everything updates automatically.

const env = process.env;

// Helper: read env var or return default
function envOr(key, fallback) {
  return env[key] || fallback;
}

// ─── Core brand & domain ────────────────────────────────────────────
const SITE_DOMAIN = envOr("NEXT_PUBLIC_SITE_DOMAIN", "jobnet.co.ke");   // temporary → future: jobready.co.ke
const EMAIL_DOMAIN = envOr("NEXT_PUBLIC_EMAIL_DOMAIN", "jobready.co.ke"); // email stays on jobready
const BRAND_NAME = envOr("NEXT_PUBLIC_BRAND_NAME", "JobReady.co.ke");
const BRAND_SHORT = envOr("NEXT_PUBLIC_BRAND_SHORT", "JobReady");
const COMPANY_NAME = envOr("NEXT_PUBLIC_COMPANY_NAME", "JobReady Kenya");
const SITE_URL = envOr("NEXT_PUBLIC_SITE_URL", `https://${SITE_DOMAIN}`);

// ─── WhatsApp ───────────────────────────────────────────────────────
const WA_NUMBER = envOr("NEXT_PUBLIC_WHATSAPP_NUMBER", "254786090635");
const WA_DISPLAY = envOr("NEXT_PUBLIC_WHATSAPP_DISPLAY", "+254 786 090 635");

function waLink(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ─── Computed WhatsApp config ───────────────────────────────────────
const whatsappMessages = {
  general: "Hi JobReady, I'd like to enquire about your services. Please assist me.",
  cvService: "Hi JobReady, I'd like to order a CV writing service. Please share the details.",
  payment: "Hi JobReady, I need help with my payment.",
  freeCvReview: "Hi JobReady, I saw the free CV review offer on your website. I'd like to get mine reviewed.",
  employer: "Hi JobReady, I'd like to post a job / advertise on your platform. Please share the rates.",
};

// ─── Email config ───────────────────────────────────────────────────
const emailUser = (prefix) => `${prefix}@${EMAIL_DOMAIN}`;

// ─── Export ─────────────────────────────────────────────────────────
export const siteConfig = {
  name: COMPANY_NAME,
  shortName: BRAND_SHORT,
  brandName: BRAND_NAME,
  companyLegalName: COMPANY_NAME,

  // ─── DOMAIN (change NEXT_PUBLIC_SITE_DOMAIN in .env.local to switch everywhere) ───
  domain: SITE_DOMAIN,
  url: SITE_URL,
  emailDomain: EMAIL_DOMAIN,
  description:
    "Kenya's #1 job board — jobs, internships, scholarships & career services. Updated daily.",

  // WhatsApp (primary conversion closer)
  whatsapp: {
    number: WA_NUMBER,
    display: WA_DISPLAY,
    link: `https://wa.me/${WA_NUMBER}`,
    messages: whatsappMessages,
    links: {
      general: waLink(whatsappMessages.general),
      cvService: waLink(whatsappMessages.cvService),
      payment: waLink(whatsappMessages.payment),
      freeCvReview: waLink(whatsappMessages.freeCvReview),
      employer: waLink(whatsappMessages.employer),
    },
  },

  // Social links
  social: {
    twitter: envOr("NEXT_PUBLIC_SOCIAL_TWITTER", "https://twitter.com/jobreadykenya"),
    facebook: envOr("NEXT_PUBLIC_SOCIAL_FACEBOOK", "https://facebook.com/jobreadykenya"),
    linkedin: envOr("NEXT_PUBLIC_SOCIAL_LINKEDIN", "https://linkedin.com/company/jobreadykenya"),
    instagram: envOr("NEXT_PUBLIC_SOCIAL_INSTAGRAM", "https://instagram.com/jobreadykenya"),
    tiktok: envOr("NEXT_PUBLIC_SOCIAL_TIKTOK", "https://tiktok.com/@jobreadykenya"),
  },

  // Email addresses (all built from EMAIL_DOMAIN)
  email: {
    noreply: emailUser("noreply"),
    support: emailUser("support"),
    cv: emailUser("cv"),
    payments: emailUser("payments"),
    privacy: emailUser("privacy"),
  },

  // DPA / ODPC compliance (marketing advantage)
  compliance: {
    odpcRegistrationNumber: envOr("NEXT_PUBLIC_ODPC_REG", "ODPC/KEN/DPI/2026/XXXX"),
    dpaOfficer: emailUser("privacy"),
  },

  // Homepage stats (can be overwritten by DB cache)
  stats: {
    totalJobs: 2500,
    totalCompanies: 500,
    totalArticles: 150,
    monthlyVisitors: 85000,
    successRate: 92,
  },

  // SEO
  seo: {
    get ogImage() { return `${SITE_URL}/og-default.png`; },
    twitterHandle: envOr("NEXT_PUBLIC_TWITTER_HANDLE", "@jobreadykenya"),
  },

  // AdSense
  adsense: {
    clientId: envOr("NEXT_PUBLIC_ADSENSE_ID", "ca-pub-8031704055036556"),
  },

  // Navigation
  nav: [
    { label: "Jobs", href: "/jobs" },
    { label: "Opportunities", href: "/opportunities" },
    { label: "Companies", href: "/organizations" },
    { label: "Career Advice", href: "/career-advice" },
    { label: "CV Services", href: "/cv-services" },
  ],

  // Top bar links
  topBarLinks: [
    { label: "Internships", href: "/jobs/internships" },
    { label: "Govt Jobs", href: "/jobs/government" },
    { label: "Remote", href: "/jobs/remote" },
    { label: "Scholarships", href: "/opportunities/scholarships" },
    { label: "CV Writing", href: "/cv-services" },
  ],

  // Mobile nav extra links
  mobileNavExtras: [
    { label: "Internships", href: "/jobs/internships", icon: "Users" },
    { label: "Government Jobs", href: "/jobs/government", icon: "Landmark" },
    { label: "Scholarships", href: "/opportunities/scholarships", icon: "GraduationCap" },
  ],

  // Footer
  footer: {
    description:
      "Kenya's fastest-growing job board. Find your next opportunity or get a professional CV from KSh 500.",
    columns: [
      {
        title: "For Job Seekers",
        links: [
          { label: "Browse Jobs", href: "/jobs" },
          { label: "Internships", href: "/jobs/internships" },
          { label: "Government Jobs", href: "/jobs/government" },
          { label: "Remote Jobs", href: "/jobs/remote" },
          { label: "Career Advice", href: "/career-advice" },
        ],
      },
      {
        title: "Opportunities",
        links: [
          { label: "Scholarships", href: "/opportunities/scholarships" },
          { label: "Grants", href: "/opportunities/grants" },
          { label: "Fellowships", href: "/opportunities/fellowships" },
          { label: "Bursaries", href: "/opportunities/bursaries" },
          { label: "All Opportunities", href: "/opportunities" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about" },
          { label: "CV Writing Services", href: "/cv-services" },
          { label: "Contact Us", href: "/contact" },
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ],
      },
    ],
    get copyright() {
      return `© ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved. Data Protection Act 2019 compliant.`;
    },
    legalLinks: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Refunds", href: "/refunds" },
      { label: "DPA Notice", href: "/data-protection" },
    ],
  },
};
