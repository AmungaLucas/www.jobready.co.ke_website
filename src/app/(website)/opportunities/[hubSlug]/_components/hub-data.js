import { getOpportunityHubs } from "@/config/hub-config";

const organizationPool = [
  "Mastercard Foundation", "Google", "Microsoft", "UNEP", "World Bank",
  "USAID Kenya", "Aga Khan Foundation", "Safaricom PLC", "Equity Group Foundation",
  "Kenya Red Cross Society", "African Union", "British Council Kenya",
  "DAAD Germany", "Commonwealth Scholarships", "Ford Foundation",
  "Rockefeller Foundation", "GIZ Kenya", "JICA Kenya", "African Development Bank",
  "Kenya Commercial Bank Foundation",
];

const locationPool = [
  "Nairobi, Kenya", "Mombasa, Kenya", "Kisumu, Kenya", "Nationwide, Kenya",
  "Kenya (Online)", "Multiple Countries", "United States", "United Kingdom",
  "Germany", "International",
];

const valueTemplates = {
  SCHOLARSHIP: ["Fully Funded", "Tuition + Stipend", "Up to KSh 500,000", "Up to KSh 1M", "50% — 100% Tuition", "Full Tuition + Living Costs"],
  GRANT: ["Up to KSh 5M", "Up to KSh 10M", "KSh 500K — KSh 2M", "Up to $100,000", "Up to $50,000"],
  FELLOWSHIP: ["Fully Funded", "Paid — $3,000/mo", "Paid — $2,000/mo", "Fully Funded + Travel", "Stipend Provided"],
  BURSARY: ["KSh 10,000 — KSh 30,000", "KSh 20,000 — KSh 50,000", "KSh 5,000 — KSh 15,000", "Full Tuition Fee"],
  COMPETITION: ["KSh 1M Prize", "KSh 500K Prize", "KSh 250K Prize", "$10,000 Prize", "Free Entry + Networking"],
  CONFERENCE: ["Free Entry", "KSh 5,000", "KSh 2,000 — KSh 5,000", "Scholarship Available", "Early Bird KSh 1,500"],
  VOLUNTEER: ["Volunteer", "Small Stipend", "Transport + Meals", "Certificate + Experience", "Allowance Provided"],
  APPRENTICESHIP: ["Stipend — KSh 25,000/mo", "Stipend — KSh 20,000/mo", "Stipend — KSh 15,000/mo", "Full Benefits + Pay"],
};

const titleTemplates = {
  SCHOLARSHIP: [
    "Fully Funded Masters Scholarship in Computer Science — 2026",
    "Undergraduate Scholarship for Kenyan Students",
    "PhD Scholarship in Public Health — Fully Funded",
    "STEM Scholarship for Women in Africa 2026",
    "MBA Scholarship for Emerging Leaders",
    "Agricultural Science Scholarship — Tuition + Stipend",
    "Data Science Scholarship Program 2026",
    "Engineering Scholarship for Kenyan Youth",
  ],
  GRANT: [
    "Innovation Grant for Tech Startups in Kenya",
    "Community Development Grant — Up to KSh 5M",
    "Agricultural Research Funding Opportunity",
    "Youth Entrepreneurship Grant 2026",
    "Climate Change Adaptation Grant",
    "Health Innovation Challenge Grant",
  ],
  FELLOWSHIP: [
    "Leadership Fellowship Program — Young African Leaders",
    "Tech Engineering Fellowship (12 Months)",
    "Policy Research Fellowship 2026",
    "Data Science Fellowship — Paid Program",
    "Global Health Fellowship — Fully Funded",
    "Social Impact Fellowship",
  ],
  BURSARY: [
    "County Bursary Fund 2026/2027",
    "University Tuition Bursary — Needy Students",
    "Medical School Bursary Program",
    "Engineering Bursary — County Government",
    "Secondary School Fees Bursary",
    "TVET Bursary Fund 2026",
  ],
  COMPETITION: [
    "National Hackathon 2026 — KSh 1M Prize",
    "Business Plan Competition",
    "Essay Writing Competition — Youth",
    "Innovation Challenge — University Students",
    "Photography Competition — Kenya Heritage",
  ],
  CONFERENCE: [
    "Tech Summit Nairobi 2026",
    "Annual Business Leadership Conference",
    "Africa Health Conference 2026",
    "Education Innovation Summit",
    "Women in Tech Conference — East Africa",
  ],
  VOLUNTEER: [
    "Community Health Volunteer Program 2026",
    "Environmental Conservation Volunteer",
    "Teaching Volunteer — Rural Schools",
    "Disaster Response Volunteer — Red Cross",
    "Digital Literacy Volunteer Program",
  ],
  APPRENTICESHIP: [
    "Electrical Apprenticeship Program 2026",
    "Plumbing & Fitting Apprenticeship",
    "Welding & Fabrication Apprenticeship",
    "Carpentry Apprenticeship — 2 Year Program",
    "Automotive Mechanic Apprenticeship",
  ],
};

export function mockHubOpportunities(hub) {
  const oppType = hub.filters?.opportunityType || "SCHOLARSHIP";
  const templates = titleTemplates[oppType] || titleTemplates.SCHOLARSHIP;
  const values = valueTemplates[oppType] || valueTemplates.SCHOLARSHIP;
  const items = [];
  const count = 6 + Math.floor(Math.random() * 6);

  for (let i = 0; i < count; i++) {
    const daysAgoPosted = Math.floor(Math.random() * 30);
    const daysToDeadline = 10 + Math.floor(Math.random() * 120);

    items.push({
      id: 200 + i,
      title: templates[i % templates.length],
      slug: `opp-${oppType.toLowerCase()}-${hub.slug}-${i + 1}`,
      organizationName: organizationPool[i % organizationPool.length],
      opportunityType: oppType.charAt(0) + oppType.slice(1).toLowerCase(),
      type: oppType.toLowerCase(),
      deadline: new Date(Date.now() + daysToDeadline * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      value: values[i % values.length],
      location: locationPool[i % locationPool.length],
      postedDate: new Date(Date.now() - daysAgoPosted * 24 * 60 * 60 * 1000).toISOString(),
      isFeatured: i < 2,
      isNew: daysAgoPosted < 5,
    });
  }
  return items;
}

export function getRelatedOpportunityHubs(currentSlug) {
  const allHubs = getOpportunityHubs();
  return allHubs
    .filter((h) => h.slug !== currentSlug)
    .map((h) => ({
      slug: h.slug,
      name: h.name.replace(/\s*2026\s*$/, "").replace(" for Kenyans", ""),
      count: 10 + Math.floor(Math.random() * 50),
    }));
}
