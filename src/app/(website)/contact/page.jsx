import Script from "next/script";
import { generateMeta, generateContactPageJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site-config";
import ContactForm from "./_components/ContactForm";
import {
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiMapPin,
  FiClock,
} from "react-icons/fi";

export const metadata = generateMeta({
  title: "Contact Us — JobReady Kenya",
  description:
    "Get in touch with JobReady.co.ke. Reach us via email, phone, WhatsApp, or visit our Nairobi office. We're here to help you find your next opportunity.",
  path: "/contact",
});

const contactPageJsonLd = generateContactPageJsonLd();

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
]);

const contactInfo = [
  {
    icon: FiMail,
    title: "Email",
    detail: siteConfig.email.support,
    description: "We reply within 24 hours",
  },
  {
    icon: FiPhone,
    title: "Phone",
    detail: siteConfig.whatsapp.display,
    description: "Mon-Fri, 8am - 6pm EAT",
  },
  {
    icon: FiMessageCircle,
    title: "WhatsApp",
    detail: "Chat with us instantly",
    description: "Fastest way to reach us",
    href: `${siteConfig.whatsapp.link}?text=${encodeURIComponent("Hi JobReady, I need help. Please assist me.")}`,
  },
  {
    icon: FiMapPin,
    title: "Office",
    detail: "Nairobi, Kenya",
    description: "Westlands area",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* JSON-LD */}
      <Script
        id="contact-page-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      <Script
        id="contact-breadcrumb-jsonld"
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
              Get in Touch
            </h1>
            <p className="text-base opacity-85 leading-relaxed max-w-xl mx-auto">
              Have a question, feedback, or need help? We&apos;d love to hear
              from you. Our team is ready to assist you on your career journey.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content — Two-column layout */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
            {/* Left: Contact Form */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Send Us a Message
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Fill out the form below and we&apos;ll get back to you within 24
                hours.
              </p>
              <ContactForm />
            </div>

            {/* Right: Contact Info */}
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <item.icon size={20} className="text-[#1a56db]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                        {item.title}
                      </h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#1a56db] font-semibold hover:underline no-underline"
                        >
                          {item.detail}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-700 font-medium">
                          {item.detail}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Office Hours */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <FiClock size={18} className="text-[#f59e0b]" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Office Hours
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium text-gray-800">
                      8:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-gray-800">
                      9:00 AM - 1:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-gray-400">Closed</span>
                  </div>
                  <p className="text-xs text-gray-400 pt-1">
                    All times in East Africa Time (EAT / UTC+3)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
