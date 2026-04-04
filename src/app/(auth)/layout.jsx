export const metadata = {
  title: {
    template: "%s | JobReady Kenya",
    default: "Sign In | JobReady Kenya",
  },
  description:
    "Sign in to your JobReady Kenya account to access jobs, save listings, and manage your applications.",
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
