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
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  ArrowRight,
} from "lucide-react";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    variant: "outline",
    color: "text-yellow-700 bg-yellow-50 border-yellow-200",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    variant: "default",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    icon: CheckCircle2,
  },
  IN_PROGRESS: {
    label: "In Progress",
    variant: "default",
    color: "text-indigo-700 bg-indigo-50 border-indigo-200",
    icon: Loader2,
  },
  DELIVERED: {
    label: "Delivered",
    variant: "default",
    color: "text-green-700 bg-green-50 border-green-200",
    icon: CheckCircle2,
  },
  REVISION: {
    label: "Revision",
    variant: "default",
    color: "text-orange-700 bg-orange-50 border-orange-200",
    icon: AlertCircle,
  },
  COMPLETED: {
    label: "Completed",
    variant: "default",
    color: "text-green-700 bg-green-50 border-green-200",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "destructive",
    color: "text-red-700 bg-red-50 border-red-200",
    icon: XCircle,
  },
};

const PAYMENT_STATUS_CONFIG = {
  UNPAID: { label: "Unpaid", color: "text-red-600" },
  PARTIALLY_PAID: { label: "Partial", color: "text-yellow-600" },
  PAID: { label: "Paid", color: "text-green-600" },
  REFUNDED: { label: "Refunded", color: "text-gray-600" },
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersContent() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      if (status !== "authenticated") return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/orders/my?page=${page}&limit=10`);
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();
        setOrders(data.orders || []);
        setPagination(data.pagination || null);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [status, page]);

  if (status === "loading" || loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground mt-1">Track your service orders</p>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex justify-between">
                  <div className="h-5 w-32 bg-muted rounded" />
                  <div className="h-6 w-20 bg-muted rounded-full" />
                </div>
                <div className="h-4 w-48 bg-muted rounded" />
                <div className="flex gap-4">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="size-8 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Sign In Required</h3>
          <p className="text-sm text-muted-foreground mt-1">Please sign in to view your orders.</p>
          <Button asChild className="mt-4">
            <Link href="/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground mt-1">
            Track your CV writing, cover letter, and LinkedIn profile orders
          </p>
        </div>
        <Button asChild>
          <Link href="/cv-services">
            <FileText className="mr-2 size-4" />
            Order New Service
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="size-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      {orders.length === 0 && !error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Package className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No Orders Yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              You haven&apos;t placed any service orders yet. Browse our CV writing, cover letter, and LinkedIn profile services.
            </p>
            <Button asChild className="mt-4">
              <Link href="/cv-services">
                Browse Services
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
            const paymentCfg = PAYMENT_STATUS_CONFIG[order.paymentStatus] || PAYMENT_STATUS_CONFIG.UNPAID;
            const StatusIcon = statusCfg.icon;

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Package className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={statusCfg.variant}
                        className={`text-xs ${statusCfg.color}`}
                      >
                        <StatusIcon className="mr-1 size-3" />
                        {statusCfg.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <span className={paymentCfg.color}>{paymentCfg.label}</span>
                      </Badge>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-4 space-y-3">
                    {/* Service Items */}
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="size-3.5 text-muted-foreground shrink-0" />
                            <span className="text-gray-700">{item.serviceName}</span>
                            {item.tierName && (
                              <span className="text-xs text-muted-foreground">
                                ({item.tierName})
                              </span>
                            )}
                          </div>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                    {order.balanceDue > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-yellow-600">Balance Due</span>
                        <span className="font-semibold text-yellow-600">
                          {formatCurrency(order.balanceDue)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrev}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
