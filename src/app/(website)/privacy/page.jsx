import { generateMeta } from "@/lib/seo";
import LegalLayout from "@/app/(website)/_components/LegalLayout";
import Link from "next/link";

export const metadata = generateMeta({
  title: "Privacy Policy — JobReady Kenya",
  description:
    "Read JobReady.co.ke's Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with the Kenya Data Protection Act 2019.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="April 2026">
      <h2 id="introduction" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        1. Introduction
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        JobReady.co.ke (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed
        to protecting your privacy. This Privacy Policy explains how we collect,
        use, disclose, and safeguard your information when you visit our website
        jobready.co.ke and use our services.
      </p>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        This policy is effective as of <strong>April 1, 2026</strong> and has
        been prepared in accordance with the{" "}
        <strong>Kenya Data Protection Act, 2019</strong> and regulations
        issued by the Office of the Data Protection Commissioner (ODPC).
      </p>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Our ODPC registration number is{" "}
        <strong>ODPC/KEN/DPI/2026/XXXX</strong>. By using JobReady.co.ke, you
        consent to the data practices described in this policy.
      </p>

      <h2
        id="information-we-collect"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        2. Information We Collect
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We collect several types of information to provide and improve our
        services:
      </p>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Personal Information
      </h3>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Account details</strong> — full name, email address, phone
          number, and password when you create an account
        </li>
        <li>
          <strong>Profile information</strong> — professional summary, work
          experience, education, skills, and location
        </li>
        <li>
          <strong>CV data</strong> — when you upload a CV or use our CV writing
          services, we store your career documents
        </li>
        <li>
          <strong>Job applications</strong> — records of jobs you&apos;ve
          applied for and saved
        </li>
        <li>
          <strong>Payment information</strong> — M-Pesa phone number and
          transaction details for our CV services (we do not store your M-Pesa
          PIN)
        </li>
      </ul>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Usage Data
      </h3>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>Pages visited and time spent on each page</li>
        <li>Search queries and filters used</li>
        <li>Jobs viewed, saved, and applied to</li>
        <li>Device type, browser, operating system</li>
        <li>IP address and approximate location</li>
        <li>Referral source and exit pages</li>
      </ul>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Cookies &amp; Tracking
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We use cookies and similar technologies to track activity on our
        platform. For more details, please see our{" "}
        <Link
          href="/cookies"
          className="text-[#1a56db] font-medium hover:underline no-underline"
        >
          Cookie Policy
        </Link>
        .
      </p>

      <h2
        id="how-we-use-your-information"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        3. How We Use Your Information
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We use the information we collect for the following purposes:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Service delivery</strong> — to provide job listings, CV
          writing services, and career resources
        </li>
        <li>
          <strong>Account management</strong> — to create and manage your
          account, authenticate your identity, and provide customer support
        </li>
        <li>
          <strong>Job matching</strong> — to recommend relevant jobs based on
          your profile, skills, and search history
        </li>
        <li>
          <strong>Communication</strong> — to send job alerts, application
          updates, newsletters, and service-related notifications
        </li>
        <li>
          <strong>Payment processing</strong> — to process M-Pesa payments for
          CV writing and other premium services
        </li>
        <li>
          <strong>Analytics &amp; improvement</strong> — to understand how our
          platform is used and improve the user experience
        </li>
        <li>
          <strong>Security</strong> — to detect, prevent, and address fraud,
          abuse, and security issues
        </li>
        <li>
          <strong>Legal compliance</strong> — to comply with applicable laws,
          regulations, and legal processes
        </li>
      </ul>

      <h2
        id="data-sharing-and-third-parties"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        4. Data Sharing &amp; Third Parties
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We do not sell your personal information. We may share your data in the
        following circumstances:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Employers</strong> — when you apply for a job, your profile
          and CV are shared with the hiring employer
        </li>
        <li>
          <strong>Service providers</strong> — with trusted third-party
          services that help us operate the platform (payment processors,
          email services, analytics, hosting)
        </li>
        <li>
          <strong>Legal requirements</strong> — if required by law, court order,
          or government authority
        </li>
        <li>
          <strong>Business transfers</strong> — in the event of a merger,
          acquisition, or sale of assets, your data may be transferred to the
          acquiring entity
        </li>
      </ul>

      <h2
        id="data-security"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        5. Data Security
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We implement appropriate technical and organizational security measures
        to protect your personal data, including:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>SSL/TLS encryption for all data in transit</li>
        <li>Encrypted storage of sensitive data (passwords hashed using bcrypt)</li>
        <li>Regular security audits and vulnerability assessments</li>
        <li>Access controls limiting data access to authorized personnel</li>
        <li>Secure data backup and disaster recovery procedures</li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        While we strive to protect your information, no method of transmission
        over the Internet is 100% secure. We encourage you to use strong
        passwords and to contact us immediately if you suspect unauthorized
        access to your account.
      </p>

      <h2 id="your-rights" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        6. Your Rights
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Under the Kenya Data Protection Act, 2019, you have the following
        rights regarding your personal data:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Right of access</strong> — you may request a copy of the
          personal data we hold about you
        </li>
        <li>
          <strong>Right to correction</strong> — you may request correction of
          inaccurate or incomplete personal data
        </li>
        <li>
          <strong>Right to deletion</strong> — you may request deletion of your
          personal data, subject to legal retention requirements
        </li>
        <li>
          <strong>Right to data portability</strong> — you may request your data
          in a structured, commonly used, machine-readable format
        </li>
        <li>
          <strong>Right to restrict processing</strong> — you may request that
          we limit how we process your data
        </li>
        <li>
          <strong>Right to object</strong> — you may object to processing of
          your personal data for direct marketing purposes
        </li>
        <li>
          <strong>Right to withdraw consent</strong> — where processing is based
          on consent, you may withdraw consent at any time
        </li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        To exercise any of these rights, please contact our Data Protection
        Officer at{" "}
        <a
          href="mailto:privacy@jobready.co.ke"
          className="text-[#1a56db] font-medium hover:underline no-underline"
        >
          privacy@jobready.co.ke
        </a>
        . We will respond to your request within 21 days as required by law.
      </p>

      <h2
        id="cookies-policy"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        7. Cookies Policy
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We use cookies and similar tracking technologies on JobReady.co.ke. For
        a detailed explanation of the cookies we use, how to manage them, and
        your choices, please visit our{" "}
        <Link
          href="/cookies"
          className="text-[#1a56db] font-medium hover:underline no-underline"
        >
          Cookie Policy
        </Link>
        .
      </p>

      <h2
        id="childrens-privacy"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        8. Children&apos;s Privacy
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        JobReady.co.ke is not intended for use by individuals under the age of
        18. We do not knowingly collect personal information from children. If
        we become aware that we have collected data from a child under 18, we
        will take immediate steps to delete such information. If you believe we
        have inadvertently collected data from a minor, please contact us at{" "}
        <a
          href="mailto:privacy@jobready.co.ke"
          className="text-[#1a56db] font-medium hover:underline no-underline"
        >
          privacy@jobready.co.ke
        </a>
        .
      </p>

      <h2
        id="changes-to-this-policy"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        9. Changes to This Policy
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We may update this Privacy Policy from time to time to reflect changes
        in our practices, technology, legal requirements, or other factors. When
        we make material changes, we will notify you by:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>Posting a prominent notice on our website</li>
        <li>Sending an email notification to registered users</li>
        <li>Updating the &quot;Last updated&quot; date at the top of this page</li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Your continued use of JobReady.co.ke after changes are posted
        constitutes your acceptance of the revised policy.
      </p>

      <h2
        id="contact-us"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        10. Contact Us
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        If you have any questions about this Privacy Policy or our data
        practices, please contact us:
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
