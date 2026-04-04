import { notFound } from "next/navigation";
import { generateMeta } from "@/lib/seo";
import OpportunityDetailContent from "../_components/OpportunityDetailContent";

export async function generateMetadata({ params }) {
  const { hubSlug, slug } = await params;

  try {
    const res = await fetch(`/api/opportunities/${slug}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.opportunity) {
        const opp = data.opportunity;
        return generateMeta({
          title: `${opp.title} — ${opp.organizationName || opp.organization || "Opportunity"}`,
          description: opp.description
            ? opp.description.replace(/<[^>]+>/g, "").substring(0, 160)
            : `Apply for ${opp.title} on JobReady Kenya.`,
          path: `/opportunities/${hubSlug}/${opp.slug}`,
        });
      }
    }
  } catch {
    // Ignore — will fall through to 404
  }

  return {};
}

export default async function OpportunityDetailPage({ params }) {
  const { hubSlug, slug } = await params;

  try {
    const res = await fetch(`/api/opportunities/${slug}`, {
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
      `[OpportunityDetail] Failed to fetch opportunity ${slug}:`,
      error
    );
  }

  notFound();
}
