import Link from "next/link";
import { FiClock } from "react-icons/fi";

export default function ArticleTags({ tags }) {
  return (
    <div className="flex flex-wrap gap-2 mt-5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition-all cursor-pointer border border-transparent hover:border-blue-200"
        >
          <FiClock size={12} className="text-gray-400" />
          {tag}
        </span>
      ))}
    </div>
  );
}
