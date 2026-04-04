// Site-wide configuration
export const siteConfig = {
  name: "JobReady Kenya",
  shortName: "JobReady",
  domain: "jobready.co.ke",
  url: "https://jobready.co.ke",
  description:
    "Kenya's #1 job board — jobs, internships, scholarships & career services. Updated daily.",

  // WhatsApp (primary conversion closer)
  whatsapp: {
    number: "254786090635",
    display: "+254 786 090 635",
    link: "https://wa.me/254786090635",
  },

  // Social links
  social: {
    twitter: "https://twitter.com/jobreadykenya",
    facebook: "https://facebook.com/jobreadykenya",
    linkedin: "https://linkedin.com/company/jobreadykenya",
    instagram: "https://instagram.com/jobreadykenya",
    tiktok: "https://tiktok.com/@jobreadykenya",
  },

  // Email addresses
  email: {
    noreply: "noreply@jobready.co.ke",
    support: "support@jobready.co.ke",
    cv: "cv@jobready.co.ke",
    payments: "payments@jobready.co.ke",
  },

  // DPA / ODPC compliance (marketing advantage)
  compliance: {
    odpcRegistrationNumber: "ODPC/KEN/DPI/2026/XXXX",
    dpaOfficer: "privacy@jobready.co.ke",
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
    ogImage: "https://jobready.co.ke/og-default.png",
    twitterHandle: "@jobreadykenya",
  },

  // AdSense
  adsense: {
    clientId: "ca-pub-8031704055036556",
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
    copyright: `© ${new Date().getFullYear()} JobReady.co.ke. All rights reserved. Data Protection Act 2019 compliant.`,
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
