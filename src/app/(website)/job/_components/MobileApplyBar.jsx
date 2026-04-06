"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/config/site-config";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import ApplyModal from "./ApplyModal";

export default function MobileApplyBar({ job, hasApplied: initialApplied = false }) {
  const [applyOpen, setApplyOpen] = useState(false);
  const company = job.company || {};
  const hasExternalUrl = !!job.externalApplyUrl;

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

        {/* Apply button — smart routing */}
        {initialApplied ? (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-100 text-emerald-700 text-[0.87rem] font-bold shrink-0">
            <HiOutlineCheckCircle className="w-[18px] h-[18px]" />
            Applied
          </div>
        ) : hasExternalUrl ? (
          <a
            href={job.externalApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#059669] text-white text-[0.87rem] font-bold hover:bg-[#047857] transition-colors no-underline shrink-0"
          >
            <HiOutlineArrowTopRightOnSquare className="w-[18px] h-[18px]" />
            Apply
          </a>
        ) : (
          <button
            onClick={() => setApplyOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#059669] text-white text-[0.87rem] font-bold hover:bg-[#047857] transition-colors cursor-pointer shrink-0"
          >
            <HiOutlineChatBubbleLeftRight className="w-[18px] h-[18px]" />
            Apply
          </button>
        )}
      </div>

      {/* Apply Modal */}
      {!hasExternalUrl && (
        <ApplyModal
          job={job}
          open={applyOpen}
          onOpenChange={setApplyOpen}
        />
      )}
    </>
  );
}
