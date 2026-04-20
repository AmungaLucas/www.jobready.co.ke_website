import { siteConfig } from "@/config/site-config";

export const metadata = {
  title: {
    template: `%s | ${siteConfig.companyName}`,
    default: `Sign In | ${siteConfig.companyName}`,
  },
  description:
    `Sign in to your ${siteConfig.companyName} account to access jobs, save listings, and manage your applications.`,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
