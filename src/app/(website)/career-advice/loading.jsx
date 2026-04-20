export default function Loading() {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    </div>
  );
}
