"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Download,
  PlusCircle,
  Receipt,
  Coins,
  Zap,
  TrendingUp,
  FileText,
  Star,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/format";

const STATUS_CONFIG = {
  PAID: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
  PARTIALLY_PAID: { label: "Partial", className: "bg-blue-50 text-blue-700 border-blue-200" },
  UNPAID: { label: "Unpaid", className: "bg-gray-50 text-gray-700 border-gray-200" },
  FAILED: { label: "Failed", className: "bg-red-50 text-red-700 border-red-200" },
  REFUNDED: { label: "Refunded", className: "bg-purple-50 text-purple-700 border-purple-200" },
};

const ORDER_STATUS_CONFIG = {
  PENDING: { label: "Pending", className: "bg-gray-50 text-gray-700 border-gray-200" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-50 text-blue-700 border-blue-200" },
  IN_PROGRESS: { label: "In Progress", className: "bg-amber-50 text-amber-700 border-amber-200" },
  DELIVERED: { label: "Delivered", className: "bg-green-50 text-green-700 border-green-200" },
  REVISION: { label: "Revision", className: "bg-orange-50 text-orange-700 border-orange-200" },
  COMPLETED: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200" },
};

const SERVICE_ICONS = {
  CV_WRITING: FileText,
  COVER_LETTER: CreditCard,
  LINKEDIN_PROFILE: Star,
};

const ITEMS_PER_PAGE = 5;

export default function BillingContent() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!session) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/orders/my?limit=50");
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  // Computed stats from real data
  const totalSpent = orders.reduce((sum, o) => sum + (o.paidAmount || 0), 0);
  const activeOrders = orders.filter(
    (o) => o.status === "IN_PROGRESS" || o.status === "CONFIRMED"
  ).length;
  const unpaidOrders = orders.filter((o) => o.paymentStatus === "UNPAID" || o.paymentStatus === "PARTIALLY_PAID").length;

  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get service name from order items
  const getServiceName = (order) => {
    if (!order.items || order.items.length === 0) return "Unknown";
    return order.items
      .map((item) => item.serviceName || item.tierName || "Service")
      .join(", ");
  };

  const getServiceIcon = (order) => {
    if (!order.items || order.items.length === 0) return Receipt;
    const firstItem = order.items[0];
    const tier = firstItem.serviceTier;
    const serviceType = tier?.serviceType || firstItem.tierName?.toUpperCase() || "";
    if (serviceType.includes("CV")) return FileText;
    if (serviceType.includes("COVER") || serviceType.includes("LETTER")) return CreditCard;
    if (serviceType.includes("LINKEDIN")) return Star;
    return Receipt;
  };

  // Not authenticated
  if (!session) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <CreditCard className="mx-auto size-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Sign in to view your orders</h2>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to access your billing and order history.
          </p>
          <Link href="/login">
            <Button>
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Orders</h1>
          <p className="text-muted-foreground">
            Manage your payments, credits, and invoices
          </p>
        </div>
        <Link href="/cv-services">
          <Button>
            <PlusCircle className="mr-2 size-4" />
            Buy Services
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalSpent)}</p>
              </div>
              <div className="rounded-lg bg-secondary/10 p-3">
                <TrendingUp className="size-5 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold mt-1">{orders.length}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <ShoppingBag className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold mt-1">{activeOrders}</p>
              </div>
              <div className="rounded-lg bg-amber-100 p-3">
                <Zap className="size-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unpaid Orders</p>
                <p className="text-2xl font-bold mt-1">{unpaidOrders}</p>
              </div>
              <div className="rounded-lg bg-red-100 p-3">
                <Receipt className="size-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Pricing Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service Pricing</CardTitle>
          <CardDescription>Quick reference for current pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { service: "CV Writing — Basic", price: "KSh 500", description: "1-page professional CV", icon: FileText },
              { service: "CV Writing — Professional", price: "KSh 1,500", description: "2-page CV + cover letter", icon: FileText },
              { service: "CV Writing — Premium", price: "KSh 3,500", description: "Custom design + consultation", icon: Star },
              { service: "Cover Letter — Basic", price: "KSh 300", description: "1 custom cover letter", icon: CreditCard },
              { service: "Cover Letter — Professional", price: "KSh 800", description: "2 versions + follow-up template", icon: CreditCard },
              { service: "LinkedIn Profile", price: "KSh 1,000", description: "Full profile optimization", icon: Star },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.service} className="flex items-start gap-3 rounded-lg border p-4">
                  <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.service}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <p className="text-sm font-bold text-primary mt-1">{item.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Order History</CardTitle>
              <CardDescription>Your recent service orders and payments</CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {orders.length} orders
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading orders...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">Failed to load orders. Please try again.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto size-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-muted-foreground mb-1">No orders yet</p>
              <p className="text-xs text-muted-foreground mb-4">
                Start by ordering a CV writing service
              </p>
              <Link href="/cv-services">
                <Button size="sm">
                  <PlusCircle className="mr-2 size-4" />
                  Browse Services
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[140px]">Order #</TableHead>
                      <TableHead className="min-w-[160px]">Service</TableHead>
                      <TableHead className="min-w-[100px]">Amount</TableHead>
                      <TableHead className="min-w-[80px]">Payment</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[60px] text-right">Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.map((order) => {
                      const payCfg = STATUS_CONFIG[order.paymentStatus] || STATUS_CONFIG.UNPAID;
                      const orderCfg = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING;
                      const ServiceIcon = getServiceIcon(order);
                      return (
                        <TableRow key={order.id}>
                          <TableCell>
                            <span className="font-mono text-xs">{order.orderNumber}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ServiceIcon className="size-4 text-muted-foreground shrink-0" />
                              <span className="text-sm font-medium line-clamp-1">
                                {getServiceName(order)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-semibold">{formatCurrency(order.totalAmount)}</span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${payCfg.className}`}
                            >
                              {payCfg.label}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${orderCfg.className}`}
                            >
                              {orderCfg.label}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {order.paymentStatus === "PAID" ? (
                              <Button variant="ghost" size="sm" className="text-xs h-7">
                                <Download className="size-3 mr-1" />
                                PDF
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, orders.length)} of{" "}
                    {orders.length} orders
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        className="size-8"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
