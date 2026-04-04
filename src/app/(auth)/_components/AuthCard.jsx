export default function AuthCard({ children, showLogo = true }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:py-12">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#1a56db]/5" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#f59e0b]/5" />
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        {/* Logo */}
        {showLogo && (
          <div className="text-center mb-8">
            <a href="/" className="inline-flex items-center gap-2 no-underline">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#1a56db" />
                <path
                  d="M8 16l4 4 12-12"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-2xl font-extrabold text-[#1a56db]">
                JobReady<span className="text-gray-800">.co.ke</span>
              </span>
            </a>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
