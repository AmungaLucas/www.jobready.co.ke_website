import { Metadata } from "next";
import BillingContent from "./_components/BillingContent";

export const metadata = {
  title: "Billing & Payments",
  description: "Monitor your orders, invoices, and payment history on JobReady Kenya.",
};

export default function BillingPage() {
  return <BillingContent />;
}
