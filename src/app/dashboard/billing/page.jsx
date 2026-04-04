import { Metadata } from "next";
import BillingContent from "./_components/BillingContent";

export const metadata = {
  title: "Billing | Dashboard",
};

export default function BillingPage() {
  return <BillingContent />;
}
