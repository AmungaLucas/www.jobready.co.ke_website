import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JobCard from "./JobCard";

export default function JobCardGrid({
  jobs = [],
  title,
  icon: Icon,
  viewAllHref,
}) {
  if (!jobs.length) return null;

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-2">
          {Icon && (
            <span className="text-primary">
              <Icon size={20} />
            </span>
          )}
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors hover:no-underline"
          >
            View All
            <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 md:px-5 py-4 md:py-5">
          {jobs.map((job) => (
            <JobCard key={job.slug || job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
