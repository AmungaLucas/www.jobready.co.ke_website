import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { siteConfig } from "@/config/site-config";

export default function TopBar() {
  return (
    <div className="hidden md:block text-xs border-b border-[#5B21B6] bg-[#F3F4F6]">
      <div className="flex justify-between items-center py-1.5 px-4 md:px-6 lg:px-8 max-w-[1280px] mx-auto">
        {/* Left side: quick links */}
        <div className="flex items-center gap-3 whitespace-nowrap">
          {siteConfig.topBarLinks.map((link, i) => (
            <span key={link.href} className="flex items-center gap-3">
              {i > 0 && <span className="text-[#1E293B]">|</span>}
              <Link
                href={link.href}
                className={`transition hover:text-[#5B21B6] text-[#0D9488] ${
                  link.label === "CV Writing" ? "font-medium" : ""
                }`}
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>

        {/* Right side: WhatsApp, Career Advice, Our Services */}
        <div className="flex items-center gap-4 whitespace-nowrap">
          <Link
            href={siteConfig.whatsapp.links.general}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition hover:text-[#5B21B6] text-[#0D9488]"
          >
            <FaWhatsapp className="text-sm" />
            WhatsApp
          </Link>
          <Link
            href="/career-advice"
            className="transition hover:text-[#5B21B6] text-[#0D9488]"
          >
            Career Advice
          </Link>
          <Link
            href="/cv-services"
            className="transition hover:text-[#5B21B6] text-[#0D9488]"
          >
            Our Services
          </Link>
        </div>
      </div>
    </div>
  );
}
