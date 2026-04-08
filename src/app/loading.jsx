export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-5">
        {/* Spinning ring */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-[3px] border-gray-200" />
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#1a56db] animate-spin" />
        </div>

        {/* Logo text */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1a56db] rounded-md flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-800">
            Job<span className="text-[#1a56db]">Ready</span>
          </span>
        </div>

        {/* Loading text */}
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
