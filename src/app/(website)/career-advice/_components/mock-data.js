// Mock articles for Career Advice listing page
export const categories = [
  "All",
  "CV Tips",
  "Interview Prep",
  "Salary Guide",
  "Career Growth",
  "Industry Insights",
  "Job Search",
  "Government Jobs",
];

export const categorySlugs = {
  "CV Tips": "cv-tips",
  "Interview Prep": "interview",
  "Salary Guide": "salary",
  "Career Growth": "career-growth",
  "Industry Insights": "industry",
  "Job Search": "job-search",
  "Government Jobs": "government",
};

export const categoryColors = {
  "cv-tips": {
    strip: "bg-gradient-to-r from-blue-600 to-blue-400",
    pill: "bg-blue-100 text-blue-700",
  },
  interview: {
    strip: "bg-gradient-to-r from-emerald-600 to-emerald-400",
    pill: "bg-emerald-100 text-emerald-700",
  },
  salary: {
    strip: "bg-gradient-to-r from-pink-600 to-pink-400",
    pill: "bg-pink-100 text-pink-700",
  },
  "career-growth": {
    strip: "bg-gradient-to-r from-violet-600 to-violet-400",
    pill: "bg-violet-100 text-violet-700",
  },
  industry: {
    strip: "bg-gradient-to-r from-amber-600 to-orange-400",
    pill: "bg-amber-100 text-amber-900",
  },
  "job-search": {
    strip: "bg-gradient-to-r from-amber-500 to-amber-400",
    pill: "bg-amber-100 text-amber-900",
  },
  government: {
    strip: "bg-gradient-to-r from-red-600 to-red-400",
    pill: "bg-red-100 text-red-700",
  },
};

export const articles = [
  {
    slug: "how-to-write-cv-kenya-2026",
    title: "How to Write a CV That Gets You Interviewed in Kenya — Complete 2026 Guide",
    excerpt:
      "The ultimate guide to writing a CV that passes ATS systems, impresses Kenyan recruiters, and lands you more interviews. Includes templates and examples.",
    category: "CV Tips",
    author: { name: "Grace Wanjiku" },
    publishedAt: "2026-01-15T09:00:00+03:00",
    readingTime: "12 min read",
    viewsCount: 14230,
    isFeatured: true,
  },
  {
    slug: "common-cv-mistakes-kenyan-job-seekers",
    title: "10 Common CV Mistakes Kenyan Job Seekers Make (And How to Fix Them)",
    excerpt:
      "From poor formatting to missing contact details, these CV mistakes could be costing you interviews. Learn how to fix them and stand out.",
    category: "CV Tips",
    author: { name: "James Njoroge" },
    publishedAt: "2026-01-10T09:00:00+03:00",
    readingTime: "5 min read",
    viewsCount: 8930,
  },
  {
    slug: "safaricom-panel-interview-prep",
    title: "How to Prepare for a Safaricom Panel Interview",
    excerpt:
      "Inside tips from former Safaricom interviewers. Learn the STAR method, common questions, and how to stand out in group interviews.",
    category: "Interview Prep",
    author: { name: "Grace Wanjiku" },
    publishedAt: "2026-01-08T09:00:00+03:00",
    readingTime: "8 min read",
    viewsCount: 6750,
  },
  {
    slug: "government-of-kenya-public-service-recruitment",
    title: "Government of Kenya Jobs: Public Service Recruitment Guide",
    excerpt:
      "Everything you need to know about applying for government jobs through the PSC portal. Requirements, timelines, and insider tips.",
    category: "Government Jobs",
    author: { name: "Peter Mwangi" },
    publishedAt: "2026-01-05T09:00:00+03:00",
    readingTime: "7 min read",
    viewsCount: 11200,
  },
  {
    slug: "entry-level-jobs-nairobi-2026",
    title: "Entry Level Jobs in Nairobi: Where to Find Them and How to Apply",
    excerpt:
      "A comprehensive guide for fresh graduates looking for entry-level positions in Nairobi's competitive job market.",
    category: "Job Search",
    author: { name: "Lucy Wambui" },
    publishedAt: "2026-01-03T09:00:00+03:00",
    readingTime: "6 min read",
    viewsCount: 5430,
  },
  {
    slug: "cover-letter-templates-kenya",
    title: "Cover Letter Templates That Actually Work in Kenya",
    excerpt:
      "Stop copying generic cover letters. Use these proven templates tailored for Kenyan employers and get more callbacks.",
    category: "CV Tips",
    author: { name: "James Njoroge" },
    publishedAt: "2025-12-28T09:00:00+03:00",
    readingTime: "4 min read",
    viewsCount: 7810,
  },
  {
    slug: "how-to-negotiate-salary-kenya",
    title: "How to Negotiate Your Salary in Kenya: A Complete Guide",
    excerpt:
      "Kenyan salary negotiation strategies backed by data. Learn when to negotiate, what to say, and how to handle lowball offers.",
    category: "Salary Guide",
    author: { name: "Grace Wanjiku" },
    publishedAt: "2025-12-22T09:00:00+03:00",
    readingTime: "6 min read",
    viewsCount: 9150,
  },
  {
    slug: "scholarships-kenyan-students-2026",
    title: "Best Scholarships for Kenyan Students in 2026",
    excerpt:
      "Fully funded scholarships for undergraduate and postgraduate studies. Application deadlines, eligibility, and step-by-step guide.",
    category: "Industry Insights",
    author: { name: "Lucy Wambui" },
    publishedAt: "2025-12-18T09:00:00+03:00",
    readingTime: "10 min read",
    viewsCount: 13400,
  },
  {
    slug: "linkedin-tips-kenyan-professionals",
    title: "LinkedIn Tips for Kenyan Professionals: Build a Profile That Gets Noticed",
    excerpt:
      "Optimize your LinkedIn profile for the Kenyan job market. Headline tips, keywords, networking strategies, and recruiter visibility.",
    category: "Career Growth",
    author: { name: "Peter Mwangi" },
    publishedAt: "2025-12-15T09:00:00+03:00",
    readingTime: "5 min read",
    viewsCount: 4580,
  },
  {
    slug: "from-internship-to-full-time-kenya",
    title: "From Internship to Full-Time: How to Convert Your Kenyan Internship Into a Job",
    excerpt:
      "Practical strategies to turn your internship into a permanent position. Communication tips, visibility, and when to have the conversation.",
    category: "Career Growth",
    author: { name: "Grace Wanjiku" },
    publishedAt: "2025-12-12T09:00:00+03:00",
    readingTime: "7 min read",
    viewsCount: 3920,
  },
];

export const popularArticles = [
  { title: "10 Common CV Mistakes Kenyan Job Seekers Make", slug: "common-cv-mistakes-kenyan-job-seekers", views: "8.9K" },
  { title: "How to Negotiate Your Salary in Kenya", slug: "how-to-negotiate-salary-kenya", views: "9.1K" },
  { title: "Best Scholarships for Kenyan Students 2026", slug: "scholarships-kenyan-students-2026", views: "13.4K" },
  { title: "How to Prepare for a Safaricom Panel Interview", slug: "safaricom-panel-interview-prep", views: "6.7K" },
  { title: "Government of Kenya Jobs Guide", slug: "government-of-kenya-public-service-recruitment", views: "11.2K" },
];

export const sidebarCategories = [
  { name: "CV Writing Tips", count: 24 },
  { name: "Interview Preparation", count: 18 },
  { name: "Job Search Strategies", count: 15 },
  { name: "Career Growth", count: 21 },
  { name: "Government Jobs", count: 12 },
  { name: "Salary & Negotiation", count: 9 },
  { name: "Scholarships", count: 14 },
];

export const popularTags = [
  "CV Writing",
  "Job Search",
  "ATS",
  "Kenya Jobs",
  "Interview",
  "Career Advice",
  "Safaricom",
  "Government",
  "Salary",
  "Graduate",
  "LinkedIn",
  "Cover Letter",
  "Remote Work",
  "Internship",
  "Scholarships",
];
