/**
 * Service Tier Mapper — Transforms DB service_tiers data into
 * the format expected by the CV Services page components.
 *
 * Maps serviceType enums (CV_WRITING, COVER_LETTER, LINKEDIN_PROFILE)
 * to display names, icons, and descriptions used in the UI.
 */

// ─── Service Type → Display Config ─────────────────────────
export const SERVICE_DISPLAY_MAP = {
  CV_WRITING: {
    id: "cv-writing",
    displayName: "CV Writing",
    icon: "cv",
    description:
      "Professional CV written by experts who understand the Kenyan job market. ATS-optimized, keyword-rich, and tailored to your target role.",
  },
  COVER_LETTER: {
    id: "cover-letter",
    displayName: "Cover Letter Writing",
    icon: "letter",
    description:
      "Compelling cover letters that complement your CV and grab the recruiter's attention. Custom-written for each application.",
  },
  LINKEDIN_PROFILE: {
    id: "linkedin",
    displayName: "LinkedIn Profile Optimization",
    icon: "linkedin",
    description:
      "Transform your LinkedIn profile into a recruiter magnet. Optimize your headline, summary, and experience sections.",
  },
};

// ─── Popular Tier per Service Type ─────────────────────────
export const POPULAR_TIER_MAP = {
  CV_WRITING: "PROFESSIONAL",
  COVER_LETTER: null,
  LINKEDIN_PROFILE: null,
};

// ─── Service Type → DB Enum Mapping ────────────────────────
// Used by OrderModal to send the correct serviceType to the orders API
export const SERVICE_TYPE_MAP = {
  "cv-writing": "CV_WRITING",
  "cover-letter": "COVER_LETTER",
  "linkedin": "LINKEDIN_PROFILE",
};

// ─── Tier Name → DB Enum Mapping ───────────────────────────
// Used by OrderModal to send the correct tier to the orders API
export const TIER_NAME_MAP = {
  BASIC: "BASIC",
  PROFESSIONAL: "PROFESSIONAL",
  PREMIUM: "PREMIUM",
};

/**
 * Build an array of service objects from grouped DB tiers.
 * Each service has an id, name, description, icon, and an array of tier objects.
 *
 * @param {Record<string, Array>} groupedTiers  - { CV_WRITING: [...], COVER_LETTER: [...] }
 * @returns {Array} Service objects compatible with ServiceCard component
 */
export function buildServiceObjects(groupedTiers) {
  const services = [];

  for (const [serviceType, tiers] of Object.entries(groupedTiers)) {
    const config = SERVICE_DISPLAY_MAP[serviceType];
    if (!config) continue;

    const sortedTiers = [...tiers].sort((a, b) => a.sortOrder - b.sortOrder);
    const popularTier = POPULAR_TIER_MAP[serviceType];

    services.push({
      id: config.id,
      serviceType,
      name: config.displayName,
      description: config.description,
      icon: config.icon,
      tiers: sortedTiers.map((tier) => ({
        id: tier.id,
        name: tier.name,
        tier: tier.tier, // "BASIC", "PROFESSIONAL", "PREMIUM" — kept for OrderModal
        price: tier.price,
        currency: tier.currency,
        features: Array.isArray(tier.features) ? tier.features : [],
        deliveryDays: tier.deliveryDays,
        revisionCount: tier.revisionCount,
        popular: tier.tier === popularTier,
        description: tier.description,
      })),
    });
  }

  return services;
}

/**
 * Build the pricingComparison object for the PricingTable component
 * from CV_WRITING tiers in the database.
 *
 * Returns null if any of the three tiers (BASIC, PROFESSIONAL, PREMIUM) is missing.
 *
 * @param {Array} cvTiers - CV_WRITING tier objects from DB
 * @returns {Object|null} comparison object with features, basic, professional, premium
 */
export function buildPricingComparison(cvTiers) {
  if (!cvTiers || cvTiers.length === 0) return null;

  const tierMap = {};
  cvTiers.forEach((t) => {
    tierMap[t.tier] = t;
  });

  const basic = tierMap["BASIC"];
  const professional = tierMap["PROFESSIONAL"];
  const premium = tierMap["PREMIUM"];

  if (!basic || !professional || !premium) return null;

  // ── Helpers ──────────────────────────────────────────────
  const hasFeature = (features, keyword) =>
    Array.isArray(features) &&
    features.some((f) => f.toLowerCase().includes(keyword.toLowerCase()));

  const formatRevisions = (count) =>
    count >= 99 ? "Unlimited" : `${count} Revision${count !== 1 ? "s" : ""}`;

  const formatDelivery = (days) =>
    `${days} Day${days !== 1 ? "s" : ""}`;

  // ── Comparison Features ──────────────────────────────────
  const features = [
    "ATS-Optimized",
    "Professional Design",
    "Cover Letter Included",
    "Revisions",
    "Delivery Time",
    "LinkedIn Profile",
  ];

  const getValue = (tier, feature) => {
    switch (feature) {
      case "ATS-Optimized":
        return hasFeature(tier.features, "ATS") ? "Yes" : "No";
      case "Professional Design":
        return hasFeature(tier.features, "formatting") ||
          hasFeature(tier.features, "design")
          ? "Yes"
          : "Standard";
      case "Cover Letter Included":
        return hasFeature(tier.features, "cover letter") ? "Yes" : "No";
      case "Revisions":
        return formatRevisions(tier.revisionCount);
      case "Delivery Time":
        return formatDelivery(tier.deliveryDays);
      case "LinkedIn Profile":
        return hasFeature(tier.features, "LinkedIn") ? "Yes" : "No";
      default:
        return "—";
    }
  };

  return {
    features,
    basic: {
      name: basic.name,
      price: `KSh ${basic.price.toLocaleString()}`,
      values: features.map((f) => getValue(basic, f)),
    },
    professional: {
      name: professional.name,
      price: `KSh ${professional.price.toLocaleString()}`,
      popular: true,
      values: features.map((f) => getValue(professional, f)),
    },
    premium: {
      name: premium.name,
      price: `KSh ${premium.price.toLocaleString()}`,
      values: features.map((f) => getValue(premium, f)),
    },
  };
}
