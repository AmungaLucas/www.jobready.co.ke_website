import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { formatDate } from "@/lib/format";
import AdPlaceholder from "./AdPlaceholder";

export default function GovVacancies({ countyJobs, nationalJobs }) {
  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {/* Left: Ad placeholder */}
          <div className="flex flex-col">
            <AdPlaceholder height="250px" label="Sponsored" />
          </div>

          {/* Right: Government vacancies */}
          <div className="md:col-span-2">
            <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: "#1E293B" }}>
              Government Vacancies
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* County Government */}
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: "#5B21B6" }}>
                  County Government
                </h3>
                <div className="space-y-3">
                  {(countyJobs || []).map((job) => (
                    <div key={job.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0 text-gray-400 text-xs font-bold">
                        {job.county?.charAt(0) || "G"}
                      </div>
                      <div>
                        <div>
                          <Link
                            href={`/jobs/${job.slug}`}
                            className="hover:text-teal-600 transition-colors no-underline text-gray-800 text-sm font-medium"
                          >
                            {job.county || ""} – {job.title}
                          </Link>
                        </div>
                        {job.applicationDeadline && (
                          <div className="text-gray-400 text-xs">
                            Deadline: {formatDate(job.applicationDeadline)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {(countyJobs || []).length === 0 && (
                    <p className="text-gray-400 text-sm">No county government jobs at this time.</p>
                  )}
                </div>
                <div className="mt-3">
                  <Link
                    href="/jobs/government"
                    className="text-sm font-medium text-teal-600 hover:text-purple-700 transition-colors inline-flex items-center gap-1"
                  >
                    View all county jobs <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* National Government */}
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: "#5B21B6" }}>
                  National Government
                </h3>
                <div className="space-y-3">
                  {(nationalJobs || []).map((job) => (
                    <div key={job.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0 text-gray-400 text-xs font-bold">
                        {job.company?.name?.charAt(0) || "G"}
                      </div>
                      <div>
                        <div>
                          <Link
                            href={`/jobs/${job.slug}`}
                            className="hover:text-teal-600 transition-colors no-underline text-gray-800 text-sm font-medium"
                          >
                            {job.company?.name || ""} – {job.title}
                          </Link>
                        </div>
                        {job.applicationDeadline && (
                          <div className="text-gray-400 text-xs">
                            Deadline: {formatDate(job.applicationDeadline)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {(nationalJobs || []).length === 0 && (
                    <p className="text-gray-400 text-sm">No national government jobs at this time.</p>
                  )}
                </div>
                <div className="mt-3">
                  <Link
                    href="/jobs/government"
                    className="text-sm font-medium text-teal-600 hover:text-purple-700 transition-colors inline-flex items-center gap-1"
                  >
                    View all national jobs <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
