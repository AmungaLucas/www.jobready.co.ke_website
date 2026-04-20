
const companies = [
  { name: "Safaricom", color: "#00a254" },
  { name: "Equity Bank", color: "#f7941d" },
  { name: "KCB Group", color: "#0033a0" },
  { name: "KRA", color: "#006644" },
  { name: "UNDP Kenya", color: "#006dcc" },
  { name: "Kenya Power", color: "#ff6600" },
  { name: "NCBA", color: "#e31b23" },
];

export default function TrustedByBar() {
  return (
    <section className="bg-white border-b border-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-sm text-gray-400 font-medium mb-5 tracking-wide uppercase">
          Trusted by top employers in Kenya
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {companies.map((company) => (
            <div
              key={company.name}
              className="flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: company.color }}
              >
                {company.name.charAt(0)}
              </div>
              <span className="text-gray-500 text-sm font-medium whitespace-nowrap">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
