import { generateMeta } from "@/lib/seo";
import LegalLayout from "@/app/(website)/_components/LegalLayout";
import Link from "next/link";
import { siteConfig } from "@/config/site-config";
import ContactInfoCard from "@/app/(website)/_components/ContactInfoCard";

export const metadata = generateMeta({
  title: "Terms of Service — JobReady Kenya",
  description:
    "Read the Terms of Service for JobReady.co.ke. Understand your rights and responsibilities when using our job board, CV writing services, and career resources.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="April 2026">
      <h2
        id="acceptance-of-terms"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        1. Acceptance of Terms
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        By accessing or using {siteConfig.brandName} (&quot;the Platform&quot;), you
        agree to be bound by these Terms of Service (&quot;Terms&quot;). If you
        do not agree to these Terms, you may not use the Platform. These Terms
        constitute a legally binding agreement between you and {siteConfig.companyLegalName}.
      </p>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We reserve the right to modify these Terms at any time. Continued use
        of the Platform after modifications constitutes your acceptance of the
        revised Terms.
      </p>

      <h2
        id="description-of-service"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        2. Description of Service
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        {siteConfig.brandName} is an online platform that provides:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>A job board listing employment opportunities in Kenya</li>
        <li>
          Career resources including articles, guides, and scholarship listings
        </li>
        <li>
          Professional CV writing, cover letter, and LinkedIn profile
          optimization services
        </li>
        <li>
          Company profiles and employer branding pages
        </li>
        <li>
          Job alert notifications and newsletter subscriptions
        </li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        The Platform serves as an intermediary connecting job seekers with
        employers. JobReady does not guarantee employment or the accuracy of
        third-party job listings, though we make reasonable efforts to verify
        listings before publication.
      </p>

      <h2
        id="user-accounts-and-registration"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        3. User Accounts &amp; Registration
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        To access certain features of the Platform, you may be required to
        create an account. When registering, you agree to:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          Provide accurate, current, and complete information during registration
        </li>
        <li>
          Maintain and promptly update your account information
        </li>
        <li>
          Keep your password confidential and not share it with any third party
        </li>
        <li>
          Notify us immediately of any unauthorized use of your account
        </li>
        <li>
          Accept responsibility for all activities under your account
        </li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        You must be at least 18 years old to create an account. We reserve the
        right to suspend or terminate accounts that violate these Terms.
      </p>

      <h2
        id="user-content-and-responsibilities"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        4. User Content &amp; Responsibilities
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        You are solely responsible for any content you submit to the Platform,
        including but not limited to your profile, CV, cover letters, and
        messages. You represent and warrant that:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          Your content is truthful, accurate, and not misleading
        </li>
        <li>
          Your content does not infringe any third-party intellectual property
          rights
        </li>
        <li>
          Your content does not contain harmful, offensive, defamatory, or
          unlawful material
        </li>
        <li>
          You have the right to grant us a license to use, store, and display
          your content as needed to provide the service
        </li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        You may not use the Platform to:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>Scrape, crawl, or data-mine the Platform without permission</li>
        <li>Post fake or misleading job listings</li>
        <li>Impersonate any person or entity</li>
        <li>Transmit viruses, malware, or harmful code</li>
        <li>Interfere with or disrupt the Platform&apos;s operation</li>
        <li>Use automated tools to apply for jobs in bulk</li>
      </ul>

      <h2
        id="job-listings-and-applications"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        5. Job Listings &amp; Applications
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Job listings on the Platform are posted by employers and are their
        responsibility. While we verify listings where possible, we do not
        guarantee:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>The accuracy, completeness, or currentness of job listings</li>
        <li>That any particular job will be available</li>
        <li>That employers will respond to your applications</li>
        <li>That you will be hired for any position</li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        When you apply for a job, your profile information and CV may be shared
        with the hiring employer. JobReady is not a party to the employment
        relationship between you and any employer.
      </p>

      <h2
        id="cv-writing-services"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        6. CV Writing Services
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        JobReady offers professional CV writing, cover letter, and LinkedIn
        profile optimization services. By ordering these services, you agree to
        the following:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Pricing</strong> — service fees are displayed on our{" "}
          <Link
            href="/cv-services"
            className="text-[#1a56db] font-medium hover:underline no-underline"
          >
            CV Services page
          </Link>{" "}
          and may be updated from time to time
        </li>
        <li>
          <strong>Delivery</strong> — standard delivery is within 24 hours of
          receiving all required information and payment confirmation
        </li>
        <li>
          <strong>Revisions</strong> — each service tier includes a specific
          number of free revisions as stated at the time of purchase
        </li>
        <li>
          <strong>Information accuracy</strong> — you are responsible for
          providing accurate information; we are not liable for inaccuracies in
          the data you provide
        </li>
        <li>
          <strong>Confidentiality</strong> — your CV and personal information
          are kept confidential and are not shared with third parties without
          your consent
        </li>
      </ul>

      <h2
        id="payment-terms"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        7. Payment Terms
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Payments for premium services are processed via{" "}
        <strong>M-Pesa (Safaricom)</strong>. By making a payment, you agree that:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          All fees are quoted in Kenya Shillings (KSh) and inclusive of applicable taxes
        </li>
        <li>
          Payment is due at the time of ordering unless otherwise agreed
        </li>
        <li>
          We do not store your M-Pesa PIN or sensitive financial information
        </li>
        <li>
          A payment confirmation via M-Pesa SMS serves as your receipt
        </li>
        <li>
          Refunds are subject to our{" "}
          <Link
            href="/refunds"
            className="text-[#1a56db] font-medium hover:underline no-underline"
          >
            Refund Policy
          </Link>
        </li>
      </ul>

      <h2
        id="intellectual-property"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        8. Intellectual Property
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        All content on the Platform, including but not limited to logos, design,
        text, graphics, code, and data compilations, is the property of {siteConfig.companyLegalName} or its licensors and is protected by intellectual property laws.
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          You may not reproduce, distribute, or create derivative works from our
          content without prior written consent
        </li>
        <li>
          You retain ownership of your personal content (CVs, profiles, etc.)
        </li>
        <li>
          By submitting content, you grant JobReady a non-exclusive, worldwide,
          royalty-free license to use it for the purpose of providing the service
        </li>
      </ul>

      <h2
        id="limitation-of-liability"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        9. Limitation of Liability
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        To the maximum extent permitted by law, {siteConfig.companyLegalName} shall not be
        liable for any indirect, incidental, special, consequential, or punitive
        damages, including but not limited to:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>Loss of employment opportunities or income</li>
        <li>Loss of data or information</li>
        <li>Damage to your reputation</li>
        <li>
          Any losses arising from third-party content, including job listings
          posted by employers
        </li>
        <li>Service interruptions or downtime</li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Our total liability for any claim shall not exceed the amount you paid
        to JobReady in the 12 months preceding the claim.
      </p>

      <h2
        id="indemnification"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        10. Indemnification
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        You agree to indemnify, defend, and hold harmless {siteConfig.companyLegalName}, its
        officers, directors, employees, and agents from and against any and all
        claims, damages, losses, costs, and expenses (including reasonable
        attorney fees) arising from:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>Your use of or inability to use the Platform</li>
        <li>Your violation of these Terms</li>
        <li>Your violation of any applicable law or regulation</li>
        <li>Content you submit to the Platform</li>
        <li>Your infringement of any third-party intellectual property rights</li>
      </ul>

      <h2
        id="governing-law"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        11. Governing Law
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        These Terms shall be governed by and construed in accordance with the
        <strong> Laws of Kenya</strong>. Any disputes arising from these Terms
        or your use of the Platform shall be resolved in accordance with Kenyan
        law, without regard to its conflict of law principles.
      </p>

      <h2
        id="dispute-resolution"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        12. Dispute Resolution
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        In the event of any dispute arising out of or relating to these Terms:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Negotiation</strong> — you agree to first attempt to resolve
          the dispute by contacting us at{" "}
          <a
            href={`mailto:${siteConfig.email.support}`}
            className="text-[#1a56db] hover:underline no-underline"
          >
            {siteConfig.email.support}
          </a>
        </li>
        <li>
          <strong>Mediation</strong> — if the dispute cannot be resolved within
          30 days through negotiation, either party may request mediation through
          a mutually agreed mediator in Nairobi, Kenya
        </li>
        <li>
          <strong>Jurisdiction</strong> — if mediation fails, the dispute shall
          be submitted to the exclusive jurisdiction of the courts of Kenya in
          Nairobi
        </li>
      </ul>

      <h2
        id="changes-to-terms"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        13. Changes to Terms
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We reserve the right to update or modify these Terms at any time. When
        we make changes, we will:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>Update the &quot;Last updated&quot; date at the top of this page</li>
        <li>Post a notice on the Platform for material changes</li>
        <li>Notify registered users via email for significant changes</li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Your continued use of the Platform after changes are posted constitutes
        acceptance of the revised Terms. If you do not agree, you should stop
        using the Platform and may request account deletion.
      </p>

      <h2
        id="contact-information"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        14. Contact Information
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        If you have any questions about these Terms of Service, please contact us:
      </p>
      <ContactInfoCard show={["support", "contactPage"]} />
    </LegalLayout>
  );
}
