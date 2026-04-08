import Link from "next/link";
import { siteConfig } from "@/config/site-config";

/* ── Custom SVG: JobReady logo for footer (white variant) ── */
const LogoSvg = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#1a56db" />
    <path
      d="M8 16l4 4 12-12"
      stroke="#fff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-10">
          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[1.3rem] font-extrabold text-white no-underline mb-3.5"
            >
              <LogoSvg />
              JobReady<span className="text-gray-300">.co.ke</span>
            </Link>
            <p className="text-[0.87rem] leading-relaxed opacity-80">
              {siteConfig.footer.description}
            </p>
          </div>

          {/* Link columns */}
          {siteConfig.footer.columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-white text-[0.92rem] font-semibold mb-3.5">
                {column.title}
              </h4>
              <ul className="list-none">
                {column.links.map((link) => (
                  <li key={link.href} className="mb-[7px]">
                    <Link
                      href={link.href}
                      className="text-gray-400 text-[0.84rem] hover:text-white transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <span>{siteConfig.footer.copyright}</span>
          <div className="flex items-center gap-3 text-[0.78rem]">
            {siteConfig.footer.legalLinks.map((link, idx) => (
              <span key={link.href} className="flex items-center gap-3">
                <Link
                  href={link.href}
                  className="text-gray-500 hover:text-gray-300 transition-colors no-underline"
                >
                  {link.label}
                </Link>
                {idx < siteConfig.footer.legalLinks.length - 1 && (
                  <span className="text-gray-600">&middot;</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
