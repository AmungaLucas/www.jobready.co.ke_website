import Link from "next/link";
import { FiFileText, FiArrowRight } from "react-icons/fi";

export default function ServiceNudge() {
  return (
    <section className="bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-100 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
          <FiFileText className="w-5 h-5 text-purple-700" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Stand out with a professional CV
          </h3>
          <p className="text-xs text-gray-500">
            Our experts craft ATS-friendly CVs that get you interviews. Starting from KSh 500.
          </p>
        </div>
      </div>
      <Link
        href="/cv-services"
        className="inline-flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors no-underline shrink-0"
      >
        Get Your CV <FiArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
