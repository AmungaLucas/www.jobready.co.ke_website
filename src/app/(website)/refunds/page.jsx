import { generateMeta } from "@/lib/seo";
import LegalLayout from "@/app/(website)/_components/LegalLayout";
import Link from "next/link";
import { siteConfig } from "@/config/site-config";
import ContactInfoCard from "@/app/(website)/_components/ContactInfoCard";

export const metadata = generateMeta({
  title: `Refund Policy — ${siteConfig.companyName}`,
  description:
    `Read ${siteConfig.brandName}'s Refund Policy. Understand our refund terms for CV writing services, premium features, and M-Pesa payments.`,
  path: "/refunds",
});

export default function RefundsPage() {
  return (
    <LegalLayout title="Refund Policy" lastUpdated="April 2026">
      <h2 id="overview" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        1. Overview
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        This Refund Policy applies to all paid services offered by {siteConfig.brandName},
        including but not limited to professional CV writing, cover letter
        creation, LinkedIn profile optimisation, and any other premium services
        for which a fee is charged. All payments are processed via M-Pesa
        (Safaricom) in Kenya Shillings (KSh).
      </p>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We are committed to providing high-quality services and customer
        satisfaction. However, because our services involve custom creative work
        and dedicated professional time, refunds are subject to the conditions
        outlined below. By purchasing any service from {siteConfig.shortName}, you acknowledge
        and agree to the terms of this policy.
      </p>

      <h2 id="refund-eligibility" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        2. Refund Eligibility
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        You may be eligible for a refund under the following circumstances:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Duplicate payment</strong> — if you were charged more than once
          for the same service due to a technical error or M-Pesa issue, we will
          issue a full refund of the duplicate amount within 3 business days
        </li>
        <li>
          <strong>Service not delivered</strong> — if we fail to deliver your
          completed CV, cover letter, or other service within the stated
          delivery timeframe and you no longer wish to proceed, you are entitled
          to a full refund
        </li>
        <li>
          <strong>Significant quality issues</strong> — if the delivered service
          materially deviates from what was agreed upon (for example, wrong
          professional field, incorrect information despite accurate data
          provided), you may request a refund after utilising the included
          revision rounds
        </li>
        <li>
          <strong>Technical error on our part</strong> — if a platform error or
          system failure on our end prevents the delivery of a purchased service,
          a full refund will be issued
        </li>
      </ul>

      <h2 id="non-refundable-services" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        3. Non-Refundable Services
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        The following situations are not eligible for a refund:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Change of mind</strong> — if you simply change your mind after
          the service has commenced and our writer has already begun working on
          your document
        </li>
        <li>
          <strong>Inaccurate information provided</strong> — if the final
          document contains errors resulting from inaccurate, incomplete, or
          misleading information you supplied
        </li>
        <li>
          <strong>Expired deadline to claim</strong> — refund requests must be
          made within 7 days of service delivery. Requests made after this
          window cannot be processed
        </li>
        <li>
          <strong>Revisions not utilised</strong> — if you are dissatisfied with
          the result but have not used the free revision rounds included in your
          service tier, you must request revisions before seeking a refund
        </li>
        <li>
          <strong>Third-party actions</strong> — issues arising from M-Pesa
          network failures, Safaricom outages, or other circumstances beyond our
          reasonable control
        </li>
        <li>
          <strong>Account suspension or termination</strong> — fees paid for
          services are non-refundable if your account is suspended or terminated
          due to violations of our{" "}
          <Link
            href="/terms"
            className="text-[#1a56db] font-medium hover:underline no-underline"
          >
            Terms of Service
          </Link>
        </li>
      </ul>

      <h2 id="how-to-request" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        4. How to Request a Refund
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        To request a refund, please follow these steps:
      </p>
      <ol className="list-decimal pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          Send an email to{" "}
          <a
            href={`mailto:${siteConfig.email.payments}`}
            className="text-[#1a56db] font-medium hover:underline no-underline"
          >
            {siteConfig.email.payments}
          </a>{" "}
          with the subject line &quot;Refund Request — [Your Order Number]&quot;
        </li>
        <li>
          Include your full name, phone number, M-Pesa phone number used for
          payment, the date of payment, and the M-Pesa transaction code (confirmation
          message from Safaricom)
        </li>
        <li>
          Provide a clear explanation of the reason for your refund request
        </li>
        <li>
          Attach any relevant supporting documents, such as the delivered CV or
          communication with our team
        </li>
      </ol>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Alternatively, you may contact us through our{" "}
        <Link
          href="/contact"
          className="text-[#1a56db] font-medium hover:underline no-underline"
        >
          Contact Page
        </Link>{" "}
        or via WhatsApp at{" "}
        <a
          href={siteConfig.whatsapp.link}
          className="text-[#1a56db] hover:underline no-underline"
        >
          {siteConfig.whatsapp.display}
        </a>
        .
      </p>

      <h2 id="processing-time" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        5. Processing Time
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Once your refund request is received and approved, the refund will be
        processed as follows:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Review period</strong> — all refund requests are reviewed
          within 2 business days of receipt
        </li>
        <li>
          <strong>Refund method</strong> — approved refunds are sent directly
          to your M-Pesa phone number via the M-Pesa Business API
        </li>
        <li>
          <strong>Processing time</strong> — approved refunds are typically
          processed within 3 to 5 business days after approval
        </li>
        <li>
          <strong>Confirmation</strong> — you will receive an SMS confirmation
          from M-Pesa once the refund has been sent to your phone
        </li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Please note that M-Pesa transaction delays may occasionally occur
        beyond our control. If you have not received your refund after 7
        business days, please contact us again so we can follow up.
      </p>

      <h2 id="partial-refunds" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        6. Partial Refunds
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        In some cases, a partial refund may be issued at our discretion:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 text-[0.95rem] mb-4">
        <li>
          <strong>Service partially delivered</strong> — if a service package
          includes multiple deliverables (for example, a CV and cover letter
          bundle) and only some deliverables have been completed
        </li>
        <li>
          <strong>Minor quality concerns</strong> — if the delivered work has
          minor issues that fall short of the refund threshold but still warrant
          some compensation
        </li>
        <li>
          <strong>Downgrade request</strong> — if you request to downgrade to a
          lower service tier after work has commenced, a partial refund for the
          price difference may be considered
        </li>
      </ul>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Partial refunds are calculated based on the proportion of work
        completed versus the total service scope, and are determined on a
        case-by-case basis.
      </p>

      <h2 id="free-services" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        7. Free Services
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        Core features of {siteConfig.brandName} — including browsing and applying for
        jobs, creating a profile, saving jobs, setting up job alerts, and
        reading career articles — are completely free of charge. No refund
        policy applies to free services as no payment is required.
      </p>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        We may introduce premium features or subscription plans in the future.
        The refund terms for any such services will be clearly communicated
        before purchase and will be governed by this policy unless otherwise
        stated.
      </p>

      <h2 id="contact-us" className="text-xl font-bold text-gray-900 mb-3 mt-8">
        8. Contact Us
      </h2>
      <p className="text-gray-600 leading-relaxed text-[0.95rem] mb-4">
        If you have any questions about this Refund Policy, please contact us:
      </p>
      <ContactInfoCard show={["payments", "support", "whatsapp", "contactPage"]} />
    </LegalLayout>
  );
}
