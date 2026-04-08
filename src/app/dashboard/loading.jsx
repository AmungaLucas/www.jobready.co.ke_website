export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Skeleton Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white p-4 gap-4">
        {/* Sidebar header */}
        <div className="flex items-center gap-2 p-2 mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Nav items */}
        <div className="space-y-1 flex-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            >
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse shrink-0" />
              <div
                className="h-4 bg-gray-200 rounded animate-pulse"
                style={{ width: `${60 + (i % 3) * 20}%` }}
              />
            </div>
          ))}
        </div>

        {/* Sidebar footer */}
        <div className="border-t border-gray-100 pt-4 mt-auto space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse shrink-0" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </aside>

      {/* Skeleton Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Skeleton top bar */}
        <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 sm:px-6">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse hidden sm:block" />
          </div>
        </div>

        {/* Skeleton content area */}
        <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* Stats cards row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Content cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main card */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-28 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse shrink-0" />
                </div>
              ))}
            </div>

            {/* Side card */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-px bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
