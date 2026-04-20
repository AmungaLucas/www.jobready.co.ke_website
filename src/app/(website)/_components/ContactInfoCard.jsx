"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site-config";

/**
 * Reusable contact info card for legal pages.
 * Imports all contact details from centralized site config,
 * so changing email/WhatsApp/domain happens in one place.
 *
 * @param {Object} props
 * @param {string[]} [props.show]  - Which contact lines to show.
 *   Options: "dpo", "payments", "support", "whatsapp", "contactPage"
 *   Default: ["dpo", "support", "contactPage"]
 * @param {string} [props.className] - Optional extra class for the wrapper div
 */
export default function ContactInfoCard({ show, className }) {
  const lines = show || ["dpo", "support", "contactPage"];

  return (
    <div className={`bg-gray-50 rounded-lg p-5 mt-4 border border-gray-100 ${className || ""}`}>
      <ul className="space-y-2 text-sm text-gray-600">
        <li>
          <strong className="text-gray-800">{siteConfig.companyLegalName}</strong>
        </li>

        {lines.includes("dpo") && (
          <li>
            Data Protection Officer:{" "}
            <a
              href={`mailto:${siteConfig.email.privacy}`}
              className="text-[#1a56db] hover:underline no-underline"
            >
              {siteConfig.email.privacy}
            </a>
          </li>
        )}

        {lines.includes("payments") && (
          <li>
            Payments:{" "}
            <a
              href={`mailto:${siteConfig.email.payments}`}
              className="text-[#1a56db] hover:underline no-underline"
            >
              {siteConfig.email.payments}
            </a>
          </li>
        )}

        {lines.includes("support") && (
          <li>
            General Support:{" "}
            <a
              href={`mailto:${siteConfig.email.support}`}
              className="text-[#1a56db] hover:underline no-underline"
            >
              {siteConfig.email.support}
            </a>
          </li>
        )}

        {lines.includes("whatsapp") && (
          <li>
            WhatsApp:{" "}
            <a
              href={siteConfig.whatsapp.link}
              className="text-[#1a56db] hover:underline no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.whatsapp.display}
            </a>
          </li>
        )}

        {lines.includes("contactPage") && (
          <li>
            Contact Page:{" "}
            <Link
              href="/contact"
              className="text-[#1a56db] hover:underline no-underline"
            >
              {siteConfig.domain}/contact
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
