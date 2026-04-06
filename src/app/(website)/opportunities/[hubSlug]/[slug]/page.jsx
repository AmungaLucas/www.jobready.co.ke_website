import OpportunityDetailClient from "./_components/OpportunityDetailClient";

// ─── Force dynamic rendering — no build-time DB dependency ───
export const dynamic = "force-dynamic";

// ─── Page Component (thin shell — all data fetched client-side via API) ───
export default async function OpportunityDetailPage({ params }) {
  const { hubSlug, slug } = await params;

  return <OpportunityDetailClient hubSlug={hubSlug} slug={slug} />;
}
