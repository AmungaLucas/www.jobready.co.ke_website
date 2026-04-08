import Link from "next/link";
import { FiFileText, FiArrowRight } from "react-icons/fi";
import { HiAcademicCap } from "react-icons/hi";

const services = [
  {
    icon: FiFileText,
    title: "CV Writing",
    description: "Professional, ATS-optimized CV tailored to your target role.",
    price: "from KSh 500",
    href: "/cv-services",
  },
  {
    icon: HiAcademicCap,
    title: "Cover Letter Writing",
    description: "Compelling cover letters that get you noticed by recruiters.",
    price: "from KSh 500",
    href: "/cv-services",
  },
  {
    icon: FiFileText,
    title: "LinkedIn Profile Optimization",
    description: "Boost your visibility with an optimized LinkedIn profile.",
    price: "from KSh 800",
    href: "/cv-services",
  },
];

export default function CVServicesCTA() {
  return (
    <section className="bg-gradient-to-r from-purple-800 to-purple-900 rounded-xl p-6 sm:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">
          Professional CV & Career Services
        </h2>
        <p className="text-purple-200 text-sm">
          Stand out from thousands of applicants with expertly crafted documents.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg p-5 flex flex-col"
          >
            <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center mb-3">
              <service.icon className="w-5 h-5 text-teal-300" />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{service.title}</h3>
            <p className="text-purple-200 text-xs mb-3 flex-1">
              {service.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-teal-300 text-sm font-bold">{service.price}</span>
              <Link
                href={service.href}
                className="inline-flex items-center gap-1 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors no-underline"
              >
                Order Now <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
