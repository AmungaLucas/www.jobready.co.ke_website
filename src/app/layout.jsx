import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Analytics from "@/components/Analytics";

export const metadata = {
  title: {
    template: "%s | JobNet Kenya",
    default: "JobNet Kenya",
  },
  description: "JobNet Kenya — Find jobs, internships, scholarships & government opportunities in Kenya.",
  authors: [{ name: "JobNet Kenya" }],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://jobnet.co.ke",
    siteName: "JobNet Kenya",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://jobnet.co.ke"),
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
