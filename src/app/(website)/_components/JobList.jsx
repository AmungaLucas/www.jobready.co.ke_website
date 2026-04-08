import Link from "next/link";
import {
  FiMapPin,
  FiClock,
  FiBookmark,
  FiBriefcase,
  FiCheckCircle,
} from "react-icons/fi";
import { formatRelativeDate } from "@/lib/format";

function getCompanyInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getBadge(job) {
  if (!job) return null;
  const badges = [];
  if (job.isFeatured) badges.push({ label: "Featured", color: "bg-amber-100 text-amber-800" });
  const isNew = job.createdAt && (Date.now() - new Date(job.createdAt).getTime()) < 3 * 24 * 60 * 60 * 1000;
  if (isNew) badges.push({ label: "New", color: "bg-green-100 text-green-800" });
  if (job.applicationDeadline) {
    const daysLeft = Math.floor(
      (new Date(job.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysLeft <= 3 && daysLeft >= 0) badges.push({ label: "Urgent", color: "bg-red-100 text-red-800" });
  }
  return badges;
}

function SaveButton({ jobId }) {
  return (
    <button
      type="button"
      aria-label="Save job"
      className="p-2 text-gray-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
    >
      <FiBookmark className="w-4 h-4" />
    </button>
  );
}

export default function JobList({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Latest Jobs</h2>
        <Link
          href="/jobs"
          className="text-sm text-purple-700 hover:text-purple-800 font-medium no-underline"
        >
          Browse all jobs
        </Link>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => {
          const badges = getBadge(job);
          const initials = getCompanyInitials(job.company?.name);
          const logoColor = job.company?.logoColor || "#5B21B6";

          return (
            <Link
              key={job.id}
              href={`/jobs/${job.slug}`}
              className="group flex items-start gap-3 bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md hover:border-purple-100 transition-all no-underline"
            >
              {/* Company logo */}
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ backgroundColor: logoColor }}
              >
                {initials}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500 truncate">
                        {job.company?.name}
                      </span>
                      {job.company?.isVerified && (
                        <FiCheckCircle className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      )}
                    </div>
                  </div>
                  <SaveButton jobId={job.id} />
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                  {job.location && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <FiMapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                  )}
                  {job.employmentType && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <FiBriefcase className="w-3 h-3" />
                      {job.employmentType}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <FiClock className="w-3 h-3" />
                    {formatRelativeDate(job.createdAt)}
                  </span>
                </div>

                {/* Badges */}
                {badges.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    {badges.map((badge) => (
                      <span
                        key={badge.label}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
