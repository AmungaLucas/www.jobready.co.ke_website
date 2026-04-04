import { notFound } from "next/navigation";
import Script from "next/script";
import { getJobHubs, getHubBySlug } from "@/config/hub-config";
import { generateMeta, generateBreadcrumbJsonLd } from "@/lib/seo";
import HubContent from "./_components/HubContent";

// ─── Static Generation ─────────────────────────────────────
export function generateStaticParams() {
  return getJobHubs().map((hub) => ({ hubSlug: hub.slug }));
}

// ─── Metadata ───────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { hubSlug } = await params;
  const hub = getHubBySlug(hubSlug);
  if (!hub) return {};

  return generateMeta({
    title: hub.metaTitle || hub.name,
    description: hub.description,
    path: `/jobs/${hub.slug}`,
  });
}

// ─── Page ───────────────────────────────────────────────────
export default async function JobHubPage({ params }) {
  const { hubSlug } = await params;
  const hub = getHubBySlug(hubSlug);

  if (!hub) notFound();

  return (
    <>
      <Script
        id={`job-hub-${hubSlug}-breadcrumb-jsonld`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Jobs", href: "/jobs" },
              { name: hub.name, href: `/jobs/${hub.slug}` },
            ])
          ),
        }}
      />
      <Script
        id={`job-hub-${hubSlug}-collection-jsonld`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: hub.name,
            description: hub.description,
            url: `https://jobready.co.ke/jobs/${hub.slug}`,
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
