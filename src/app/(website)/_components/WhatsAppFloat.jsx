"use client";

import { siteConfig } from "@/config/site-config";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloat() {
  return (
    <a
      href={siteConfig.whatsapp.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 no-underline group"
    >
      <FaWhatsapp className="w-6 h-6 animate-wa-fade" />
      <span className="hidden sm:inline text-sm font-semibold">Chat with us</span>
    </a>
  );
}
