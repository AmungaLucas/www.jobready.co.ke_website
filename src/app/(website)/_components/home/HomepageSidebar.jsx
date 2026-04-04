import Link from "next/link";
import {
  FiHome,
  FiClock,
  FiMapPin,
  FiFileText,
  FiSend,
} from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi2";
import CVReviewCTA from "../CVReviewCTA";
import SidebarCard from "../SidebarCard";
import NewsletterForm from "../NewsletterForm";
import AdSlot from "../AdSlot";
import {
  topEmployers,
  sidebarFeaturedJobs,
  sidebarDeadlines,
  locations,
} from "./mock-data";
import { siteConfig } from "@/config/site-config";

export default function HomepageSidebar() {
  return (
    <aside className="w-full">
      {/* 1. CV Review CTA */}
      <CVReviewCTA />

      {/* 2. Ad Slot */}
      <AdSlot position="sidebar" />

      {/* 3. Top Employers */}
      <SidebarCard title="Top Employers" icon={FiHome}>
        <div>
          {topEmployers.map((emp) => (
            <div
              key={emp.slug}
              className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-b-0"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-[0.72rem]"
                style={{
                  background: `linear-gradient(135deg, ${emp.logoColor}, ${emp.logoColor}dd)`,
                }}
              >
                {emp.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <Link
                href={`/organizations/${emp.slug}`}
                className="flex-1 text-[0.85rem] font-semibold text-gray-800 hover:text-primary transition-colors no-underline"
              >
                {emp.name}
              </Link>
              <span className="text-[0.78rem] font-bold text-[#f59e0b] bg-[#fef3c7] px-2.5 py-0.5 rounded-full whitespace-nowrap">
                {emp.jobCount} jobs
              </span>
            </div>
          ))}
          <Link
            href="/organizations"
            className="block text-center py-3 text-[0.84rem] font-semibold text-primary border-t border-gray-100 mt-1.5 no-underline"
          >
            View All Companies &rarr;
          </Link>
        </div>
      </SidebarCard>

      {/* 4. Featured Jobs */}
      <SidebarCard title="Featured Jobs" icon={FiSend}>
        <div>
          {sidebarFeaturedJobs.map((job) => (
            <div
              key={job.slug}
              className="flex gap-3 py-3 border-b border-gray-100 last:border-b-0"
            >
              <div
                className="w-[38px] h-[38px] rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-[0.75rem]"
                style={{
                  background: `linear-gradient(135deg, ${job.logoColor}, ${job.logoColor}dd)`,
                }}
              >
                {job.company
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/jobs/${job.slug}`}
                  className="block text-[0.85rem] font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis hover:text-primary transition-colors no-underline"
                >
                  {job.title}
                </Link>
                <p className="text-[0.77rem] text-gray-500 mt-0.5">
                  {job.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SidebarCard>

      {/* 5. Urgent Deadlines */}
      <SidebarCard title="Urgent Deadlines" icon={FiClock}>
        <div>
          {sidebarDeadlines.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-b-0"
            >
              <span className="text-[0.82rem] text-gray-700 font-medium">
                {item.name}
              </span>
              <span className="text-[0.78rem] font-bold text-red-500 flex items-center gap-1">
                <FiClock className="w-[13px] h-[13px]" />
                {item.timeLeft}
              </span>
            </div>
          ))}
        </div>
      </SidebarCard>

      {/* 6. Job Alerts / Newsletter */}
      <SidebarCard title="Get Job Alerts" icon={FiSend}>
        <p className="text-[0.82rem] text-gray-500 mb-1">
          Never miss a deadline. Get daily job alerts delivered to your inbox.
        </p>
        <NewsletterForm type="job_alerts" />
      </SidebarCard>

      {/* 7. Browse by Location */}
      <SidebarCard title="Browse by Location" icon={FiMapPin}>
        <div className="flex flex-wrap gap-2">
          {locations.map((loc) => (
            <Link
              key={loc.href}
              href={loc.href}
              className={`px-3.5 py-1.5 border rounded-full text-[0.8rem] font-medium transition-all no-underline ${
                loc.highlight
                  ? "bg-[#dbeafe] border-[#1a56db] text-[#1a56db] font-semibold"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
              }`}
            >
              {loc.label}
            </Link>
          ))}
        </div>
      </SidebarCard>

      {/* 8. Our Services CTA (blue gradient) */}
      <div className="bg-gradient-to-br from-[#1a56db] to-[#1e3a8a] text-white rounded-xl p-6 mb-7 shadow-sm">
        <h3 className="text-[0.95rem] font-bold mb-3.5 pb-2.5 border-b border-white/20 flex items-center gap-2 text-white">
          <FiFileText className="w-[18px] h-[18px]" />
          Our Services
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { label: "CV Writing", price: "from KSh 500", icon: FiFileText },
            { label: "Cover Letter", price: "from KSh 500", icon: FiSend },
            {
              label: "LinkedIn Optimization",
              price: "KSh 1,000",
              icon: FiSend,
            },
          ].map((svc) => (
            <Link
              key={svc.label}
              href="/cv-services"
              className="flex items-center gap-2.5 px-3 py-2.5 bg-white/10 rounded-lg text-white text-[0.85rem] font-semibold hover:bg-white/20 transition-all no-underline"
            >
              <svc.icon className="w-[18px] h-[18px] shrink-0" />
              {svc.label} &mdash; {svc.price}
            </Link>
          ))}
        </div>
        <a
          href={`${siteConfig.whatsapp.link}?text=${encodeURIComponent("Hi JobReady, I need document writing help")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3.5 w-full inline-flex items-center justify-center px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-[0.85rem] font-semibold rounded-lg transition-colors no-underline"
        >
          Chat on WhatsApp
        </a>
      </div>

      {/* 9. Sidebar Ad */}
      <AdSlot position="sidebar" />
    </aside>
  );
}
