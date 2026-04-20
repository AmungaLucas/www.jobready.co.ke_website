"use client";

import Link from "next/link";

export default function WebsiteError({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-2xl">&#9888;&#65039;</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
          <p className="text-gray-500">
            An unexpected error occurred while loading this page.
            Please try again or go back to the homepage.
          </p>
          {error?.digest && (
            <p className="text-xs text-gray-400 font-mono">Error ID: {error.digest}</p>
          )}
        </div>
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="bg-gray-800 rounded-lg p-4 text-left overflow-auto max-h-48">
            <p className="text-red-400 text-xs font-semibold mb-2">Error Details:</p>
            <p className="text-red-300 text-xs font-mono whitespace-pre-wrap break-words">
              {error.message}
            </p>
            {error?.stack && (
              <pre className="text-gray-500 text-[10px] mt-2 whitespace-pre-wrap break-words">
                {error.stack}
              </pre>
            )}
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
