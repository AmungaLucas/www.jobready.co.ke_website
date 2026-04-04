import { notFound } from "next/navigation";
import Script from "next/script";
import { getOpportunityHubs, getHubBySlug } from "@/config/hub-config";
import { generateMeta, generateBreadcrumbJsonLd } from "@/lib/seo";
import HubContent from "./_components/HubContent";
import OpportunityDetailContent from "./_components/OpportunityDetailContent";

export function generateStaticParams() {
  return getOpportunityHubs().map((hub) => ({ hubSlug: hub.slug }));
}

export async function generateMetadata({ params }) {
  const { hubSlug } = await params;

  // First check if it's a hub page
  const hub = getHubBySlug(hubSlug);
  if (hub) {
    return generateMeta({
      title: hub.metaTitle || hub.name,
      description: hub.description,
      path: `/opportunities/${hub.slug}`,
    });
  }

  // Otherwise try as an individual opportunity detail
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/opportunities/${hubSlug}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      if (data?.opportunity) {
        const opp = data.opportunity;
        return generateMeta({
          title: `${opp.title} — ${opp.organization || "Opportunity"}`,
          description: opp.description
            ? opp.description.replace(/<[^>]+>/g, "").substring(0, 160)
            : `Apply for ${opp.title} on JobReady Kenya.`,
          path: `/opportunities/${opp.slug}`,
        });
      }
    }
  } catch {
    // Ignore — will fall through to 404
  }

  return {};
}

export default async function OpportunityHubOrDetailPage({ params }) {
  const { hubSlug } = await params;

  // 1. Check if it's a known hub (e.g., scholarships, grants, etc.)
  const hub = getHubBySlug(hubSlug);
  if (hub) {
    return (
      <>
        <Script
          id={`opp-hub-${hubSlug}-breadcrumb-jsonld`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateBreadcrumbJsonLd([
                { name: "Home", href: "/" },
                { name: "Opportunities", href: "/opportunities" },
                { name: hub.name, href: `/opportunities/${hub.slug}` },
              ])
            ),
          }}
        />
        <Script
          id={`opp-hub-${hubSlug}-collection-jsonld`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: hub.name,
              description: hub.description,
              url: `https://jobready.co.ke/opportunities/${hub.slug}`,
              isPartOf: {
                "@type": "WebSite",
                name: "JobReady Kenya",
                url: "https://jobready.co.ke",
              },
            }),
          }}
        />
        <HubContent hub={hub} />
      </>
    );
  }

  // 2. Not a hub — try fetching as an individual opportunity
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/opportunities/${hubSlug}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.opportunity) {
        return <OpportunityDetailContent data={data} />;
      }
    }
  } catch (error) {
    console.error(
      `[OpportunityDetail] Failed to fetch opportunity ${hubSlug}:`,
      error
    );
  }

  // 3. Neither hub nor opportunity found
  notFound();
}
