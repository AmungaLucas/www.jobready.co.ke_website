/**
 * Skeleton loading components for homepage sections.
 * Used with React Suspense for progressive loading.
 */

export function HeroSkeleton() {
  return (
    <div className="relative bg-gradient-to-br from-teal-600 to-teal-800 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="h-10 w-3/4 bg-white/20 rounded animate-pulse mb-4" />
          <div className="h-6 w-1/2 bg-white/15 rounded animate-pulse mb-2" />
          <div className="h-6 w-2/3 bg-white/15 rounded animate-pulse mb-8" />
          <div className="flex gap-3">
            <div className="h-12 w-36 bg-white/20 rounded-lg animate-pulse" />
            <div className="h-12 w-36 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-1/2 bg-gray-100 rounded mb-1" />
          <div className="flex gap-2 mt-3">
            <div className="h-5 w-16 bg-teal-50 rounded-full" />
            <div className="h-5 w-20 bg-gray-50 rounded-full" />
            <div className="h-5 w-14 bg-gray-50 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          <div className="flex-1">
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DeadlineStripSkeleton() {
  return (
    <div className="bg-amber-50 border-y border-amber-200 animate-pulse">
      <div className="max-w-[1280px] mx-auto px-4 py-3">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="h-4 w-24 bg-amber-200 rounded flex-shrink-0" />
          <div className="h-4 w-48 bg-amber-100 rounded" />
          <div className="h-4 w-36 bg-amber-100 rounded" />
        </div>
      </div>
    </div>
  );
}

export function JobListSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
      {Array.from({ length: 5 }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TrendingSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-1" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
