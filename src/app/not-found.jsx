import Link from "next/link";
import Script from "next/script";
import { generateMeta, generateBreadcrumbJsonLd } from "@/lib/seo";
import {
  Search,
  Briefcase,
  ArrowRight,
  Home,
  BookOpen,
  FileText,
  Compass,
} from "lucide-react";
import TopBar from "@/app/(website)/_components/TopBar";
import Header from "@/app/(website)/_components/Header";
import Footer from "@/app/(website)/_components/Footer";
import WhatsAppFloat from "@/app/(website)/_components/WhatsAppFloat";

// ── SEO ──────────────────────────────────────────
export const metadata = generateMeta({
  title: "404 — Page Not Found",
  description:
    "The page you're looking for doesn't exist or has been moved. Browse jobs, find opportunities, or go back to the JobReady Kenya homepage.",
  path: "/404",
});

// ── JSON-LD ──────────────────────────────────────
const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "Home", href: "/" },
  { name: "Page Not Found", href: "/404" },
]);

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "404 — Page Not Found",
  description:
    "The page you're looking for doesn't exist or has been moved on JobReady Kenya.",
  url: "https://jobready.co.ke/404",
  isPartOf: {
    "@type": "WebSite",
    name: "JobReady Kenya",
    url: "https://jobready.co.ke",
  },
};

// ── Quick Links ──────────────────────────────────
const quickLinks = [
  {
    href: "/jobs",
    icon: Briefcase,
    label: "Browse Jobs",
    color: "text-blue-600 bg-blue-50",
  },
  {
    href: "/opportunities",
    icon: Compass,
    label: "Find Opportunities",
    color: "text-purple-600 bg-purple-50",
  },
  {
    href: "/career-advice",
    icon: BookOpen,
    label: "Career Advice",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    href: "/cv-services",
    icon: FileText,
    label: "CV Services",
    color: "text-amber-600 bg-amber-50",
  },
];

// ── Component ────────────────────────────────────
export default function NotFound() {
  return (
    <>
      <TopBar />
      <Header activeNav="" />
      {/* JSON-LD Structured Data */}
      <Script
        id="breadcrumb-jsonld-404"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <Script
        id="webpage-jsonld-404"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageJsonLd),
        }}
      />

      {/* Breadcrumb (visible) */}
      <nav aria-label="Breadcrumb" className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-4">
        <ol className="flex items-center gap-1.5 text-xs text-gray-500">
          <li>
            <Link href="/" className="hover:text-[#1a56db] transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <svg
              className="w-3.5 h-3.5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </li>
          <li>
            <span className="text-gray-700 font-medium">Page Not Found</span>
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Fun Illustration Element */}
          <div className="relative mb-8">
            {/* Background decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-[#1a56db]/5 animate-pulse" />
            </div>

            {/* Main 404 SVG */}
            <div className="relative inline-flex items-center justify-center">
              <svg
                className="w-40 h-40 sm:w-52 sm:h-52"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="#1a56db"
                  strokeWidth="3"
                  strokeDasharray="12 8"
                  opacity="0.2"
                />
                {/* Inner circle bg */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="#1a56db"
                  opacity="0.06"
                />
                {/* Magnifying glass */}
                <circle
                  cx="88"
                  cy="82"
                  r="32"
                  stroke="#1a56db"
                  strokeWidth="4"
                  fill="white"
                />
                <line
                  x1="112"
                  y1="106"
                  x2="138"
                  y2="132"
                  stroke="#1a56db"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Question mark inside glass */}
                <text
                  x="88"
                  y="92"
                  textAnchor="middle"
                  fontSize="36"
                  fontWeight="700"
                  fill="#1a56db"
                  fontFamily="system-ui, sans-serif"
                >
                  ?
                </text>
              </svg>

              {/* Floating badge */}
              <div className="absolute -top-2 -right-2 sm:top-0 sm:right-2 bg-white rounded-full shadow-lg p-2 border border-gray-100">
                <span className="text-lg sm:text-xl font-extrabold text-[#1a56db]">
                  404
                </span>
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Page Not Found
          </h1>

          {/* Message */}
          <p className="text-[0.95rem] text-gray-500 leading-relaxed mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Try searching for what you need or browse our popular sections below.
          </p>

          {/* Search Bar */}
          <form
            action="/search"
            className="flex items-center max-w-lg mx-auto mb-10"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="q"
                placeholder="Search for jobs, companies, skills..."
                className="w-full h-12 pl-12 pr-4 rounded-l-xl border border-r-0 border-gray-200 text-sm focus:outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20 transition-all"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-6 bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-sm rounded-r-xl transition-colors flex items-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col items-center gap-3 p-4 sm:p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1a56db]/20 transition-all no-underline"
              >
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center ${link.color} transition-transform group-hover:scale-110`}
                >
                  <link.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1a56db] transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Go Home Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-7 py-3 bg-[#1a56db] hover:bg-[#1544b0] text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all no-underline"
          >
            <Home className="w-4 h-4" />
            Go Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
