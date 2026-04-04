"use client";

import { formatDate } from "@/lib/format";
import { siteConfig } from "@/config/site-config";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

export default function MobileApplyBar({ job }) {
  const company = job.company || {};
  const whatsappMessage = encodeURIComponent(
    `Hi JobReady, I'm applying for "${job.title}" at ${company.name}. Please help me.`
  );
  const whatsappUrl = `${siteConfig.whatsapp.link}?text=${whatsappMessage}`;

  return (
    <>
      {/* Spacer so content doesn't hide behind the bar */}
      <div className="h-[70px] md:hidden" />

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-4 py-2.5 flex items-center gap-3 md:hidden">
        {/* Deadline info */}
        <div className="flex-1">
          {job.deadline ? (
            <p className="text-[0.75rem] text-red-500 font-semibold">
              Closes {formatDate(job.deadline)}
            </p>
          ) : (
            <p className="text-[0.75rem] text-gray-400">
              Open until filled
            </p>
          )}
        </div>

        {/* Apply button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#059669] text-white text-[0.87rem] font-bold hover:bg-[#047857] transition-colors no-underline shrink-0"
        >
          <HiOutlineChatBubbleLeftRight className="w-[18px] h-[18px]" />
          Apply
        </a>
      </div>
    </>
  );
}
