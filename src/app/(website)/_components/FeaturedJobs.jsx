import Link from "next/link";
import { FiClock, FiFileText } from "react-icons/fi";
import { formatRelativeDate } from "@/lib/format";

export default function FeaturedJobs({ featuredJobs }) {
  const largeJob = featuredJobs?.[0];
  const smallJobs = featuredJobs?.slice(1, 3);

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl font-bold mb-5" style={{ color: "#1E293B" }}>
          Featured Jobs – Sponsored
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Job cards (2/3) */}
          <div className="md:col-span-2">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Left column: Large card */}
              <div>
                <div className="mb-2">
                  <Link
                    href="/cv-services"
                    className="text-sm font-medium text-teal-600 hover:text-purple-700 transition-colors"
                  >
                    Post your job here →
                  </Link>
                </div>
                {largeJob ? (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full">
                    <div className="relative">
                      {largeJob.featuredImage ? (
                        <img
                          src={largeJob.featuredImage}
                          alt={largeJob.title}
                          className="w-full h-56 object-cover"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gradient-to-br from-purple-100 to-teal-50" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-xl font-bold text-white">{largeJob.title}</h3>
                        <p className="text-sm text-white/80">
                          {largeJob.company?.name || ""}{largeJob.city ? ` – ${largeJob.city}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 flex-grow">
                      <div className="flex flex-wrap gap-2">
                        {largeJob.employmentType && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{largeJob.employmentType}</span>
                        )}
                        {largeJob.isRemote && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Remote</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
                        <FiClock className="w-3.5 h-3.5" />
                        Posted {formatRelativeDate(largeJob.createdAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden flex items-center justify-center h-64">
                    <p className="text-gray-400 text-sm">No featured jobs yet</p>
                  </div>
                )}
              </div>

              {/* Right column: Stacked small cards */}
              <div className="space-y-3">
                {smallJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.slug}`}
                    className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow no-underline"
                  >
                    <div className="relative">
                      {job.featuredImage ? (
                        <img
                          src={job.featuredImage}
                          alt={job.title}
                          className="w-full h-28 object-cover"
                        />
                      ) : (
                        <div className="w-full h-28 bg-gradient-to-br from-gray-100 to-gray-50" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <h3 className="font-bold text-sm text-white">{job.title}</h3>
                        <p className="text-xs text-white/80">
                          {job.company?.name || ""}{job.city ? ` – ${job.city}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="p-2">
                      {job.employmentType && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{job.employmentType}</span>
                        </div>
                      )}
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        Posted {formatRelativeDate(job.createdAt)}
                      </p>
                    </div>
                  </Link>
                ))}
                {smallJobs.length === 0 && (
                  <div className="bg-white rounded-xl shadow-md flex items-center justify-center h-28">
                    <p className="text-gray-400 text-sm">More featured jobs coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: CV promo card (1/3) */}
          <div>
            <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-5 rounded-xl border border-teal-200 text-center shadow-md h-full flex flex-col justify-center">
              <FiFileText className="w-8 h-8 mx-auto" style={{ color: "#5B21B6" }} />
              <h3 className="font-bold text-lg mt-1" style={{ color: "#1E293B" }}>
                📄 Land Your Dream Job Faster
              </h3>
              <p className="text-sm text-gray-600 my-2">
                ✅ Professional CV Writing (from KES 2,500)
                <br />
                ✅ Cover Letter &amp; Application Docs
                <br />
                ✅ Career Coaching
              </p>
              <Link
                href="/cv-services"
                className="inline-block w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
