"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiSend,
  FiClock,
  FiBriefcase,
  FiCheckCircle,
  FiShield,
  FiArrowRight,
  FiStar,
} from "react-icons/fi";
import AdSense from "@/components/AdSense";
import { formatLocation } from "@/lib/normalize";

function getCompanyInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ── CV Review CTA ── */
function CVReviewCTA() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 text-center">
      <div className="w-14 h-14 bg-amber-200 rounded-xl flex items-center justify-center mx-auto mb-3">
        <FiBriefcase className="w-7 h-7 text-amber-700" />
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">Get Your CV Reviewed</h3>
      <p className="text-xs text-gray-600 mb-3">
        Expert feedback on your CV format, content & ATS compatibility.
      </p>
      <p className="text-lg font-extrabold text-amber-700 mb-4">KSh 500</p>
      <Link
        href="/cv-services"
        className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors no-underline w-full justify-center"
      >
        Order Review <FiArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

/* ── Featured Jobs ── */
function FeaturedJobs({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
        <FiStar className="w-4 h-4 text-amber-500" />
        Featured Jobs
      </h3>
      <div className="space-y-3">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.slug}`}
            className="group flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors no-underline"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: job.company?.logoColor || "#5B21B6" }}
            >
              {getCompanyInitials(job.company?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 group-hover:text-purple-700 truncate transition-colors">
                {job.title}
              </p>
              <p className="text-[11px] text-gray-500 truncate">
                {job.company?.name} &middot; {formatLocation(job)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/jobs?featured=true"
        className="block text-center text-xs font-semibold text-purple-700 hover:text-purple-800 mt-3 pt-3 border-t border-gray-50 no-underline"
      >
        View all featured jobs
      </Link>
    </div>
  );
}

/* ── Top Employers ── */
function TopEmployers({ companies }) {
  if (!companies || companies.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
        <FiBriefcase className="w-4 h-4 text-purple-600" />
        Top Employers
      </h3>
      <div className="space-y-2">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/organizations/${company.slug}`}
            className="group flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors no-underline"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: company.logoColor || "#5B21B6" }}
            >
              {getCompanyInitials(company.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-gray-900 group-hover:text-purple-700 truncate transition-colors">
                  {company.name}
                </p>
                {company.isVerified && (
                  <FiCheckCircle className="w-3 h-3 text-teal-500 shrink-0" />
                )}
              </div>
            </div>
            <span className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full shrink-0">
              {(company._count?.jobs || company.jobCount || 0)} jobs
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Deadline Countdown ── */
function DeadlineCountdown({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
        <FiClock className="w-4 h-4 text-red-500" />
        Upcoming Deadlines
      </h3>
      <div className="space-y-2">
        {jobs.map((job) => {
          const daysLeft = job.applicationDeadline
            ? Math.max(0, Math.floor((new Date(job.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
            : null;

          return (
            <Link
              key={job.id}
              href={`/jobs/${job.slug}`}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 transition-colors no-underline"
            >
              <p className="text-xs font-medium text-gray-700 group-hover:text-purple-700 truncate mr-2 transition-colors">
                {job.title}
              </p>
              {daysLeft !== null && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    daysLeft <= 3
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {daysLeft === 0 ? "Today" : `${daysLeft}d left`}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ── Newsletter Signup ── */
function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), type: "career_tips" }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Subscribed! Check your inbox.");
        setEmail("");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-1">Weekly Career Tips</h3>
      <p className="text-xs text-gray-500 mb-3">
        Get job search tips, interview advice & career insights delivered weekly.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          className="flex-1 text-xs px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          {loading ? "..." : <FiSend className="w-4 h-4" />}
        </button>
      </form>
      {message && (
        <p className={`text-xs mt-2 ${message.includes("Subscribed") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
      <div className="flex items-center gap-1 mt-3 text-[11px] text-gray-400">
        <FiShield className="w-3 h-3" />
        No spam, unsubscribe anytime
      </div>
    </div>
  );
}

/* ── Ad Slot ── */
function AdSlot() {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-center">
      <AdSense />
      <p className="text-[10px] text-gray-400 mt-2">Advertisement</p>
    </div>
  );
}

/* ── Main Sidebar Export ── */
export default function HomeSidebar({ featuredJobs, topCompanies, deadlineJobs }) {
  return (
    <aside className="space-y-5">
      <CVReviewCTA />
      <FeaturedJobs jobs={featuredJobs} />
      <TopEmployers companies={topCompanies} />
      <DeadlineCountdown jobs={deadlineJobs} />
      <NewsletterSignup />
      <AdSlot />
    </aside>
  );
}
