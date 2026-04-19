import {
  HeroSkeleton,
  DeadlineStripSkeleton,
  JobListSkeleton,
  TrendingSkeleton,
  CategoryGridSkeleton,
  JobCardSkeleton,
} from "./_components/Skeletons";

export default function Loading() {
  return (
    <>
      {/* Hero */}
      <HeroSkeleton />

      {/* Deadline strip */}
      <DeadlineStripSkeleton />

      {/* Featured jobs */}
      <section className="py-8 md:py-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-7 w-44 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="w-full h-28 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job list + Trending */}
      <section className="py-8 md:py-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <JobListSkeleton />
            <TrendingSkeleton />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          <CategoryGridSkeleton />
        </div>
      </section>

      {/* Gov vacancies */}
      <section className="py-8">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-7 w-56 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <JobCardSkeleton key={`c${i}`} />)}
            </div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <JobCardSkeleton key={`n${i}`} />)}
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-8">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-7 w-52 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                <div className="h-5 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-8 w-12 bg-teal-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career blog */}
      <section className="py-8">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-7 w-52 bg-gray-200 rounded animate-pulse mb-5" />
          <div className="grid md:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="w-full h-40 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-2/3 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-16" />
    </>
  );
}
