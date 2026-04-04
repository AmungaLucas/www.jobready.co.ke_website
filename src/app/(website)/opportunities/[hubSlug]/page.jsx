import { notFound } from "next/navigation";
import Script from "next/script";
import { getOpportunityHubs, getHubBySlug } from "@/config/hub-config";
import { generateMeta, generateBreadcrumbJsonLd } from "@/lib/seo";
import HubContent from "./_components/HubContent";

export function generateStaticParams() {
  return getOpportunityHubs().map((hub) => ({ hubSlug: hub.slug }));
}

export async function generateMetadata({ params }) {
  const { hubSlug } = await params;
  const hub = getHubBySlug(hubSlug);
  if (!hub) return {};

  return generateMeta({
    title: hub.metaTitle || hub.name,
    description: hub.description,
    path: `/opportunities/${hub.slug}`,
  });
}

export default async function OpportunityHubPage({ params }) {
  const { hubSlug } = await params;
  const hub = getHubBySlug(hubSlug);

  if (!hub) notFound();

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
