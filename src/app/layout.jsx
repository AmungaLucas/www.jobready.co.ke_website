import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Analytics from "@/components/Analytics";
import AdSense from "@/components/AdSense";

export const metadata = {
  title: {
    template: "%s | JobReady Kenya",
    default: "JobReady Kenya — Jobs, Internships & Scholarships",
  },
  description:
    "Find jobs, internships, scholarships & government opportunities in Kenya. Updated daily. Get your professional CV done from KSh 500 — JobReady.co.ke",
  keywords: [
    "jobs in Kenya",
    "Kenyan jobs",
    "internships Kenya",
    "scholarships Kenya",
    "government jobs Kenya",
    "CV writing Kenya",
    "job board Kenya",
    "career advice Kenya",
  ],
  authors: [{ name: "JobReady Kenya" }],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://jobready.co.ke",
    siteName: "JobReady Kenya",
    title: "JobReady Kenya — Jobs, Internships & Scholarships",
    description:
      "Find jobs, internships, scholarships & government opportunities in Kenya. Updated daily.",
    images: [
      {
        url: "https://jobready.co.ke/og-default.png",
        width: 1200,
        height: 630,
        alt: "JobReady Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@jobreadykenya",
    title: "JobReady Kenya — Jobs, Internships & Scholarships",
    description:
      "Find jobs, internships, scholarships & government opportunities in Kenya. Updated daily.",
    images: ["https://jobready.co.ke/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://jobready.co.ke"),
  alternates: {
    canonical: "https://jobready.co.ke",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans text-gray-800 bg-gray-50 antialiased">
        <Analytics />
        <AdSense />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
