"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function WebsiteError({ error, reset }) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("Website error:", error);
  }, [error]);

  const errorMessage = error?.message || error?.digest || "Unknown error";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            We encountered an unexpected error while loading this page. This
            might be a temporary issue — please try again or head back to the
            homepage.
          </p>

          {/* Error details — always visible for debugging */}
          <div className="mb-6 p-3 bg-red-50 rounded-lg border border-red-100 text-left">
            <p className="text-xs text-red-600 font-mono break-all">
              {errorMessage}
            </p>
          </div>

          {/* Full stack toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-gray-400 hover:text-gray-600 mb-4 cursor-pointer"
          >
            {showDetails ? "Hide" : "Show"} details
          </button>
          {showDetails && error?.stack && (
            <pre className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100 text-left text-[10px] text-gray-500 overflow-auto max-h-40">
              {error.stack}
            </pre>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a56db] hover:bg-[#1544b0] text-white font-semibold text-sm rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-[#1a56db]/30 hover:text-[#1a56db] text-gray-700 font-semibold text-sm rounded-xl transition-colors no-underline"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>

        {/* Help text */}
        <p className="text-center text-xs text-gray-400 mt-6">
          If the problem persists, please{" "}
          <Link
            href="/contact"
            className="text-[#1a56db] hover:underline"
          >
            contact us
          </Link>{" "}
          or try again later.
        </p>
      </div>
    </div>
  );
}
