import TopBar from "./_components/TopBar";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import WhatsAppFloat from "./_components/WhatsAppFloat";
import CookieConsent from "@/components/CookieConsent";

// NOTE: Global metadata (title template, OG defaults, robots, metadataBase)
// is defined in the root layout (src/app/layout.jsx).
// Individual pages under (website) use generateMeta() from @/lib/seo
// which sets per-page title, description, canonical, and OG tags.
// No static metadata export here to avoid duplication with root layout.

export default function WebsiteLayout({ children }) {
  return (
    <>
      <TopBar />
      <Header />
      <main className="min-h-screen pb-12">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <CookieConsent />
    </>
  );
}
