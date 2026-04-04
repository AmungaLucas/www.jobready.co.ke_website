import Script from "next/script";
import { generateMeta, generateFAQJsonLd, generateServiceJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site-config";
import { db } from "@/lib/db";
import ServiceCard from "./_components/ServiceCard";
import HowItWorks from "./_components/HowItWorks";
import Testimonials from "./_components/Testimonials";
import PricingTable from "./_components/PricingTable";
import FAQAccordion from "./_components/FAQAccordion";
import {
  services as mockServices,
  pricingComparison as mockPricingComparison,
  testimonials,
  faqs,
  howItWorks,
} from "./_components/mock-data";
import {
  FiShield,
  FiClock,
  FiCheckCircle,
  FiMessageCircle,
} from "react-icons/fi";

export const dynamic = "force-dynamic";

export const metadata = generateMeta({
  title: "Professional CV Writing Services in Kenya — from KSh 500",
  description:
    "Get a professional CV written by experts. ATS-optimized, Kenya-market focused. CV writing from KSh 500, Cover Letters from KSh 300. 92% interview success rate. Fast delivery.",
  path: "/cv-services",
});

// ─── Static JSON-LD (FAQ + Breadcrumb don't depend on DB) ──
const faqItems = faqs.map((f) => ({ question: f.question, answer: f.answer }));
const faqJsonLd = generateFAQJsonLd(faqItems);
const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "Home", href: "/" },
  { name: "CV Services", href: "/cv-services" },
]);

// ─── Service config mapping (UI labels for each DB serviceType) ──
const SERVICE_CONFIG = {
  CV_WRITING: {
    id: "cv-writing",
    name: "CV Writing",
    description:
      "Professional CV written by experts who understand the Kenyan job market. ATS-optimized, keyword-rich, and tailored to your target role.",
    icon: "cv",
  },
  COVER_LETTER: {
    id: "cover-letter",
    name: "Cover Letter Writing",
    description:
      "Compelling cover letters that complement your CV and grab the recruiter's attention. Custom-written for each application.",
    icon: "letter",
  },
  LINKEDIN_PROFILE: {
    id: "linkedin",
    name: "LinkedIn Profile Optimization",
    description:
      "Transform your LinkedIn profile into a recruiter magnet. Optimize your headline, summary, and experience sections.",
    icon: "linkedin",
  },
};

// Desired display order for services
const SERVICE_ORDER = ["cv-writing", "cover-letter", "linkedin"];

// Tier enum → display name
const TIER_DISPLAY_NAME = {
  BASIC: "Basic",
  PROFESSIONAL: "Professional",
  PREMIUM: "Premium",
};

// ─── Data transformation: tiers → services array ──────────
function buildServices(tiers) {
  // Group tiers by serviceType
  const grouped = {};
  for (const tier of tiers) {
    if (!grouped[tier.serviceType]) grouped[tier.serviceType] = [];
    grouped[tier.serviceType].push(tier);
  }

  // Build services array
  const services = [];
  for (const [serviceType, serviceTiers] of Object.entries(grouped)) {
    const config = SERVICE_CONFIG[serviceType];
    if (!config) continue;

    const sortedTiers = [...serviceTiers].sort((a, b) => a.sortOrder - b.sortOrder);

    services.push({
      id: config.id,
      name: config.name,
      description: config.description,
      icon: config.icon,
      tiers: sortedTiers.map((t) => ({
        name: TIER_DISPLAY_NAME[t.tier] || t.tier,
        price: t.price,
        features: Array.isArray(t.features) ? t.features : [],
        popular: serviceType === "CV_WRITING" && t.tier === "PROFESSIONAL",
      })),
    });
  }

  // Sort services in the desired display order
  services.sort((a, b) => SERVICE_ORDER.indexOf(a.id) - SERVICE_ORDER.indexOf(b.id));

  return services;
}

// ─── Data transformation: CV tiers → pricingComparison ────
function buildPricingComparison(cvTiers) {
  const basic = cvTiers.find((t) => t.tier === "BASIC");
  const professional = cvTiers.find((t) => t.tier === "PROFESSIONAL");
  const premium = cvTiers.find((t) => t.tier === "PREMIUM");

  if (!basic || !professional || !premium) return null;

  const formatPrice = (price) => `KSh ${price.toLocaleString()}`;

  // Each row: a label shown in the table + an extract function per tier
  const comparisonRows = [
    {
      label: "ATS-Optimized",
      extract: (t) => (t.features.some((f) => /ats/i.test(f)) ? "Yes" : "No"),
    },
    {
      label: "Professional Design",
      extract: (t) => {
        if (t.features.some((f) => /executive/i.test(f))) return "Executive";
        if (t.features.some((f) => /ats.optimized/i.test(f))) return "Modern";
        if (t.features.some((f) => /professional format/i.test(f))) return "Modern";
        return "Standard";
      },
    },
    {
      label: "Cover Letter Included",
      extract: (t) => (t.features.some((f) => /cover letter/i.test(f)) ? "Yes" : "No"),
    },
    {
      label: "Number of Pages",
      extract: (t) => {
        const match = t.features.find((f) => /(\d+)-page/i.test(f));
        if (match) {
          const num = match.match(/(\d+)-page/i)[1];
          return `${num} Page${num > 1 ? "s" : ""}`;
        }
        return "Custom";
      },
    },
    {
      label: "Revisions",
      extract: (t) => {
        if (t.revisionCount >= 99) return "Unlimited";
        if (t.revisionCount === 1) return "1 Revision";
        return `${t.revisionCount} Revisions`;
      },
    },
    {
      label: "Delivery Time",
      extract: (t) => `${t.deliveryDays} Day${t.deliveryDays > 1 ? "s" : ""}`,
    },
    {
      label: "LinkedIn Optimization",
      extract: (t) => (t.features.some((f) => /linkedin/i.test(f)) ? "Yes" : "No"),
    },
    {
      label: "Personal Branding",
      extract: (t) =>
        t.features.some((f) => /branding|profile summary/i.test(f)) ? "Yes" : "No",
    },
    {
      label: "Industry Keywords",
      extract: (t) => (t.features.some((f) => /keyword/i.test(f)) ? "Yes" : "No"),
    },
    {
      label: "Achievement Highlighting",
      extract: (t) => (t.features.some((f) => /achievement/i.test(f)) ? "Yes" : "No"),
    },
  ];

  return {
    features: comparisonRows.map((r) => r.label),
    basic: {
      name: "Basic",
      price: formatPrice(basic.price),
      values: comparisonRows.map((r) => r.extract(basic)),
    },
    professional: {
      name: "Professional",
      price: formatPrice(professional.price),
      values: comparisonRows.map((r) => r.extract(professional)),
      popular: true,
    },
    premium: {
      name: "Premium",
      price: formatPrice(premium.price),
      values: comparisonRows.map((r) => r.extract(premium)),
    },
  };
}

// ─── Page Component ───────────────────────────────────────
export default async function CVServicesPage() {
  // Fetch all active service tiers from the database
  let allTiers = [];
  let dbFailed = false;
  try {
    allTiers = await db.serviceTier.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch service tiers:", error);
    dbFailed = true;
  }

  // Build dynamic services from DB, with fallback to mock data
  const services = dbFailed || allTiers.length === 0
    ? mockServices
    : buildServices(allTiers);

  const cvTiers = allTiers.filter((t) => t.serviceType === "CV_WRITING");
  const pricingComparison = dbFailed || cvTiers.length < 3
    ? mockPricingComparison
    : buildPricingComparison(cvTiers);

  // Build dynamic JSON-LD offers from DB
  const offers = cvTiers.map((t) => ({
    name: t.name,
    price: String(t.price),
  }));

  const cheapestPrice = cvTiers.length > 0
    ? Math.min(...cvTiers.map((t) => t.price))
    : 500;

  const serviceJsonLd = generateServiceJsonLd({
    name: "Professional CV Writing Services in Kenya",
    description: `Get a professional, ATS-optimized CV written by Kenyan market experts. ${offers.map((o) => `${o.name} from KSh ${Number(o.price).toLocaleString()}`).join(", ")}.`,
    url: `${siteConfig.url}/cv-services`,
    offers,
  });

  return (
    <>
      {/* JSON-LD */}
      {faqJsonLd && (
        <Script
          id="cv-faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Script
        id="cv-service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id="cv-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-1/3 -left-1/6 w-96 h-96 rounded-full bg-white/[0.03] pointer-events-none" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Trust badge */}
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold mb-5 border border-white/20">
              <FiCheckCircle size={14} />
              25,000+ Job Seekers Served
            </span>
            <h1 className="text-3xl md:text-[2.5rem] font-extrabold leading-tight mb-4 tracking-tight">
              Professional CV Writing Services in Kenya
            </h1>
            <p className="text-base opacity-85 leading-relaxed max-w-xl mx-auto mb-6">
              Stand out from hundreds of applicants. Our expert writers craft CVs that
              pass ATS systems and impress Kenyan recruiters.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <a
                href={`${siteConfig.whatsapp.link}?text=${encodeURIComponent("Hi JobReady, I'd like to order a CV writing service. Please share the details.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-sm font-bold hover:bg-[#20bd5a] transition-colors no-underline"
              >
                <FiMessageCircle size={18} />
                Chat on WhatsApp
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-blue-700 text-sm font-bold hover:bg-blue-50 transition-colors no-underline"
              >
                Get Started — from KSh {cheapestPrice.toLocaleString()}
              </a>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap text-center">
              <div>
                <p className="text-2xl font-extrabold">5,000+</p>
                <p className="text-xs opacity-70">CVs Written</p>
              </div>
              <div className="w-px h-8 bg-white/20 hidden sm:block" />
              <div>
                <p className="text-2xl font-extrabold">92%</p>
                <p className="text-xs opacity-70">Interview Rate</p>
              </div>
              <div className="w-px h-8 bg-white/20 hidden sm:block" />
              <div>
                <p className="text-2xl font-extrabold">24hr</p>
                <p className="text-xs opacity-70">Fast Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="services" className="py-14 md:py-16">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Our Services</h2>
            <p className="text-gray-500 text-sm">
              Professional documents tailored for the Kenyan job market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-gray-50 py-10 md:py-14 border-y border-gray-100">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {[
              { icon: FiShield, label: "ATS-Optimized" },
              { icon: FiShield, label: "Kenyan Experts" },
              { icon: FiClock, label: "Fast Turnaround" },
              { icon: FiCheckCircle, label: "Affordable Pricing" },
              { icon: FiCheckCircle, label: "Free Revisions" },
              { icon: FiMessageCircle, label: "WhatsApp Support" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center gap-2">
                <item.icon size={24} className="text-blue-600" />
                <span className="text-xs font-semibold text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <div className="container">
        <PricingTable comparison={pricingComparison} services={services} />
      </div>

      {/* How It Works */}
      <div className="container">
        <HowItWorks steps={howItWorks} />
      </div>

      {/* Testimonials */}
      <section className="bg-gray-50 py-14 md:py-16 border-y border-gray-100">
        <div className="container">
          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      {/* FAQ */}
      <div className="container">
        <FAQAccordion faqs={faqs} />
      </div>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute -top-1/3 -right-1/4 w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none" />
        <div className="container relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Ready to Land Your Dream Job?</h2>
          <p className="text-base opacity-85 max-w-lg mx-auto mb-6">
            Don&apos;t let a poorly written CV hold you back. Get a professional CV from
            KSh {cheapestPrice.toLocaleString()} and start getting interview callbacks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`${siteConfig.whatsapp.link}?text=${encodeURIComponent("Hi JobReady, I'd like to order a CV writing service. Please share the details.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#25D366] text-white text-sm font-bold hover:bg-[#20bd5a] transition-colors no-underline"
            >
              <FiMessageCircle size={18} />
              Get Your CV on WhatsApp
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-blue-700 text-sm font-bold hover:bg-blue-50 transition-colors no-underline"
            >
              View All Services
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
