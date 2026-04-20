import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Analytics from "@/components/Analytics";
import { siteConfig } from "@/config/site-config";

export const metadata = {
  title: {
    template: `%s | ${siteConfig.companyName}`,
    default: siteConfig.companyName,
  },
  description: `${siteConfig.companyName} — Find jobs, internships, scholarships & government opportunities in Kenya.`,
  authors: [{ name: siteConfig.companyName }],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteConfig.url,
    siteName: siteConfig.companyName,
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "en-KE": siteConfig.url,
    },
    types: {
      "application/rss+xml": `${siteConfig.url}/feed.xml`,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans text-gray-800 bg-gray-50 antialiased">
        <Analytics />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
