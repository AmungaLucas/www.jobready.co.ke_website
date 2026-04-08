import Link from "next/link";

const defaultCompanies = [
  { name: "Safaricom", slug: "safaricom", color: "#00a254" },
  { name: "Equity Bank", slug: "equity-bank", color: "#f7941d" },
  { name: "KCB Group", slug: "kcb-group", color: "#0033a0" },
  { name: "KRA", slug: "kenya-revenue-authority", color: "#006644" },
  { name: "UNDP Kenya", slug: "undp-kenya", color: "#006dcc" },
  { name: "Kenya Power", slug: "kenya-power", color: "#ff6600" },
  { name: "NCBA", slug: "ncba-group", color: "#e31b23" },
];

export default function TrustedByBar({ companies }) {
  const displayCompanies = companies && companies.length > 0 ? companies : defaultCompanies;

  return (
    <section className="bg-white border-b border-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-sm text-gray-400 font-medium mb-5 tracking-wide uppercase">
          Trusted by top employers in Kenya
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {displayCompanies.map((company) => (
            <Link
              key={company.name}
              href={`/organizations/${company.slug || company.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity no-underline"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden"
                style={{ backgroundColor: company.logoColor || company.color || "#5B21B6" }}
              >
                {company.logo ? (
                  <img src={company.logo} alt="" className="w-full h-full object-cover" />
                ) : (
                  company.name.charAt(0)
                )}
              </div>
              <span className="text-gray-500 text-sm font-medium whitespace-nowrap">
                {company.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
