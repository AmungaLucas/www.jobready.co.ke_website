"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate, formatCurrency, formatRelativeDate, formatJobType, formatExperienceLevel } from "@/lib/format";
import { siteConfig } from "@/config/site-config";
import { useAuth } from "@/lib/useSession";
import { FiUsers, FiMapPin } from "react-icons/fi";
import {
  HiOutlineChatBubbleLeftRight,
  HiShieldCheck,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { HiOutlineBriefcase } from "react-icons/hi2";
import AdSlot from "../../_components/AdSlot";
import SidebarCard from "../../_components/SidebarCard";
import CVReviewCTA from "../../_components/CVReviewCTA";
import JobCard from "../../_components/JobCard";
import ApplyModal from "./ApplyModal";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function JobDetailSidebar({ job, similarJobs = [], companyJobs = [], hasApplied: initialApplied = false }) {
  const { isAuthenticated } = useAuth();
  const [applyOpen, setApplyOpen] = useState(false);
  const company = job.company || {};

  const hasExternalUrl = !!job.externalApplyUrl;

  return (
    <aside>
      {/* Apply Card */}
      <div className="bg-gradient-to-br from-[#1a56db] to-[#1e40af] text-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-[0.95rem] font-bold text-white mb-4 pb-2.5 border-b border-white/20">
          Apply for this Position
        </h3>

        {/* Stats */}
        <div className="mb-4">
          <p className="text-[0.82rem] opacity-90 flex items-center gap-1.5 mb-1.5">
            <FiUsers className="w-4 h-4" />
            <strong>{job.applicationCount}</strong> people have applied
          </p>
        </div>

        {/* Deadline box */}
        {job.deadline && (
          <div className="bg-white/15 rounded-lg p-3 mb-4">
            <strong className="block text-[0.7rem] uppercase tracking-wider opacity-75 mb-1">
              Application Deadline
            </strong>
            <span className="text-[1.05rem] font-bold">
              {formatDate(job.deadline)}
            </span>
          </div>
        )}

        {/* Salary display */}
        {job.showSalary && (job.salaryMin || job.salaryMax) && !job.isSalaryNegotiable && (
          <div className="text-center py-3 mb-4">
            <div className="text-[1.5rem] font-extrabold text-white">
              {job.salaryMin && job.salaryMax
                ? `${formatCurrency(job.salaryMin)} – ${formatCurrency(job.salaryMax)}`
                : formatCurrency(job.salaryMin || job.salaryMax)}
            </div>
            <div className="text-[0.82rem] text-gray-300">/ {job.salaryPeriod ? job.salaryPeriod.toLowerCase() : "month"}</div>
            <div className="h-1.5 bg-white/20 rounded-full mt-3 mb-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#059669] to-[#34d399] rounded-full"
                style={{ width: "70%" }}
              />
            </div>
            <div className="flex justify-between text-[0.75rem] text-gray-400">
              <span>{formatCurrency(job.salaryMin)}</span>
              <span>{formatCurrency(job.salaryMax)}</span>
            </div>
          </div>
        )}

        {/* Negotiable salary indicator */}
        {job.showSalary && job.isSalaryNegotiable && (
          <div className="text-center py-3 mb-4">
            <div className="text-[1.1rem] font-bold text-white">
              Salary Negotiable
            </div>
            {job.salaryMin && (
              <div className="text-[0.82rem] text-gray-300 mt-1">
                From {formatCurrency(job.salaryMin)} / {job.salaryPeriod ? job.salaryPeriod.toLowerCase() : "month"}
              </div>
            )}
          </div>
        )}

        {/* Overview */}
        <ul className="list-none p-0 mb-4">
          {job.location && (
            <li className="flex justify-between items-start py-2.5 border-b border-white/10 text-[0.87rem] gap-3">
              <span className="text-gray-300 font-medium shrink-0">Location</span>
              <span className="text-white font-semibold text-right">{job.location}</span>
            </li>
          )}
          {job.jobType && (
            <li className="flex justify-between items-start py-2.5 border-b border-white/10 text-[0.87rem] gap-3">
              <span className="text-gray-300 font-medium shrink-0">Job Type</span>
              <span className="text-white font-semibold text-right">{formatJobType(job.jobType)}</span>
            </li>
          )}
          {job.experienceLevel && (
            <li className="flex justify-between items-start py-2.5 border-b border-white/10 text-[0.87rem] gap-3">
              <span className="text-gray-300 font-medium shrink-0">Experience</span>
              <span className="text-white font-semibold text-right">{formatExperienceLevel(job.experienceLevel)}</span>
            </li>
          )}
          {job.category && (
            <li className="flex justify-between items-start py-2.5 border-b border-white/10 text-[0.87rem] gap-3">
              <span className="text-gray-300 font-medium shrink-0">Category</span>
              <span className="text-white font-semibold text-right">{job.category.replace(/_/g, ' ')}</span>
            </li>
          )}
          {job.positions && job.positions > 1 && (
            <li className="flex justify-between items-start py-2.5 border-b border-white/10 text-[0.87rem] gap-3">
              <span className="text-gray-300 font-medium shrink-0">Openings</span>
              <span className="text-white font-semibold text-right">{job.positions} Position{job.positions > 1 ? 's' : ''}</span>
            </li>
          )}
        </ul>

        {/* Apply button — smart routing */}
        {initialApplied ? (
          /* Already Applied */
          <div className="block w-full text-center px-5 py-3 rounded-lg bg-white/20 text-white text-[0.9rem] font-bold mb-2.5">
            <span className="inline-flex items-center gap-2">
              <HiOutlineCheckCircle className="w-[18px] h-[18px]" />
              Applied
            </span>
          </div>
        ) : hasExternalUrl ? (
          /* External Apply */
          <a
            href={job.externalApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-5 py-3 rounded-lg bg-white text-[#1a56db] text-[0.9rem] font-bold hover:bg-gray-100 transition-colors no-underline mb-2.5"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <HiOutlineArrowTopRightOnSquare className="w-[18px] h-[18px]" />
              Apply on Company Site
            </span>
          </a>
        ) : (
          /* In-app Apply */
          <button
            onClick={() => setApplyOpen(true)}
            className="block w-full text-center px-5 py-3 rounded-lg bg-white text-[#1a56db] text-[0.9rem] font-bold hover:bg-gray-100 transition-colors cursor-pointer mb-2.5"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <HiOutlineChatBubbleLeftRight className="w-[18px] h-[18px]" />
              Apply Now
            </span>
          </button>
        )}

        <p className="text-center text-[0.78rem] opacity-70">
          Free to apply. No middlemen.
        </p>
      </div>

      {/* CV Review CTA */}
      <CVReviewCTA />

      {/* Ad Slot */}
      <AdSlot position="sidebar" />

      {/* Similar Jobs */}
      <SidebarCard title="Similar Jobs" icon={() => (
        <HiOutlineBriefcase className="w-[18px] h-[18px]" />
      )}>
        <div>
          {similarJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          <Link
            href="/jobs"
            className="block text-center pt-3 text-[0.84rem] font-semibold text-[#1a56db] border-t border-gray-100 mt-1.5 no-underline hover:text-[#1e40af]"
          >
            View All Jobs
          </Link>
        </div>
      </SidebarCard>

      {/* More from Company */}
      {companyJobs.length > 0 && (
        <SidebarCard title={`More from ${company.name}`} icon={() => (
          <HiShieldCheck className="w-[18px] h-[18px]" />
        )}>
          <div>
            {companyJobs.map((job) => {
              const initials = getInitials(company.name);
              return (
                <Link
                  key={job.id}
                  href={`/job/${job.slug}`}
                  className="flex gap-2.5 py-2.5 border-b border-gray-100 last:border-b-0 group"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-[0.7rem] font-bold text-white"
                    style={{
                      background: company.logoColor
                        ? `linear-gradient(135deg, ${company.logoColor}, ${company.logoColor}dd)`
                        : "linear-gradient(135deg, #1a56db, #1e40af)",
                    }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[0.88rem] font-semibold text-gray-800 group-hover:text-[#1a56db] transition-colors leading-tight">
                      {job.title}
                    </h4>
                    <div className="flex gap-2.5 mt-1 text-[0.75rem] text-gray-500">
                      {job.location && <span>{job.location}</span>}
                      {job.jobType && <span>&middot; {job.jobType}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
            <Link
              href={`/organizations/${company.slug}`}
              className="block text-center pt-3 text-[0.84rem] font-semibold text-[#1a56db] border-t border-gray-100 mt-1.5 no-underline hover:text-[#1e40af]"
            >
              View All {company.name} Jobs
            </Link>
          </div>
        </SidebarCard>
      )}

      {/* Ad */}
      <AdSlot position="sidebar" />

      {/* Apply Modal */}
      {!hasExternalUrl && (
        <ApplyModal
          job={job}
          open={applyOpen}
          onOpenChange={setApplyOpen}
        />
      )}
    </aside>
  );
}
