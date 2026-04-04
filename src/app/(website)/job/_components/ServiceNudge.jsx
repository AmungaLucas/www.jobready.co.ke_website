import Link from "next/link";
import { FiFileText } from "react-icons/fi";

export default function ServiceNudge() {
  return (
    <div className="bg-white border border-gray-200 border-l-4 border-l-[#1a56db] rounded-lg p-5 px-6 mt-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
      <div className="w-10 h-10 bg-[#dbeafe] rounded-full flex items-center justify-center shrink-0">
        <FiFileText className="w-[18px] h-[18px] text-[#1a56db]" />
      </div>
      <div className="flex-1">
        <p className="text-[0.85rem] text-gray-600 leading-relaxed">
          Before you apply, get a professional CV that gets you shortlisted.{" "}
          <Link
            href="/cv-services"
            className="font-semibold text-[#1a56db] hover:text-[#1e40af] no-underline"
          >
            Get Your CV Done from KSh 500 &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
