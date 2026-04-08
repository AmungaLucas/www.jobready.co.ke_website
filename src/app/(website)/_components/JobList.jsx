import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { formatDate } from "@/lib/format";

export default function JobList({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: "#1E293B" }}>
        Latest Jobs in Kenya
      </h2>
      <div>
        {jobs.map((job) => (
          <div
            key={job.id}
            className="py-1"
            style={{ borderLeft: "3px solid #0D9488", paddingLeft: "0.75rem" }}
          >
            <Link
              href={`/jobs/${job.slug}`}
              className="clickable-text font-semibold text-gray-800 no-underline"
            >
              {job.title}
            </Link>
            <span className="text-gray-500 text-sm">
              {" "}- {job.company?.name || "Company"}{job.city ? ` - ${job.city}` : ""}
            </span>
            {job.applicationDeadline && (
              <div className="text-gray-400 text-xs">
                Deadline: {formatDate(job.applicationDeadline)}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        <Link
          href="/jobs"
          className="text-sm font-medium text-teal-600 hover:text-purple-700 transition-colors inline-flex items-center gap-1"
        >
          View all jobs <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
