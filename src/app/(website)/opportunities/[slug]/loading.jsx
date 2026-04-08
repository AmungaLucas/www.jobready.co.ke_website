export default function Loading() {
  return (
    <div className="py-8 md:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="animate-pulse space-y-6">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-64 bg-gray-200 rounded" />
          {/* Header skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="flex gap-2">
              <div className="h-8 w-24 bg-gray-200 rounded-full" />
              <div className="h-8 w-20 bg-gray-200 rounded-full" />
            </div>
          </div>
          {/* Description skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
            <div className="h-6 w-1/3 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-4/6 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
