"use client";

import { siteConfig } from "@/config/site-config";

/* ── Custom SVG: Full WhatsApp logo ── */
const WALogoSvg = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.503 3.94 1.394 5.624L0 24l6.518-1.358A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.93 0-3.747-.518-5.307-1.42l-.38-.227-3.938.82.833-3.836-.247-.394A9.773 9.773 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z" />
  </svg>
);

export default function WhatsAppFloat() {
  const waLink = `${siteConfig.whatsapp.link}?text=Hi%20JobReady%2C%20I%20need%20help`;

  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col items-end gap-2 md:bottom-6 md:right-6 bottom-20 right-4">
      {/* Tooltip — hidden on mobile */}
      <div className="hidden md:block bg-white shadow-md rounded-lg px-3.5 py-2 text-xs text-gray-600 whitespace-nowrap animate-pulse">
        Chat with us on{" "}
        <span className="font-semibold text-[#25D366]">WhatsApp</span>
      </div>

      {/* Floating button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all flex items-center justify-center no-underline md:w-14 md:h-14 w-12 h-12"
      >
        <WALogoSvg size={28} />
      </a>
    </div>
  );
}
