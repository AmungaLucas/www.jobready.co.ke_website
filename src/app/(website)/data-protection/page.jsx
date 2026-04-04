import { generateMeta } from "@/lib/seo";
import LegalLayout from "@/app/(website)/_components/LegalLayout";
import Link from "next/link";

export const metadata = generateMeta({
  title: "Data Protection Notice — JobReady Kenya",
  description:
    "JobReady.co.ke's Data Protection Notice. Learn how we comply with the Kenya Data Protection Act 2019, your data rights, and how to contact our DPO.",
  path: "/data-protection",
});

export default function DataProtectionPage() {
  return (
    <LegalLayout title="Data Protection Notice" lastUpdated="April 2026">
      <h2 id="data-controller" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        1. Data Controller Information
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        For the purposes of the Kenya Data Protection Act, 2019 (the
        &quot;Act&quot;), the data controller for personal data processed
        through JobReady.co.ke is:
      </p>
      <div className="bg-gray-50 rounded-lg p-5 mt-4 mb-4 border border-gray-100">
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <strong className="text-gray-800">Organisation:</strong> JobReady
            Kenya
          </li>
          <li>
            <strong className="text-gray-800">Website:</strong>{" "}
            <Link
              href="/"
              className="text-[#1a56db] hover:underline no-underline"
            >
              jobready.co.ke
            </Link>
          </li>
          <li>
            <strong className="text-gray-800">
              ODPC Registration Number:
            </strong>{" "}
            ODPC/KEN/DPI/2026/XXXX
          </li>
          <li>
            <strong className="text-gray-800">
              Data Protection Officer (DPO):
            </strong>{" "}
            <a
              href="mailto:privacy@jobready.co.ke"
              className="text-[#1a56db] hover:underline no-underline"
            >
              privacy@jobready.co.ke
            </a>
          </li>
          <li>
            <strong className="text-gray-800">Physical Address:</strong>{" "}
            Nairobi, Kenya
          </li>
          <li>
            <strong className="text-gray-800">General Enquiries:</strong>{" "}
            <a
              href="mailto:support@jobready.co.ke"
              className="text-[#1a56db] hover:underline no-underline"
            >
              support@jobready.co.ke
            </a>
          </li>
        </ul>
      </div>

      <h2
        id="why-we-process-data"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        2. Why We Process Personal Data
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Under Section 26 of the Act, personal data may only be processed if
        there is a valid legal basis. JobReady.co.ke processes personal data on
        the following lawful grounds:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Contractual necessity</strong> — processing your name, email,
          phone number, and CV data is necessary to provide job matching,
          application submission, and CV writing services you have requested
        </li>
        <li>
          <strong>Consent</strong> — where you have given explicit consent, such
          as subscribing to our newsletter, enabling job alert notifications,
          or accepting non-essential cookies
        </li>
        <li>
          <strong>Legitimate interest</strong> — processing anonymised usage data
          to improve our Platform, prevent fraud, and ensure security is in our
          legitimate business interest and does not override your rights
        </li>
        <li>
          <strong>Legal obligation</strong> — we may process data to comply with
          applicable Kenyan laws, tax regulations, or lawful orders from
          competent authorities
        </li>
      </ul>

      <h2 id="data-we-collect" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        3. Categories of Personal Data We Collect
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We collect the following categories of personal data depending on the
        services you use:
      </p>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        From Job Seekers
      </h3>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Identity data</strong> — full name, email address, phone number
        </li>
        <li>
          <strong>Professional data</strong> — work experience, education
          history, skills, certifications, professional summary
        </li>
        <li>
          <strong>Documents</strong> — uploaded CVs, cover letters, and
          profile photos
        </li>
        <li>
          <strong>Application data</strong> — records of jobs applied for,
          saved, and application status
        </li>
        <li>
          <strong>Payment data</strong> — M-Pesa phone number and transaction
          references for premium services (we do not store M-Pesa PINs)
        </li>
      </ul>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        From Employers &amp; Recruiters
      </h3>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Organisation data</strong> — company name, industry, size,
          location, logo, and description
        </li>
        <li>
          <strong>Contact data</strong> — representative name, email, and phone
          number
        </li>
        <li>
          <strong>Job listing data</strong> — job titles, descriptions,
          requirements, salary ranges, and application instructions
        </li>
      </ul>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        From All Visitors
      </h3>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Technical data</strong> — IP address, browser type, operating
          system, device type
        </li>
        <li>
          <strong>Usage data</strong> — pages visited, search queries, time
          spent on pages, referral sources
        </li>
        <li>
          <strong>Cookie data</strong> — cookie identifiers and consent
          preferences as described in our{" "}
          <Link
            href="/cookies"
            className="text-[#1a56db] font-medium hover:underline no-underline"
          >
            Cookie Policy
          </Link>
        </li>
      </ul>

      <h2
        id="how-long-we-keep-data"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        4. Data Retention Periods
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We retain personal data only for as long as necessary to fulfil the
        purposes for which it was collected, in accordance with Section 31 of
        the Act. Our retention periods are:
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Data Category
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Retention Period
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200">
                Basis
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5">Account data (active users)</td>
              <td className="px-4 py-2.5">Duration of account + 1 year</td>
              <td className="px-4 py-2.5">Contractual necessity</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5">Account data (deleted accounts)</td>
              <td className="px-4 py-2.5">30 days (grace period)</td>
              <td className="px-4 py-2.5">Technical requirement</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5">Job applications</td>
              <td className="px-4 py-2.5">2 years from submission</td>
              <td className="px-4 py-2.5">Legal compliance</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5">CV documents</td>
              <td className="px-4 py-2.5">Until account deletion</td>
              <td className="px-4 py-2.5">Contractual necessity</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5">Newsletter subscriptions</td>
              <td className="px-4 py-2.5">Until unsubscription</td>
              <td className="px-4 py-2.5">Consent</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5">Payment records</td>
              <td className="px-4 py-2.5">5 years (KRA compliance)</td>
              <td className="px-4 py-2.5">Legal obligation</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5">Server logs &amp; analytics</td>
              <td className="px-4 py-2.5">90 days</td>
              <td className="px-4 py-2.5">Legitimate interest</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5">Password reset tokens</td>
              <td className="px-4 py-2.5">1 hour</td>
              <td className="px-4 py-2.5">Security</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="your-data-rights" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        5. Your Data Protection Rights
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Under the Kenya Data Protection Act, 2019, you have the following
        rights in relation to your personal data:
      </p>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Right of Access (Section 35)
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        You have the right to request confirmation of whether we process your
        personal data, and if so, to obtain a copy of that data along with
        information about the processing purposes, categories of data, and
        recipients. You can exercise this right by emailing{" "}
        <a
          href="mailto:privacy@jobready.co.ke"
          className="text-[#1a56db] hover:underline no-underline"
        >
          privacy@jobready.co.ke
        </a>
        . We will respond within 21 days as required by law.
      </p>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Right to Correction (Section 36)
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        If your personal data is inaccurate, incomplete, or misleading, you may
        request that we correct it without undue delay. You can update most of
        your profile information directly through your dashboard settings. For
        other corrections, contact our DPO.
      </p>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Right to Erasure / Deletion (Section 37)
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        You may request the deletion of your personal data when it is no longer
        necessary for the purpose for which it was collected, when you withdraw
        consent, or when the data has been unlawfully processed. You can delete
        your account through your dashboard settings, which will trigger the
        deletion of your personal data in accordance with our retention
        schedule. Note that certain data may be retained where required by law
        or for the establishment, exercise, or defence of legal claims.
      </p>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Right to Data Portability (Section 38)
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        You have the right to request your personal data in a structured,
        commonly used, and machine-readable format (such as JSON or CSV). This
        allows you to transfer your data to another service provider. To request
        a data export, contact our DPO at{" "}
        <a
          href="mailto:privacy@jobready.co.ke"
          className="text-[#1a56db] hover:underline no-underline"
        >
          privacy@jobready.co.ke
        </a>
        .
      </p>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Right to Restrict Processing (Section 39)
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        You may request that we limit the processing of your personal data in
        certain circumstances, such as when you contest the accuracy of the data,
        when processing is unlawful but you prefer restriction over deletion, or
        when we no longer need the data but you require it for legal claims.
      </p>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Right to Object (Section 40)
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        You have the right to object to the processing of your personal data for
        direct marketing purposes, profiling, or any processing based on our
        legitimate interests. Upon receiving an objection, we will cease the
        processing unless we have compelling legitimate grounds that override
        your interests, rights, and freedoms.
      </p>

      <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">
        Right to Withdraw Consent (Section 41)
      </h3>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Where processing is based on your consent (for example, newsletter
        subscriptions or non-essential cookies), you may withdraw your consent at
        any time. Withdrawal of consent does not affect the lawfulness of
        processing carried out before the withdrawal. You can unsubscribe from
        newsletters via the link in any email or through your dashboard.
      </p>

      <h2
        id="data-security-measures"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        6. Data Security Measures
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        In accordance with Section 29 of the Act, we implement appropriate
        technical and organisational measures to ensure the security and
        confidentiality of personal data, including protection against
        unauthorised access, processing, disclosure, alteration, or destruction.
        Our specific measures include:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Encryption in transit</strong> — all data transmitted between
          your browser and our servers is encrypted using TLS/SSL (HTTPS)
        </li>
        <li>
          <strong>Password security</strong> — passwords are hashed using
          bcrypt with 12 salt rounds and are never stored in plaintext
        </li>
        <li>
          <strong>Session management</strong> — authentication sessions use
          cryptographically signed JWTs with configurable expiration
        </li>
        <li>
          <strong>Access controls</strong> — database access is restricted to
          authorised services using credential-based authentication
        </li>
        <li>
          <strong>API security</strong> — public API endpoints are protected by
          rate limiting, input validation, and CSRF protection
        </li>
        <li>
          <strong>Regular security reviews</strong> — we conduct periodic
          security assessments and update dependencies to address known
          vulnerabilities
        </li>
      </ul>

      <h2 id="data-breaches" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        7. Data Breach Notification
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        In the event of a personal data breach that is likely to result in a
        risk to the rights and freedoms of data subjects, we will notify the
        Office of the Data Protection Commissioner (ODPC) within 72 hours of
        becoming aware of the breach, as required under Section 43 of the Act.
        Where the breach is likely to result in a high risk to your rights and
        freedoms, we will also notify you directly without undue delay.
      </p>

      <h2
        id="data-sharing-with-third-parties"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        8. Data Sharing With Third Parties
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        In compliance with Section 32 of the Act, we may share your personal
        data with the following categories of recipients:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Employers</strong> — when you apply for a job, your profile
          information and CV are shared with the hiring employer for the
          purpose of evaluating your application
        </li>
        <li>
          <strong>Payment processors</strong> — M-Pesa (Safaricom) processes
          payment transactions for our premium services
        </li>
        <li>
          <strong>Analytics providers</strong> — Google Analytics collects
          anonymised usage data to help us improve the Platform
        </li>
        <li>
          <strong>Hosting providers</strong> — our cloud hosting provider
          stores and serves the Platform&apos;s data
        </li>
        <li>
          <strong>Government authorities</strong> — when required by Kenyan law,
          court order, or lawful request from a competent authority
        </li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We do not sell, trade, or rent your personal data to third parties for
        marketing purposes. All third-party processors are bound by
        confidentiality obligations and data processing agreements that ensure
        your data is handled in accordance with the Act.
      </p>

      <h2 id="childrens-data" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        9. Children&apos;s Data
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        JobReady.co.ke is not directed at individuals under the age of 18. We
        do not knowingly collect or process personal data of children under 18
        years of age. Under Section 51 of the Act, a data controller may not
        process personal data in relation to a child without verifiable consent
        from a parent or guardian. If we discover that we have inadvertently
        collected data from a child, we will take immediate steps to delete it.
      </p>

      <h2
        id="cross-border-data-transfers"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        10. Cross-Border Data Transfers
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Your personal data is primarily stored and processed within Kenya. In
        certain cases, data may be transferred to servers located outside Kenya
        (for example, if our cloud hosting provider has data centres in other
        jurisdictions). Such transfers are only made in accordance with
        Section 48 of the Act, which requires that the recipient country or
        territory has adequate data protection standards, or that appropriate
        safeguards are in place.
      </p>

      <h2
        id="automated-decision-making"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        11. Automated Decision-Making
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We do not use fully automated decision-making, including profiling, that
        produces legal effects or similarly significant effects on individuals.
        Our job matching algorithm provides recommendations based on your
        profile and search preferences, but all application decisions are made
        by employers. You have the right to request human intervention in any
        automated processing by contacting our DPO.
      </p>

      <h2 id="complaints" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        12. Complaints to the ODPC
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        If you believe that your data protection rights have been violated and
        you are not satisfied with our response, you have the right to lodge a
        complaint with the Office of the Data Protection Commissioner (ODPC):
      </p>
      <div className="bg-gray-50 rounded-lg p-5 mt-4 mb-4 border border-gray-100">
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <strong className="text-gray-800">
              Office of the Data Protection Commissioner
            </strong>
          </li>
          <li>
            Website:{" "}
            <a
              href="https://www.odpc.go.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a56db] hover:underline no-underline"
            >
              www.odpc.go.ke
            </a>
          </li>
          <li>
            Email:{" "}
            <a
              href="mailto:complaints@odpc.go.ke"
              className="text-[#1a56db] hover:underline no-underline"
            >
              complaints@odpc.go.ke
            </a>
          </li>
          <li>Physical Address: CMP House, 3rd Floor, Kilome Lane, Kilimani, Nairobi</li>
          <li>Phone: +254 20 869 8000</li>
        </ul>
      </div>

      <h2 id="contact-us" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        13. Contact Our DPO
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        For any data protection related queries, requests, or complaints,
        please contact our Data Protection Officer:
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
          <li>
            Related:{" "}
            <Link
              href="/privacy"
              className="text-[#1a56db] hover:underline no-underline"
            >
              Privacy Policy
            </Link>{" "}
            ·{" "}
            <Link
              href="/cookies"
              className="text-[#1a56db] hover:underline no-underline"
            >
              Cookie Policy
            </Link>{" "}
            ·{" "}
            <Link
              href="/disclaimer"
              className="text-[#1a56db] hover:underline no-underline"
            >
              Disclaimer
            </Link>
          </li>
        </ul>
      </div>
    </LegalLayout>
  );
}
