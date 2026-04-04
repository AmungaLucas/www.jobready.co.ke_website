import Link from "next/link";
import { FileText } from "lucide-react";

export default function CVReviewCTA() {
  return (
    <div className="bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 rounded-xl p-6 mb-7 text-center">
      {/* Title */}
      <h3 className="text-base font-bold text-amber-900 mb-2.5 flex items-center justify-center gap-2">
        <FileText size={20} className="text-amber-700" />
        Need a Professional CV?
      </h3>

      {/* Description */}
      <p className="text-sm text-amber-900/80 mb-5 leading-relaxed">
        Stand out from hundreds of applicants. Our expert writers craft CVs
        that get you shortlisted.
      </p>

      {/* CTA Button */}
      <Link
        href="/cv-services"
        className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-amber-900 text-white text-sm font-bold hover:bg-amber-800 transition-colors no-underline"
      >
        Get Your CV Done — KSh 500
      </Link>

      {/* Price */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="text-xs text-amber-600 line-through opacity-70">
          From KSh 800
        </span>
        <span className="text-sm font-extrabold text-amber-900">
          Now KSh 500
        </span>
      </div>
    </div>
  );
}
