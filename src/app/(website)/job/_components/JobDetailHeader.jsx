"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/config/site-config";
import {
  HiOutlineChatBubbleLeftRight,
  HiShieldCheck,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { Loader2 } from "lucide-react";
import ApplyModal from "./ApplyModal";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function JobDetailHeader({ job, isSaved: initialSaved = false, hasApplied: initialApplied = false }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const company = job.company || {};
  const initials = getInitials(company.name);

  // Determine apply button behavior
  const hasExternalUrl = !!job.applicationUrl;

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }

    if (!job.id) return;

    const nextSaved = !saved;
    setSaved(nextSaved);
    setSaving(true);

    try {
      if (nextSaved) {
        const res = await fetch("/api/saved-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: job.id }),
        });
        if (!res.ok && res.status !== 409) throw new Error("Save failed");
      } else {
        const res = await fetch("/api/saved-jobs", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: job.id }),
        });
        if (!res.ok && res.status !== 404) throw new Error("Unsave failed");
      }
    } catch (err) {
      setSaved(!nextSaved);
      console.error("Save/unsave failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const cvMessage = encodeURIComponent(
    `Hi JobReady, I need a professional CV for the "${job.title}" role at ${company.name}.`
  );
  const cvUrl = `${siteConfig.whatsapp.link}?text=${cvMessage}`;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header content */}
        <div className="p-5 md:p-7">
          {/* Company row */}
          <div className="flex items-center gap-3.5 mb-4">
            <Link href={`/organizations/${company.slug}`} className="shrink-0">
              <div
                className="w-[52px] h-[52px] rounded-lg flex items-center justify-center font-bold text-base text-white"
                style={{
                  background: company.logoColor
                    ? `linear-gradient(135deg, ${company.logoColor}, ${company.logoColor}dd)`
                    : "linear-gradient(135deg, #1a56db, #1e40af)",
                }}
              >
                {initials}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/organizations/${company.slug}`}
                  className="text-[0.95rem] font-bold text-gray-900 hover:text-[#1a56db] transition-colors no-underline"
                >
                  {company.name}
                </Link>
                {company.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-600 text-[0.7rem] font-semibold px-2 py-0.5 rounded-full">
                    <HiShieldCheck className="w-[13px] h-[13px]" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-[0.82rem] text-gray-500 mt-0.5">
                {company.industry || ""}
              </p>
            </div>
          </div>

          {/* Job title */}
          <h1 className="text-[1.5rem] md:text-[1.65rem] font-extrabold text-gray-900 leading-tight mb-4">
            {job.title}
          </h1>

          {/* Meta strip */}
          <div className="flex flex-wrap gap-4 py-4 border-t border-b border-gray-100">
            {job.location && (
              <span className="inline-flex items-center gap-1.5 text-[0.87rem] text-gray-600">
                <FiMapPin className="w-[17px] h-[17px] text-gray-400 shrink-0" />
                {job.location}
              </span>
            )}
            {job.employmentType && (
              <span className="inline-flex items-center gap-1.5 text-[0.87rem] text-gray-600">
                <FiBriefcase className="w-[17px] h-[17px] text-gray-400 shrink-0" />
                {job.employmentType}
              </span>
            )}
            {job.experienceLevel && (
              <span className="inline-flex items-center gap-1.5 text-[0.87rem] text-gray-600">
                <FiClock className="w-[17px] h-[17px] text-gray-400 shrink-0" />
                {job.experienceLevel}
              </span>
            )}
            {job.createdAt && (
              <span className="inline-flex items-center gap-1.5 text-[0.87rem] text-gray-600">
                <FiClock className="w-[17px] h-[17px] text-gray-400 shrink-0" />
                {formatRelativeDate(job.createdAt)}
              </span>
            )}
            {job.applicationDeadline && (
              <span className="inline-flex items-center gap-1.5 text-[0.87rem] text-gray-600">
                <FiClock className="w-[17px] h-[17px] text-gray-400 shrink-0" />
                Deadline: {formatDate(job.applicationDeadline)}
              </span>
            )}
            {job.positions && job.positions > 1 && (
              <span className="inline-flex items-center gap-1.5 text-[0.87rem] text-gray-600">
                <FiUsers className="w-[17px] h-[17px] text-gray-400 shrink-0" />
                {job.positions} Positions
              </span>
            )}
            {job.isRemote && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.75rem] font-bold bg-emerald-100 text-emerald-700">
                Remote
              </span>
            )}
          </div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 py-4">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-[0.78rem] font-semibold bg-[#dbeafe] text-[#1a56db]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-5 md:px-7 py-4 border-t border-gray-100 flex-wrap">
          {/* Already Applied — disabled state */}
          {initialApplied ? (
            <div className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-100 text-emerald-700 text-[0.85rem] font-bold">
              <HiOutlineCheckCircle className="w-[18px] h-[18px]" />
              Applied
            </div>
          ) : hasExternalUrl ? (
            /* External Apply — opens company's career page */
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#059669] text-white text-[0.85rem] font-bold hover:bg-[#047857] transition-colors no-underline"
            >
              <HiOutlineArrowTopRightOnSquare className="w-[18px] h-[18px]" />
              Apply on Company Site
            </a>
          ) : (
            /* In-app Apply — opens modal */
            <button
              onClick={() => setApplyOpen(true)}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#059669] text-white text-[0.85rem] font-bold hover:bg-[#047857] transition-colors cursor-pointer"
            >
              <HiOutlineChatBubbleLeftRight className="w-[18px] h-[18px]" />
              Apply Now
            </button>
          )}

          {/* Get CV Tailored */}
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#7c3aed] text-white text-[0.85rem] font-bold hover:bg-[#6d28d9] transition-colors no-underline"
          >
            <HiOutlineDocumentText className="w-[18px] h-[18px]" />
            Get CV Tailored
          </a>

          {/* Bookmark — connected to API */}
          <button
            onClick={handleSave}
            disabled={saving}
            title={saved ? "Remove from saved jobs" : isAuthenticated ? "Save this job" : "Sign in to save"}
            className={`w-12 h-12 rounded-lg border flex items-center justify-center cursor-pointer transition-all shrink-0 ${
              saved
                ? "border-amber-400 bg-amber-50 text-amber-500"
                : "border-gray-200 bg-white text-gray-400 hover:border-amber-400 hover:text-amber-400"
            } ${saving ? "opacity-60 cursor-wait" : ""}`}
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <FiHeart size={18} fill={saved ? "currentColor" : "none"} />
            )}
          </button>

          {/* Share */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: job.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="w-12 h-12 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-600 cursor-pointer transition-all shrink-0"
          >
            <FiShare2 size={18} />
          </button>
        </div>
      </div>

      {/* Apply Modal (in-app only, not for external URLs) */}
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
