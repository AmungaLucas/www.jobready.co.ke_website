import { generateMeta } from "@/lib/seo";

export const metadata = generateMeta({
  title: "Search",
  description: "Search jobs, opportunities, companies, and career advice.",
  path: "/search",
  noindex: true,
});

export default function SearchLayout({ children }) {
  return children;
}
