import Link from "next/link";
import { siteConfig } from "@/config/site-config";

export default function TopBar() {
  return (
    <div className="bg-gray-900 text-gray-300 text-xs py-2 hidden md:flex">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full flex justify-between items-center">
        {/* Left links */}
        <div className="flex items-center gap-6">
          {siteConfig.topBarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right links */}
        <div className="flex items-center gap-6">
          <a
            href={siteConfig.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#25D366] font-semibold hover:text-[#20ba5a] transition-colors"
          >
            WhatsApp
          </a>
          <Link
            href="/career-advice"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Career Advice
          </Link>
          <Link
            href="/cv-services"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Our Services
          </Link>
        </div>
      </div>
    </div>
  );
}
