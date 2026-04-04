import Link from "next/link";
import Script from "next/script";
import {
  Clock,
  MapPin,
  Globe,
  ExternalLink,
  MessageCircle,
  CalendarDays,
  Eye,
  GraduationCap,
} from "lucide-react";
import { formatDate, formatRelativeDate } from "@/lib/format";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site-config";
import SidebarCard from "@/app/(website)/_components/SidebarCard";
import CVReviewCTA from "@/app/(website)/_components/CVReviewCTA";
import AdSlot from "@/app/(website)/_components/AdSlot";
import NewsletterForm from "@/app/(website)/_components/NewsletterForm";
import CopyLinkButton from "@/app/(website)/_components/CopyLinkButton";
import OpportunityCard from "@/app/(website)/_components/OpportunityCard";

// NOTE: CopyLinkButton extracted to a separate client component file

// ─── Type badge colors ──────────────────────────────
const typeBadgeColors = {
  scholarship: "bg-purple-100 text-purple-700",
  bursary: "bg-blue-100 text-blue-700",
  internship: "bg-green-100 text-green-700",
  grant: "bg-amber-100 text-amber-700",
  fellowship: "bg-indigo-100 text-indigo-700",
  competition: "bg-red-100 text-red-700",
  conference: "bg-teal-100 text-teal-700",
  volunteer: "bg-pink-100 text-pink-700",
  apprenticeship: "bg-orange-100 text-orange-700",
};

export default function OpportunityDetailContent({ data }) {
  const { opportunity: opp, similarOpportunities = [] } = data;
  const typeColor =
    typeBadgeColors[opp.opportunityType] || "bg-gray-100 text-gray-700";

  const isExpired = opp.deadline && new Date(opp.deadline) < new Date();
  const pageUrl = `https://jobready.co.ke/opportunities/${opp.slug}`;

  // JSON-LD
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Opportunities", href: "/opportunities" },
    {
      name:
        opp.opportunityType?.charAt(0).toUpperCase() +
          opp.opportunityType?.slice(1) + "s" || "Opportunity",
      href: `/opportunities/${opp.opportunityType || ""}`,
    },
    { name: opp.title, href: `/opportunities/${opp.slug}` },
  ]);

  return (
    <>
      {/* JSON-LD */}
      <Script
        id="opp-detail-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <Script
        id="opp-detail-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: opp.title,
            description: opp.excerpt || `Apply for ${opp.title} on JobReady Kenya.`,
            url: pageUrl,
            isPartOf: {
              "@type": "WebSite",
              name: "JobReady Kenya",
              url: "https://jobready.co.ke",
            },
          }),
        }}
      />

      {/* Breadcrumbs */}
      <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
        <ol className="flex items-center gap-1.5 text-[0.83rem] list-none flex-wrap">
          <li>
            <Link
              href="/"
              className="text-gray-500 hover:text-[#1a56db] transition-colors no-underline"
            >
              Home
            </Link>
          </li>
          <li className="text-gray-300">/</li>
          <li>
            <Link
              href="/opportunities"
              className="text-gray-500 hover:text-[#1a56db] transition-colors no-underline"
            >
              Opportunities
            </Link>
          </li>
          <li className="text-gray-300">/</li>
          <li>
            <Link
              href={`/opportunities/${opp.opportunityType || ""}`}
              className="text-gray-500 hover:text-[#1a56db] transition-colors no-underline"
            >
              {opp.opportunityType
                ? opp.opportunityType.charAt(0).toUpperCase() +
                  opp.opportunityType.slice(1) +
                  "s"
                : "Opportunity"}
            </Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium">{opp.title}</li>
        </ol>
      </nav>

      {/* Ad leaderboard */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 hidden lg:block mb-6">
        <AdSlot position="leaderboard" />
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${typeColor}`}
            >
              {opp.opportunityType || "Opportunity"}
            </span>
            {opp.isFeatured && (
              <span className="bg-amber-400 text-amber-900 px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold">
                ★ Featured
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-3">
            {opp.title}
          </h1>
          <p className="text-purple-100 text-sm md:text-base mb-6">
            {opp.organizationName && (
              <span className="font-semibold text-white">
                {opp.organizationName}
              </span>
            )}
            {opp.organizationName && opp.location ? " • " : ""}
            {opp.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {opp.location}
              </span>
            )}
            {opp.isRemote && (
              <span className="inline-flex items-center gap-1 ml-2 bg-white/15 px-2 py-0.5 rounded text-xs font-medium">
                <Globe className="w-3 h-3" /> Remote
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* LEFT: Content */}
          <div>
            {/* Key details bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {opp.deadline && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      Deadline
                    </div>
                    <p
                      className={`text-sm font-bold ${
                        isExpired ? "text-gray-400" : "text-red-600"
                      }`}
                    >
                      {formatDate(opp.deadline)}
                    </p>
                    {!isExpired && (
                      <p className="text-xs text-red-400 mt-0.5">
                        {formatRelativeDate(opp.deadline)} left
                      </p>
                    )}
                  </div>
                )}
                {opp.category && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Category
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      {opp.category}
                    </p>
                  </div>
                )}
                {opp.viewsCount !== undefined && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
                      <Eye className="w-3.5 h-3.5" />
                      Views
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      {opp.viewsCount}
                    </p>
                  </div>
                )}
                {opp.publishedAt && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      Posted
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      {formatRelativeDate(opp.publishedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {opp.externalApplyUrl ? (
                <a
                  href={opp.externalApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  disabled={isExpired}
                  className={`inline-flex items-center gap-2 px-6 py-3 bg-[#1a56db] hover:bg-[#1648b8] text-white font-semibold text-sm rounded-xl transition-colors no-underline ${
                    isExpired
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : ""
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  Apply Now
                </a>
              ) : (
                <a
                  href={`${siteConfig.whatsapp.link}?text=${encodeURIComponent(
                    `Hi JobReady, I'm interested in: ${opp.title} (${pageUrl})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-sm rounded-xl transition-colors no-underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  Apply via WhatsApp
                </a>
              )}
              <CopyLinkButton url={pageUrl} />
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-8 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                About This Opportunity
              </h2>
              {opp.description ? (
                <div
                  className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: opp.description }}
                />
              ) : (
                <p className="text-gray-500">
                  No detailed description available. Use the apply button above
                  to get more information.
                </p>
              )}
            </div>

            {/* Service nudge */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 md:p-6 mb-6">
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Boost Your Application
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                A professionally written CV and cover letter can significantly
                increase your chances of winning scholarships and opportunities.
              </p>
              <Link
                href="/cv-services"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#1a56db] hover:bg-[#1648b8] text-white font-semibold text-sm rounded-lg transition-colors no-underline"
              >
                Get Your CV Done — from KSh 500
              </Link>
            </div>

            {/* In-content ad */}
            <AdSlot position="inline" />

            {/* Related opportunities */}
            {similarOpportunities.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-5">
                  More {opp.opportunityType}s
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarOpportunities.map((item) => (
                    <OpportunityCard
                      key={item.id}
                      title={item.title}
                      slug={item.slug}
                      organizationName={item.organizationName}
                      opportunityType={item.opportunityType}
                      deadline={item.deadline}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="space-y-6">
            {/* Organization info */}
            {opp.organizationName && (
              <SidebarCard title="Organization" icon={null}>
                <div className="flex items-center gap-3 mb-3">
                  {opp.organizationLogo ? (
                    <img
                      src={opp.organizationLogo}
                      alt={opp.organizationName}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                      {opp.organizationName
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {opp.organizationName}
                    </p>
                    {opp.organizationType && (
                      <p className="text-xs text-gray-500">
                        {opp.organizationType}
                      </p>
                    )}
                  </div>
                </div>
              </SidebarCard>
            )}

            {/* CV CTA */}
            <CVReviewCTA />

            {/* Deadline reminder */}
            {opp.deadline && !isExpired && (
              <SidebarCard title="Deadline Reminder" icon={Clock}>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Closing in</p>
                  <p className="text-2xl font-extrabold text-red-600">
                    {formatRelativeDate(opp.deadline)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(opp.deadline)}
                  </p>
                </div>
              </SidebarCard>
            )}

            {opp.deadline && isExpired && (
              <SidebarCard title="Status" icon={Clock}>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm font-bold text-gray-400">
                    This opportunity has expired
                  </p>
                </div>
              </SidebarCard>
            )}

            {/* Ad */}
            <AdSlot position="sidebar" />

            {/* Newsletter */}
            <SidebarCard title="Get Opportunity Alerts" icon={null}>
              <p className="text-xs text-gray-500 mb-3">
                Never miss a scholarship or grant deadline.
              </p>
              <NewsletterForm type="opportunity_alerts" />
            </SidebarCard>
          </div>
        </div>
      </div>
    </>
  );
}
