import Link from "next/link";
import { formatDate } from "@/lib/format";

export default function RelatedJobsCard({ jobs = [], title = "Related Jobs", type = "job" }) {
  if (!jobs || jobs.length === 0) return null;

  const basePath = type === "opportunity" ? "/opportunities" : "/jobs";

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-lg font-bold mb-3 text-gray-900">{title}</h3>
      <div className="divide-y divide-gray-100">
        {jobs.map((item) => (
          <div key={item.id} className="py-3 first:pt-0 last:pb-0">
            <Link
              href={`${basePath}/${item.slug}`}
              className="font-semibold text-gray-800 hover:text-teal-600 transition-colors text-sm leading-snug"
            >
              {item.title}
              {item.company?.name && (
                <span className="font-normal text-gray-500"> – {item.company.name}</span>
              )}
            </Link>
            <div className="text-xs text-gray-500 mt-0.5">
              {[
                item.employmentType && item.employmentType.replace(/_/g, " "),
                item.opportunityType && item.opportunityType.replace(/_/g, " "),
                item.company?.county || item.company?.town,
              ]
                .filter(Boolean)
                .join(" • ")}
              {item.deadline && (
                <> &bull; Deadline: {formatDate(item.deadline)}</>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
