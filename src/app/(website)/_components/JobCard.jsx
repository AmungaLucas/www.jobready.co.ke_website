"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Clock,
  Heart,
  ShieldCheck,
  Star,
  Zap,
  Sparkles,
  Loader2,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/format";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function JobCard({ job }) {
  // If the job already has an `isSaved` flag from API, use it as initial state
  const [saved, setSaved] = useState(job.isSaved || false);
  const [saving, setSaving] = useState(false);

  const {
    id,
    title,
    slug,
    company,
    location,
    jobType,
    experienceLevel,
    isFeatured,
    isNew,
    isUrgent,
    publishedAt,
  } = job;

  const companyName = company?.name || "Unknown";
  const companySlug = company?.slug || "";
  const companyLogoColor = company?.logoColor || null;
  const isVerified = company?.isVerified || false;
  const initials = getInitials(companyName);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id) return;

    // Optimistic toggle
    const nextSaved = !saved;
    setSaved(nextSaved);
    setSaving(true);

    try {
      if (nextSaved) {
        await fetch("/api/saved-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: id }),
        });
      } else {
        await fetch("/api/saved-jobs", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: id }),
        });
      }
    } catch (err) {
      // Revert on error
      setSaved(!nextSaved);
      console.error("Save/unsave failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-start gap-4 py-5 first:pt-0 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors cursor-pointer group">
      {/* Logo */}
      <Link
        href={`/organizations/${companySlug}`}
        className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm text-white"
        style={
          companyLogoColor
            ? {
                background: `linear-gradient(135deg, ${companyLogoColor}, ${companyLogoColor}dd)`,
              }
            : { background: "linear-gradient(135deg, #1a56db, #1e40af)" }
        }
      >
        {initials}
      </Link>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Link
            href={`/job/${slug}`}
            className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight line-clamp-1 hover:no-underline"
          >
            {title}
          </Link>

          {/* Badges */}
          {isFeatured && (
            <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[0.65rem] font-bold bg-amber-100 text-amber-900">
              <Star size={10} />
              Featured
            </span>
          )}
          {isNew && (
            <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[0.65rem] font-bold bg-emerald-100 text-emerald-700">
              <Sparkles size={10} />
              New
            </span>
          )}
          {isUrgent && (
            <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[0.65rem] font-bold bg-red-100 text-red-600">
              <Zap size={10} />
              Urgent
            </span>
          )}
        </div>

        {/* Company row */}
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
          <Link
            href={`/organizations/${companySlug}`}
            className="hover:text-primary transition-colors hover:no-underline text-gray-500"
          >
            {companyName}
          </Link>
          {isVerified && (
            <span className="inline-flex items-center gap-0.5 text-emerald-600 text-[0.65rem] font-semibold">
              <ShieldCheck size={12} />
              Verified
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex gap-4 text-xs text-gray-400 flex-wrap items-center">
          {location && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} />
              {location}
            </span>
          )}
          {jobType && (
            <span className="inline-flex items-center gap-1">
              <Briefcase size={14} />
              {jobType}
            </span>
          )}
          {experienceLevel && (
            <span className="inline-flex items-center gap-1">
              <Clock size={14} />
              {experienceLevel}
            </span>
          )}
          {publishedAt && (
            <span className="inline-flex items-center gap-1">
              <Clock size={14} />
              {formatRelativeDate(publishedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-[30px] h-[30px] rounded-full border shrink-0 flex items-center justify-center transition-all ${
          saved
            ? "border-amber-400 bg-amber-50 text-amber-500"
            : "border-gray-200 bg-white text-gray-400 hover:border-amber-400 hover:text-amber-400"
        } ${saving ? "opacity-60 cursor-wait" : ""}`}
        aria-label={saved ? "Unsave job" : "Save job"}
      >
        {saving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Heart size={14} fill={saved ? "currentColor" : "none"} />
        )}
      </button>
    </div>
  );
}
