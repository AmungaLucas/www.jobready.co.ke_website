import { generateMeta } from "@/lib/seo";
import LegalLayout from "@/app/(website)/_components/LegalLayout";
import Link from "next/link";

export const metadata = generateMeta({
  title: "Cookie Policy — JobReady Kenya",
  description:
    "Learn how JobReady.co.ke uses cookies and similar technologies. Understand the types of cookies we use, their purposes, and how to manage your cookie preferences.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="April 2026">
      <h2
        id="what-are-cookies"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        1. What Are Cookies
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Cookies are small text files that are placed on your device (computer,
        tablet, or mobile phone) when you visit a website. They are widely used
        to make websites work more efficiently, provide a better browsing
        experience, and supply information to website owners.
      </p>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Cookies can be &quot;persistent&quot; (remain on your device until they
        expire or you delete them) or &quot;session&quot; cookies (deleted
        automatically when you close your browser). They can also be
        &quot;first-party&quot; (set by us) or &quot;third-party&quot; (set by
        our trusted partners).
      </p>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        JobReady.co.ke also uses similar technologies such as localStorage and
        session storage, which function similarly to cookies.
      </p>

      <h2
        id="how-we-use-cookies"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        2. How We Use Cookies
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We use cookies and similar technologies for the following purposes:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Essential functionality</strong> — to remember your login
          session, keep you signed in, and ensure the Platform works correctly
        </li>
        <li>
          <strong>Analytics</strong> — to understand how visitors interact with
          our Platform, which pages are most popular, and how users navigate
          between pages
        </li>
        <li>
          <strong>Personalization</strong> — to remember your preferences, such
          as saved jobs, location, and filter settings
        </li>
        <li>
          <strong>Advertising</strong> — to serve relevant advertisements and
          measure the effectiveness of our ad campaigns
        </li>
      </ul>

      <h2
        id="types-of-cookies-we-use"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        3. Types of Cookies We Use
      </h2>

      {/* Essential */}
      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Essential Cookies
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        These cookies are necessary for the Platform to function properly. They
        cannot be disabled as the Platform would not work without them.
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Cookie
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Purpose
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5 font-mono text-xs">session_id</td>
              <td className="px-4 py-2.5">Maintains your login session</td>
              <td className="px-4 py-2.5">Session</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5 font-mono text-xs">csrf_token</td>
              <td className="px-4 py-2.5">Prevents cross-site request forgery</td>
              <td className="px-4 py-2.5">Session</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5 font-mono text-xs">cookie_consent</td>
              <td className="px-4 py-2.5">Stores your cookie consent preference</td>
              <td className="px-4 py-2.5">1 year</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Analytics */}
      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Analytics Cookies
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        These cookies help us understand how visitors interact with the Platform
        by collecting and reporting information anonymously. They help us
        improve the user experience.
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Cookie
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Purpose
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5 font-mono text-xs">_ga</td>
              <td className="px-4 py-2.5">Google Analytics — distinguishes users</td>
              <td className="px-4 py-2.5">2 years</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5 font-mono text-xs">_ga_*</td>
              <td className="px-4 py-2.5">Google Analytics 4 — maintains session state</td>
              <td className="px-4 py-2.5">2 years</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5 font-mono text-xs">_gid</td>
              <td className="px-4 py-2.5">Google Analytics — distinguishes users within 24 hours</td>
              <td className="px-4 py-2.5">24 hours</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Functional */}
      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Functional Cookies
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        These cookies allow the Platform to remember choices you make (such as
        your preferred location, job filters, or language) and provide enhanced,
        personalized features.
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Cookie
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Purpose
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5 font-mono text-xs">saved_filters</td>
              <td className="px-4 py-2.5">Remembers your job search preferences</td>
              <td className="px-4 py-2.5">30 days</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5 font-mono text-xs">preferred_location</td>
              <td className="px-4 py-2.5">Stores your default location</td>
              <td className="px-4 py-2.5">90 days</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5 font-mono text-xs">dismissed_banner</td>
              <td className="px-4 py-2.5">Remembers dismissed promotional banners</td>
              <td className="px-4 py-2.5">7 days</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Advertising */}
      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Advertising Cookies
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        These cookies are used to deliver advertisements that are relevant to
        you and to measure the effectiveness of advertising campaigns. They track
        your browsing activity across websites.
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Cookie
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Purpose
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5 font-mono text-xs">__gads</td>
              <td className="px-4 py-2.5">Google AdSense — ad targeting</td>
              <td className="px-4 py-2.5">13 months</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5 font-mono text-xs">__gpi</td>
              <td className="px-4 py-2.5">Google AdSense — publisher identifier</td>
              <td className="px-4 py-2.5">13 months</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5 font-mono text-xs">id</td>
              <td className="px-4 py-2.5">DoubleClick (Google) — ad tracking</td>
              <td className="px-4 py-2.5">1 year</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2
        id="third-party-cookies"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        4. Third-Party Cookies
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Some cookies on JobReady.co.ke are set by third-party services that we
        use to improve our Platform. These include:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Google Analytics</strong> — we use Google Analytics to collect
          anonymous usage data and understand how our Platform is used. You can
          opt out by installing the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a56db] hover:underline no-underline"
          >
            Google Analytics opt-out browser add-on
          </a>
        </li>
        <li>
          <strong>Google AdSense</strong> — we use Google AdSense to display
          advertisements. Google may use cookies to serve ads based on your
          prior visits. You can manage your ad preferences at{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a56db] hover:underline no-underline"
          >
            Google Ads Settings
          </a>
        </li>
        <li>
          <strong>Cloudflare</strong> — we use Cloudflare for CDN and security.
          Cloudflare sets cookies to protect against bots and malicious traffic.
        </li>
      </ul>

      <h2
        id="managing-cookies"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        5. Managing Cookies
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        You have the right to decide whether to accept or reject cookies. You
        can manage your cookie preferences in the following ways:
      </p>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Browser Settings
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Most browsers allow you to control cookies through their settings. You
        can set your browser to refuse cookies, delete existing cookies, or alert
        you when a cookie is being set. Here&apos;s how to manage cookies in
        common browsers:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Chrome</strong> — Settings → Privacy and security → Cookies
          and other site data
        </li>
        <li>
          <strong>Firefox</strong> — Settings → Privacy &amp; Security → Cookies
          and Site Data
        </li>
        <li>
          <strong>Safari</strong> — Preferences → Privacy → Manage Website Data
        </li>
        <li>
          <strong>Edge</strong> — Settings → Cookies and site permissions →
          Manage and delete cookies
        </li>
        <li>
          <strong>Opera</strong> — Settings → Privacy &amp; security → Cookies
        </li>
      </ul>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Opt-Out Links
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        You can also opt out of personalized advertising through industry
        standards:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a56db] hover:underline no-underline"
          >
            Google Ads Settings
          </a>
        </li>
        <li>
          <a
            href="https://optout.networkadvertising.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a56db] hover:underline no-underline"
          >
            Network Advertising Initiative (NAI) Opt-Out
          </a>
        </li>
        <li>
          <a
            href="https://optout.aboutads.info"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a56db] hover:underline no-underline"
          >
            Digital Advertising Alliance (DAA) Opt-Out
          </a>
        </li>
      </ul>

      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Please note that disabling cookies may affect the functionality of
        certain features of the Platform. Essential cookies cannot be disabled as
        they are necessary for the Platform to operate.
      </p>

      <h2
        id="changes-to-cookie-policy"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        6. Changes to This Cookie Policy
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We may update this Cookie Policy from time to time to reflect changes in
        the cookies we use, technology, legal requirements, or other factors.
        When we make changes, we will update the &quot;Last updated&quot; date
        at the top of this page.
      </p>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        For information about how we handle your personal data more broadly,
        please see our{" "}
        <Link
          href="/privacy"
          className="text-[#1a56db] font-medium hover:underline no-underline"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <h2
        id="contact-us"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        7. Contact Us
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        If you have any questions about our use of cookies, please contact us:
      </p>
      <div className="bg-gray-50 rounded-lg p-5 mt-4 border border-gray-100">
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <strong className="text-gray-800">JobReady Kenya</strong>
          </li>
          <li>
            Data Protection Officer:{" "}
            <a
              href="mailto:privacy@jobready.co.ke"
              className="text-[#1a56db] hover:underline no-underline"
            >
              privacy@jobready.co.ke
            </a>
          </li>
          <li>
            General Support:{" "}
            <a
              href="mailto:support@jobready.co.ke"
              className="text-[#1a56db] hover:underline no-underline"
            >
              support@jobready.co.ke
            </a>
          </li>
          <li>
            Contact Page:{" "}
            <Link
              href="/contact"
              className="text-[#1a56db] hover:underline no-underline"
            >
              jobready.co.ke/contact
            </Link>
          </li>
        </ul>
      </div>
    </LegalLayout>
  );
}
