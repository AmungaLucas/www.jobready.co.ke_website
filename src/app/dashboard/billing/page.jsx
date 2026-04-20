import { siteConfig } from "@/config/site-config";
import { Metadata } from "next";
import BillingContent from "./_components/BillingContent";

export const metadata = {
  title: "Billing & Payments",
  description: `Monitor your orders, invoices, and payment history on ${siteConfig.companyName}.`,
};

export default function BillingPage() {
  return <BillingContent />;
}
