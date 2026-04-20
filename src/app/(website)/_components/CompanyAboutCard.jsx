import Link from "next/link";
import { getInitials } from "@/lib/normalize";
import OptimizedImage from "@/components/OptimizedImage";

export default function CompanyAboutCard({ company }) {
  if (!company) return null;

  const { name, slug, logo, logoColor, industry, description, size } = company;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-lg font-bold mb-3 text-gray-900">About {name}</h3>
      <div className="flex items-center gap-3 mb-3">
        {logo ? (
          <OptimizedImage
            src={logo}
            alt={name}
            size="xl"
            rounded="full"
            className="bg-gray-100"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: logoColor || "#1a56db" }}
          >
            {getInitials(name)}
          </div>
        )}
        <div>
          <span className="font-semibold text-gray-900">{name}</span>
          <br />
          <span className="text-sm text-gray-500">
            {[industry, size].filter(Boolean).join(", ") || "Company"}
          </span>
        </div>
      </div>
      {description && (
        <p className="text-gray-600 text-sm line-clamp-4">{description}</p>
      )}
      {slug && (
        <Link
          href={`/organizations/${slug}`}
          className="inline-block mt-3 text-teal-600 hover:underline text-sm font-medium"
        >
          View all jobs at {name} &rarr;
        </Link>
      )}
    </div>
  );
}
