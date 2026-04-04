import Script from "next/script";
import { generateMeta, generateWebPageJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import Link from "next/link";
import {
  FiSearch,
  FiFileText,
  FiBookOpen,
  FiCheckCircle,
  FiTarget,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";

export const metadata = generateMeta({
  title: "About JobReady — Kenya's #1 Job Board & Career Platform",
  description:
    "Learn about JobReady.co.ke — Kenya's fastest-growing job board connecting over 50,000 job seekers with 10,000+ opportunities from 5,000+ companies. Founded in Kenya, built for Kenyans.",
  path: "/about",
});

const stats = [
  { value: "10,000+", label: "Jobs Listed" },
  { value: "5,000+", label: "Companies" },
  { value: "50,000+", label: "Job Seekers" },
  { value: "92%", label: "Success Rate" },
];

const services = [
  {
    icon: FiSearch,
    title: "Job Board",
    description:
      "Browse thousands of verified job listings from top employers across Kenya. Filter by category, location, experience level, and more.",
  },
  {
    icon: FiFileText,
    title: "CV Writing",
    description:
      "Get a professional, ATS-optimized CV written by Kenyan market experts. Starting from KSh 500 with 24-hour delivery.",
  },
  {
    icon: FiBookOpen,
    title: "Career Resources",
    description:
      "Access expert career advice, interview tips, salary negotiation guides, and scholarship opportunities — all tailored for Kenya.",
  },
];

const values = [
  {
    title: "Trust",
    description:
      "Every job listing is verified. We work directly with employers to ensure authenticity so you can apply with confidence.",
    icon: FiCheckCircle,
  },
  {
    title: "Accessibility",
    description:
      "Our platform is designed for every Kenyan job seeker — from fresh graduates to senior professionals — with mobile-first design.",
    icon: FiUsers,
  },
  {
    title: "Speed",
    description:
      "New jobs are posted daily. CVs are delivered in 24 hours. We move fast so you never miss an opportunity.",
    icon: FiTrendingUp,
  },
  {
    title: "Quality",
    description:
      "We don't compromise on quality. From job listings to career resources, every piece of content is reviewed by experts.",
    icon: FiTarget,
  },
];

const webPageJsonLd = generateWebPageJsonLd({
  name: "About JobReady Kenya",
  description:
    "Kenya's fastest-growing job board and career services platform. Connecting talented job seekers with real opportunities from verified employers.",
  url: "/about",
});

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
]);

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD */}
      <Script
        id="about-page-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <Script
        id="about-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a56db] to-[#1e3a8a] text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-1/3 -left-1/6 w-96 h-96 rounded-full bg-white/[0.03] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-[2.5rem] font-extrabold leading-tight mb-4 tracking-tight">
              About JobReady.co.ke
            </h1>
            <p className="text-base opacity-85 leading-relaxed max-w-xl mx-auto">
              Kenya&apos;s fastest-growing job board and career services platform.
              We connect talented job seekers with real opportunities from
              verified employers across the country.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed text-[0.95rem]">
              To democratize access to employment opportunities in Kenya by
              providing a reliable, user-friendly platform that bridges the gap
              between job seekers and employers. We believe every Kenyan deserves
              a fair shot at building a meaningful career — regardless of their
              background, location, or connections.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-12 md:py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Who We Are
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-[0.95rem]">
                <p>
                  JobReady.co.ke was founded with a simple yet powerful vision:
                  to make job searching in Kenya easier, faster, and more
                  transparent. Born and raised in Nairobi, our team understands
                  the unique challenges Kenyan job seekers face — from outdated
                  recruitment processes to lack of career guidance.
                </p>
                <p>
                  Since our launch, we&apos;ve grown from a small job board to
                  a comprehensive career platform serving thousands of job seekers
                  across all 47 counties. We&apos;ve partnered with hundreds of
                  companies — from startups and SMEs to multinational corporations
                  and government agencies — to bring you the most relevant and
                  up-to-date opportunities.
                </p>
                <p>
                  Our team of career coaches, CV writers, and tech experts work
                  tirelessly to ensure that every interaction on JobReady.co.ke
                  moves you one step closer to your next career milestone.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1a56db] to-[#1e3a8a] rounded-xl p-8 md:p-10 text-white">
              <h3 className="text-lg font-bold mb-6">Why JobReady?</h3>
              <ul className="space-y-4">
                {[
                  "Jobs verified directly with employers",
                  "CVs written by Kenyan market experts",
                  "Career advice tailored for Kenya",
                  "Mobile-first design for job seekers on the go",
                  "WhatsApp support for instant assistance",
                  "Free resources: templates, guides, scholarship info",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <FiCheckCircle
                      size={18}
                      className="text-[#f59e0b] mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm leading-relaxed opacity-90">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              What We Do
            </h2>
            <p className="text-gray-500 text-sm">
              Everything you need to land your next job
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <service.icon size={24} className="text-[#1a56db]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Impact — Stats */}
      <section className="py-12 md:py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Our Impact
            </h2>
            <p className="text-gray-500 text-sm">
              Numbers that speak for themselves
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100"
              >
                <p className="text-3xl md:text-4xl font-extrabold text-[#1a56db] mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Our Values
            </h2>
            <p className="text-gray-500 text-sm">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <value.icon size={22} className="text-[#1a56db]" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-[#1a56db] to-[#1e3a8a] text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute -top-1/3 -right-1/4 w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-base opacity-85 max-w-lg mx-auto mb-6">
            Join over 50,000 Kenyan job seekers who trust JobReady to connect
            them with their dream careers. Your next job is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#1a56db] text-sm font-bold hover:bg-blue-50 transition-colors no-underline"
            >
              <FiSearch size={18} />
              Browse Jobs
            </Link>
            <Link
              href="/cv-services"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/15 text-white text-sm font-bold hover:bg-white/25 transition-colors border border-white/20 no-underline"
            >
              Get Your CV Done
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
