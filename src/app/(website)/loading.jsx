export default function WebsiteLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skeleton Nav Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-4 w-16 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
          {/* CTA */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Skeleton Hero Section */}
      <div className="bg-gradient-to-br from-[#1a56db] to-[#1544b0] py-16 sm:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            {/* Badge */}
            <div className="h-6 w-40 bg-white/20 rounded-full animate-pulse mx-auto mb-6" />
            {/* H1 */}
            <div className="h-10 sm:h-12 w-80 sm:w-[480px] bg-white/20 rounded-lg animate-pulse mx-auto mb-4" />
            {/* Subtitle line 1 */}
            <div className="h-4 w-96 max-w-full bg-white/15 rounded animate-pulse mx-auto mb-2" />
            {/* Subtitle line 2 */}
            <div className="h-4 w-72 max-w-full bg-white/15 rounded animate-pulse mx-auto mb-8" />
            {/* Search bar */}
            <div className="h-14 bg-white/20 rounded-xl animate-pulse max-w-xl mx-auto" />
            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-6 w-16 bg-white/20 rounded animate-pulse mx-auto mb-1" />
                  <div className="h-3 w-20 bg-white/15 rounded animate-pulse mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton Card Grid */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        {/* Section title */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-5 space-y-4"
            >
              {/* Company + save */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
              </div>
              {/* Title */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
              {/* Meta */}
              <div className="flex items-center gap-4">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
              {/* Bottom */}
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton for category section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-4 text-center space-y-3"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse mx-auto" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
                <div className="h-3 w-12 bg-gray-200 rounded animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
