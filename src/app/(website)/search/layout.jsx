import { generateMeta } from "@/lib/seo";

export const metadata = generateMeta({
  title: "Search Jobs & Opportunities in Kenya",
  description:
    "Search thousands of jobs, internships, scholarships, and opportunities across Kenya. Filter by location, category, and job type.",
  path: "/search",
});

export default function SearchLayout({ children }) {
  return <>{children}</>;
}
