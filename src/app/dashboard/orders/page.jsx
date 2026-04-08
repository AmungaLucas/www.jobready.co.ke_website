import { generateMeta } from "@/lib/seo";
import OrdersContent from "./_components/OrdersContent";

export const metadata = generateMeta({
  title: "My Orders",
  description: "Track your CV writing, cover letter, and LinkedIn profile service orders on JobReady Kenya.",
  path: "/dashboard/orders",
});

export default function OrdersPage() {
  return <OrdersContent />;
}
