import Script from "next/script";
import { db } from "@/lib/db";
import {
  buildServiceObjects,
  buildPricingComparison,
} from "@/lib/service-mapper";
import { generateMeta, generateFAQJsonLd, generateServiceJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site-config";
import ServiceCard from "./_components/ServiceCard";
import HowItWorks from "./_components/HowItWorks";
import Testimonials from "./_components/Testimonials";
import PricingTable from "./_components/PricingTable";
import FAQAccordion from "./_components/FAQAccordion";
import {
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

export const metadata = generateMeta({
  title: "Professional CV Writing Services in Kenya — from KSh 500",
  description:
    "Get a professional CV written by experts. ATS-optimized, Kenya-market focused. CV writing from KSh 500, Cover Letters from KSh 500. 92% interview success rate. Fast delivery.",
  path: "/cv-services",
});

// ─── JSON-LD ────────────────────────────────────────────────
const faqItems = faqs.map((f) => ({ question: f.question, answer: f.answer }));
const faqJsonLd = generateFAQJsonLd(faqItems);

const serviceJsonLd = generateServiceJsonLd({
  name: "Professional CV Writing Services in Kenya",
  description:
    "Get a professional, ATS-optimized CV written by Kenyan market experts. CV writing from KSh 500, Cover Letters from KSh 500, LinkedIn Profiles from KSh 800.",
  url: `${siteConfig.url}/cv-services`,
  offers: [
    { name: "Basic CV Writing", price: "500" },
    { name: "Professional CV Writing", price: "1500" },
    { name: "Premium CV Writing", price: "3500" },
  ],
});

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "Home", href: "/" },
  { name: "CV Services", href: "/cv-services" },
]);

export default async function CVServicesPage() {
  // ─── Fetch service tiers from DB ──────────────────────────
  let services = [];
  let pricingComparison = null;

  try {
    const allTiers = await db.serviceTier.findMany({
      where: { isActive: true },
      orderBy: [{ serviceType: "asc" }, { sortOrder: "asc" }],
    });

    // Group tiers by serviceType
    const grouped = allTiers.reduce((acc, tier) => {
      const key = tier.serviceType;
      if (!acc[key]) acc[key] = [];
      acc[key].push(tier);
      return acc;
    }, {});

    // Build service objects for ServiceCard components
    services = buildServiceObjects(grouped);

    // Build pricing comparison for CV Writing tiers
    const cvTiers = grouped["CV_WRITING"] || [];
    pricingComparison = buildPricingComparison(cvTiers);
  } catch (error) {
    console.error("[CV Services Page] Failed to fetch tiers:", error);
  }

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
                href={siteConfig.whatsapp.links.cvService}
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
                Get Started — from KSh 500
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
      {pricingComparison && (
        <div className="container">
          <PricingTable comparison={pricingComparison} services={services} />
        </div>
      )}

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
            KSh 500 and start getting interview callbacks.
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
