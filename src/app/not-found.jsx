import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Try searching or browse our popular sections below.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
          >
            Browse Jobs
          </Link>
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-semibold transition-colors"
          >
            Opportunities
          </Link>
        </div>
        <p className="text-sm text-gray-400">
          Or{" "}
          <Link href="/" className="text-teal-600 hover:underline">
            go back to the homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
