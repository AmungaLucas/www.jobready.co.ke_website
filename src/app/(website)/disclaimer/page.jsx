import { generateMeta } from "@/lib/seo";
import LegalLayout from "@/app/(website)/_components/LegalLayout";
import Link from "next/link";

export const metadata = generateMeta({
  title: "Disclaimer — JobReady Kenya",
  description:
    "Read the disclaimer for JobReady.co.ke. Understand the limitations of our job board, career advice, and CV writing services.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer" lastUpdated="April 2026">
      <h2 id="general-disclaimer" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        1. General Disclaimer
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        The information provided on JobReady.co.ke (&quot;the Platform&quot;) is
        for general informational purposes only. While we strive to keep job
        listings, career articles, and other content accurate and up-to-date, we
        make no representations or warranties of any kind, express or implied,
        about the completeness, accuracy, reliability, suitability, or
        availability of the information, products, services, or related graphics
        contained on the Platform for any purpose.
      </p>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Any reliance you place on such information is therefore strictly at your
        own risk. In no event will we be liable for any loss or damage including
        without limitation, indirect or consequential loss or damage, or any loss
        or damage whatsoever arising from loss of data or profits arising out of,
        or in connection with, the use of this Platform.
      </p>

      <h2 id="job-listings" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        2. Job Listings Disclaimer
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Job listings published on JobReady.co.ke are provided by third-party
        employers, recruiters, and organisations. JobReady Kenya acts as an
        intermediary platform and does not:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          Guarantee the accuracy, authenticity, or completeness of any job listing
        </li>
        <li>
          Endorse, verify the credentials of, or take responsibility for any employer
          posting on the Platform
        </li>
        <li>
          Act as an employer, recruitment agency, or employment consultant
        </li>
        <li>
          Guarantee that applying for any listed position will result in employment
        </li>
        <li>
          Control the hiring decisions, interview processes, or employment terms of
          any employer
        </li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We strongly advise job seekers to independently verify the legitimacy of
        any job listing and employer before sharing personal information,
        attending interviews, or accepting employment offers. JobReady shall not
        be held liable for any losses, damages, or harm arising from interactions
        with employers or job listings found on the Platform.
      </p>

      <h2
        id="career-advice-and-content"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        3. Career Advice &amp; Content
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        The career advice articles, guides, interview tips, CV templates, and
        other educational content published on JobReady.co.ke are provided for
        informational and guidance purposes only. This content does not constitute
        professional career counselling, legal advice, financial advice, or any
        other form of professional consultation.
      </p>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        You should not act upon any information provided without first seeking
        qualified professional advice tailored to your specific circumstances.
        JobReady Kenya, its contributors, and authors are not responsible for any
        outcomes, decisions, or actions taken based on the content published on
        this Platform. Career outcomes depend on numerous factors beyond our
        control, including market conditions, individual qualifications, and
        employer requirements.
      </p>

      <h2
        id="cv-writing-services"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        4. CV Writing Services Disclaimer
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Our professional CV writing, cover letter, and LinkedIn profile
        optimisation services are provided to help you present your professional
        experience in the best possible light. However:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          We do not guarantee that using our CV services will result in securing
          employment, an interview, or any specific career outcome
        </li>
        <li>
          You are responsible for the accuracy and truthfulness of all information
          you provide to our CV writers
        </li>
        <li>
          Our writers create professional documents based on the information
          supplied; we do not verify employment history, educational
          qualifications, or professional certifications
        </li>
        <li>
          The quality and effectiveness of a CV depend on many factors, including
          the competitiveness of the job market, the applicant&apos;s
          qualifications, and employer preferences
        </li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        For more information about our service terms, delivery timelines, and
        revision policies, please refer to our{" "}
        <Link
          href="/terms"
          className="text-[#1a56db] font-medium hover:underline no-underline"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/refunds"
          className="text-[#1a56db] font-medium hover:underline no-underline"
        >
          Refund Policy
        </Link>
        .
      </p>

      <h2
        id="opportunities-and-scholarships"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        5. Opportunities &amp; Scholarships
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        JobReady.co.ke lists scholarships, grants, fellowships, bursaries, and
        other opportunities sourced from publicly available information. These
        listings are provided as a convenience and for informational purposes.
        We do not administer, award, or have any involvement in the selection
        process for any listed opportunity unless explicitly stated otherwise.
      </p>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Application deadlines, eligibility criteria, and award amounts may
        change without notice. We strongly recommend visiting the official
        website of the administering organisation for the most current and
        accurate information. JobReady Kenya assumes no responsibility for
        expired listings, changed deadlines, or inaccurate eligibility criteria.
      </p>

      <h2
        id="third-party-links"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        6. Third-Party Links
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        The Platform may contain links to third-party websites, resources, or
        services that are not owned or controlled by JobReady Kenya. These links
        are provided solely as a convenience to you. We have no control over,
        and assume no responsibility for, the content, privacy policies, or
        practices of any third-party websites or services.
      </p>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        The inclusion of any link does not imply our endorsement, sponsorship,
        or recommendation of the linked website or its content. We strongly
        advise you to review the terms and privacy policies of any third-party
        website before providing personal information or engaging in any
        transactions.
      </p>

      <h2 id="m-pesa-payments" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        7. M-Pesa Payments
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Payments for premium services on JobReady.co.ke are processed through
        the M-Pesa mobile money service provided by Safaricom PLC. JobReady
        Kenya does not process, store, or have access to your M-Pesa PIN or
        sensitive financial data. Payment-related issues should be directed to
        Safaricom customer care in the first instance.
      </p>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        While we endeavour to ensure all transactions are processed correctly,
        we are not liable for any delays, failures, or errors in M-Pesa payment
        processing that are beyond our reasonable control. For payment-related
        concerns, please contact us at{" "}
        <a
          href="mailto:payments@jobready.co.ke"
          className="text-[#1a56db] hover:underline no-underline"
        >
          payments@jobready.co.ke
        </a>
        .
      </p>

      <h2
        id="limitation-of-liability"
        className="text-xl font-bold text-gray-900 mb-3 mt-8"
      >
        8. Limitation of Liability
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        To the fullest extent permitted by Kenyan law, JobReady Kenya, its
        directors, employees, partners, agents, and affiliates shall not be
        liable for any direct, indirect, incidental, special, consequential, or
        punitive damages, including but not limited to loss of profits, data,
        use, goodwill, or other intangible losses resulting from:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>Your access to or use of (or inability to access or use) the Platform</li>
        <li>Any conduct or content of any third party on the Platform</li>
        <li>Any content obtained from the Platform</li>
        <li>Unauthorised access, use, or alteration of your transmissions or content</li>
        <li>
          Loss of employment opportunities, job offers, or career advancement
          resulting from reliance on information provided on the Platform
        </li>
        <li>
          Any errors, inaccuracies, or omissions in job listings or career content
        </li>
      </ul>

      <h2 id="changes" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        9. Changes to This Disclaimer
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We reserve the right to modify or replace this disclaimer at any time.
        Changes will be effective immediately upon posting on this page with an
        updated revision date. Your continued use of the Platform after any
        changes constitutes acceptance of the updated disclaimer.
      </p>

      <h2 id="contact-us" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        10. Contact Us
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        If you have any questions about this disclaimer, please contact us:
      </p>
      <div className="bg-gray-50 rounded-lg p-5 mt-4 border border-gray-100">
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <strong className="text-gray-800">JobReady Kenya</strong>
          </li>
          <li>
            Email:{" "}
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
              href="/terms"
              className="text-[#1a56db] hover:underline no-underline"
            >
              Terms of Service
            </Link>{" "}
            ·{" "}
            <Link
              href="/refunds"
              className="text-[#1a56db] hover:underline no-underline"
            >
              Refund Policy
            </Link>
          </li>
        </ul>
      </div>
    </LegalLayout>
  );
}
