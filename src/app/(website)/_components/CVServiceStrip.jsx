import Link from "next/link";
import { FiFileText } from "react-icons/fi";

export default function CVServiceStrip() {
  return (
    <div className="mb-4 border-l-4 border-teal-500 bg-blue-50 p-4 rounded-r-lg">
      <p className="text-gray-700 text-sm">
        <FiFileText className="inline text-teal-600 mr-1" />
        Before you apply, get a professional CV that gets you shortlisted.{" "}
        <Link
          href="/cv-services"
          className="text-teal-600 font-medium hover:underline ml-1"
        >
          Get your CV done from Ksh 500
        </Link>
      </p>
    </div>
  );
}
