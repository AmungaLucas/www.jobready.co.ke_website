export default function OpportunityDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skeleton hero */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 md:py-14 animate-pulse">
          <div className="h-6 w-24 bg-white/20 rounded-full mb-4" />
          <div className="h-8 w-3/4 bg-white/20 rounded mb-3" />
          <div className="h-4 w-1/2 bg-white/20 rounded" />
        </div>
      </div>
      {/* Skeleton content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 h-24 animate-pulse" />
            <div className="bg-white rounded-xl shadow-sm p-8 h-64 animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 h-32 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
