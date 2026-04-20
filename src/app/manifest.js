import { siteConfig } from "@/config/site-config";

export default function manifest() {
  return {
    name: `${siteConfig.name} — Jobs, Internships & Scholarships`,
    short_name: siteConfig.shortName,
    description:
      "Kenya's #1 job board. Find jobs, internships, scholarships & career services. Updated daily.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#1a56db",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["jobs", "education", "business"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [],
    shortcuts: [
      {
        name: "Browse Jobs",
        url: "/jobs",
        description: "Browse latest jobs in Kenya",
      },
      {
        name: "Scholarships",
        url: "/opportunities/scholarships",
        description: "Find scholarships for Kenyan students",
      },
      {
        name: "CV Services",
        url: "/cv-services",
        description: "Professional CV writing from KSh 500",
      },
    ],
  };
}
