import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { generateMeta, generateBreadcrumbJsonLd } from "@/lib/seo";

// ─── Client Components ──────────────────────────────────
import ShareStrip from "../../_components/ShareStrip";
import AdPlaceholder from "../../_components/AdPlaceholder";
import CompanyAboutCard from "../../_components/CompanyAboutCard";
import RelatedJobsCard from "../../_components/RelatedJobsCard";
import CVWritingCTA from "../../_components/CVWritingCTA";
import CVServiceStrip from "../../_components/CVServiceStrip";

// ─── Opportunity type display mapping ───────────────────
const OPP_TYPE_DISPLAY = {
  INTERNSHIP: "Internship",
  SPONSORSHIP: "Sponsorship",
  BURSARY: "Bursary",
  UNIVERSITY_ADMISSION: "University Admission",
  BOOTCAMP: "Bootcamp",
  MENTORSHIP: "Mentorship",
  SCHOLARSHIP: "Scholarship",
  CERTIFICATION: "Certification",
  FUNDING: "Funding",
  GRANT: "Grant",
  FELLOWSHIP: "Fellowship",
  COMPETITION: "Competition",
  CONFERENCE: "Conference",
  VOLUNTEER: "Volunteer",
  APPRENTICESHIP: "Apprenticeship",
};

const OPP_TYPE_COLORS = {
  INTERNSHIP: { bg: "bg-blue-100", text: "text-blue-800" },
  SPONSORSHIP: { bg: "bg-green-100", text: "text-green-800" },
  BURSARY: { bg: "bg-emerald-100", text: "text-emerald-800" },
  UNIVERSITY_ADMISSION: { bg: "bg-purple-100", text: "text-purple-800" },
  BOOTCAMP: { bg: "bg-orange-100", text: "text-orange-800" },
  MENTORSHIP: { bg: "bg-pink-100", text: "text-pink-800" },
  SCHOLARSHIP: { bg: "bg-indigo-100", text: "text-indigo-800" },
  CERTIFICATION: { bg: "bg-cyan-100", text: "text-cyan-800" },
  FUNDING: { bg: "bg-amber-100", text: "text-amber-800" },
  GRANT: { bg: "bg-teal-100", text: "text-teal-800" },
  FELLOWSHIP: { bg: "bg-violet-100", text: "text-violet-800" },
  COMPETITION: { bg: "bg-red-100", text: "text-red-800" },
  CONFERENCE: { bg: "bg-sky-100", text: "text-sky-800" },
  VOLUNTEER: { bg: "bg-lime-100", text: "text-lime-800" },
  APPRENTICESHIP: { bg: "bg-fuchsia-100", text: "text-fuchsia-800" },
};

// ─── Data Fetching ──────────────────────────────────────
async function getOpportunity(slug) {
  try {
  const opportunity = await db.opportunity.findUnique({
    where: { slug },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          logoColor: true,
          industry: true,
          size: true,
          description: true,
          county: true,
          country: true,
        },
      },
    },
  });

  if (!opportunity) return null;

  // View count is already incremented by the API — we do it here too for direct page hits
  db.opportunity.update({
    where: { id: opportunity.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  // Fetch similar opportunities
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const similarOpportunities = await db.opportunity.findMany({
    where: {
      id: { not: opportunity.id },
      opportunityType: opportunity.opportunityType,
      isActive: true,
      publishedAt: { not: null, lte: now },
      OR: [
        { deadline: null },
        { deadline: { gte: today } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      opportunityType: true,
      deadline: true,
      company: {
        select: { name: true, slug: true, logo: true, logoColor: true },
      },
    },
  });

  return { opportunity, similarOpportunities };
  } catch (error) {
    console.error("[getOpportunity] DB error for slug:", slug, error.message);
    return null;
  }
}

// ─── Metadata ───────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const opp = await db.opportunity.findUnique({
      where: { slug },
      include: { company: { select: { name: true } } },
    });

    if (!opp) return { title: "Opportunity Not Found | JobReady Kenya" };

    const typeDisplay = OPP_TYPE_DISPLAY[opp.opportunityType] || opp.opportunityType?.replace(/_/g, " ") || "Opportunity";

    return generateMeta({
      title: `${opp.title} — ${typeDisplay}`,
      description: `${opp.excerpt || `${opp.title} at ${opp.company?.name || "JobReady Kenya"}. Apply now on JobReady Kenya.`}`,
      path: `/opportunities/${slug}`,
      ogType: "article",
      publishedTime: opp.publishedAt?.toISOString(),
      modifiedTime: opp.updatedAt?.toISOString(),
    });
  } catch {
    return { title: "Opportunity Not Found | JobReady Kenya" };
  }
}

// ─── Page Component ─────────────────────────────────────
export default async function OpportunityDetailPage({ params }) {
  const { slug } = await params;
  const data = await getOpportunity(slug);

  if (!data) notFound();

  const { opportunity: opp, similarOpportunities } = data;
  const company = opp.company;
  const typeDisplay = OPP_TYPE_DISPLAY[opp.opportunityType] || opp.opportunityType?.replace(/_/g, " ") || "Opportunity";
  const typeColor = OPP_TYPE_COLORS[opp.opportunityType] || { bg: "bg-gray-100", text: "text-gray-700" };
  const postedDate = formatDate(opp.publishedAt || opp.createdAt);
  const deadlineDate = opp.deadline ? formatDate(opp.deadline) : null;

  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Opportunities", href: "/opportunities" },
  ];
  if (opp.opportunityType) {
    const typeSlug = opp.opportunityType.toLowerCase();
    breadcrumbItems.push({
      name: typeDisplay,
      href: `/opportunities/${typeSlug}`,
    });
  }
  breadcrumbItems.push({ name: opp.title, href: `/opportunities/${slug}` });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  // Description is stored as HTML — render with dangerouslySetInnerHTML
  const hasDescription = !!opp.description;

  return (
    <main className="py-8 md:py-12 bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* ═══ LEFT COLUMN (2/3) ═══ */}
          <div className="md:col-span-2">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-4 flex flex-wrap items-center gap-1">
              {breadcrumbItems.map((item, i) => (
                <span key={item.href}>
                  {i > 0 && <span className="text-gray-300 mx-1">/</span>}
                  {i === breadcrumbItems.length - 1 ? (
                    <span className="text-gray-700 font-medium truncate max-w-[200px] sm:max-w-none inline-block align-bottom">
                      {item.name}
                    </span>
                  ) : (
                    <Link href={item.href} className="hover:text-teal-600 transition-colors">
                      {item.name}
                    </Link>
                  )}
                </span>
              ))}
            </nav>

            {/* ─── Opportunity Header Card ─── */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`${typeColor.bg} ${typeColor.text} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                  {typeDisplay}
                </span>
                {opp.isFeatured && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    ⭐ Featured
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{opp.title}</h1>

              <div className="text-sm text-gray-600 mt-1.5">
                {company?.name && <span className="font-medium">{company.name}</span>}
                {!company && <span className="font-medium">JobReady Kenya</span>}
              </div>

              <div className="text-sm text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                {postedDate && <span>📅 Posted: {postedDate}</span>}
                {deadlineDate && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span>⏳ Deadline: {deadlineDate}</span>
                  </>
                )}
                {opp.viewCount > 0 && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span>👁️ {opp.viewCount.toLocaleString()} views</span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              {opp.howToApply && (
                <div className="flex flex-wrap gap-3 mt-5">
                  <a
                    href="#how-to-apply"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-md transition-colors"
                  >
                    Apply Now
                  </a>
                </div>
              )}
            </div>

            {/* ─── Description + How to Apply ─── */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-3 text-gray-900">Description</h2>
              <div
                className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-h3:text-lg prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-2 prose-ul:my-3 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: hasDescription ? opp.description : (opp.excerpt || "<p>No description provided.</p>") }}
              />

              {/* How to Apply */}
              {opp.howToApply && (
                <div className="mt-6 pt-4 border-t border-gray-200" id="how-to-apply">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">How to Apply</h3>
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: opp.howToApply }}
                  />
                </div>
              )}
            </div>

            {/* ─── CV Service Strip ─── */}
            <CVServiceStrip />

            {/* ─── Share Strip ─── */}
            <ShareStrip title={opp.title} />
          </div>

          {/* ═══ RIGHT SIDEBAR (1/3) ═══ */}
          <div className="space-y-6">
            <AdPlaceholder height="250px" />

            <CompanyAboutCard company={company} />

            <RelatedJobsCard
              jobs={similarOpportunities}
              title="Related Opportunities"
              type="opportunity"
            />

            <CVWritingCTA />

            <AdPlaceholder height="200px" label="Sponsored" />
          </div>
        </div>
      </div>
    </main>
  );
}
