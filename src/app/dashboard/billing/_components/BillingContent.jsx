"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/format";

// ── Mock Data ──────────────────────────────────────────
const MOCK_ORDERS = [
  {
    id: "JR-20260328-1A2B",
    service: "Job Posting",
    description: "Senior Software Engineer — Safaricom PLC",
    amount: 1500,
    status: "PAID",
    date: "2026-03-28",
    paymentMethod: "M-Pesa",
  },
  {
    id: "JR-20260325-3C4D",
    service: "Featured Listing",
    description: "Financial Analyst — Safaricom PLC",
    amount: 2000,
    status: "PAID",
    date: "2026-03-25",
    paymentMethod: "M-Pesa",
  },
  {
    id: "JR-20260320-5E6F",
    service: "Job Posting",
    description: "Network Engineer — Safaricom PLC",
    amount: 1500,
    status: "PAID",
    date: "2026-03-20",
    paymentMethod: "M-Pesa",
  },
  {
    id: "JR-20260315-7G8H",
    service: "CV Package (5 Downloads)",
    description: "Download applicant CVs for Marketing Manager",
    amount: 2500,
    status: "PAID",
    date: "2026-03-15",
    paymentMethod: "Card",
  },
  {
    id: "JR-20260310-9I0J",
    service: "Featured Listing",
    description: "Product Manager — M-PESA",
    amount: 2000,
    status: "PENDING",
    date: "2026-03-10",
    paymentMethod: "M-Pesa",
  },
  {
    id: "JR-20260305-1K2L",
    service: "Job Posting",
    description: "HR Intern — Safaricom PLC",
    amount: 1500,
    status: "FAILED",
    date: "2026-03-05",
    paymentMethod: "M-Pesa",
  },
];

const STATUS_CONFIG = {
  PAID: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
  FAILED: { label: "Failed", className: "bg-red-50 text-red-700 border-red-200" },
};

const SERVICE_ICONS = {
  "Job Posting": Briefcase,
  "Featured Listing": Star,
  "CV Package (5 Downloads)": FileText,
};

const ITEMS_PER_PAGE = 5;

export default function BillingContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(MOCK_ORDERS.length / ITEMS_PER_PAGE));
  const paginatedOrders = MOCK_ORDERS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
        <Button>
          <PlusCircle className="mr-2 size-4" />
          Buy Credits
        </Button>
      </div>

      {/* Plan/Credits Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Credits</p>
                <p className="text-2xl font-bold mt-1">KSh 5,000</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <Coins className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(9500)}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold mt-1">1</p>
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
                <p className="text-sm font-medium text-muted-foreground">Job Postings Used</p>
                <p className="text-2xl font-bold mt-1">5 / 10</p>
              </div>
              <div className="rounded-lg bg-purple/10 p-3">
                <Briefcase className="size-5 text-purple" />
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-1/2 rounded-full bg-purple" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service Pricing</CardTitle>
          <CardDescription>Quick reference for current pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { service: "Standard Job Posting", price: "KSh 1,500", description: "30-day active listing", icon: Briefcase },
              { service: "Featured Listing", price: "KSh 2,000", description: "Boost your job to the top", icon: Star },
              { service: "CV Access Package", price: "KSh 2,500", description: "Download 5 applicant CVs", icon: FileText },
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
              <CardDescription>Your recent transactions and invoices</CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {MOCK_ORDERS.length} orders
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">Order #</TableHead>
                  <TableHead className="min-w-[180px]">Service</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[60px] text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => {
                  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                  const ServiceIcon = SERVICE_ICONS[order.service] || Receipt;
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <span className="font-mono text-xs">{order.id}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ServiceIcon className="size-4 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium">{order.service}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {order.description}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold">{formatCurrency(order.amount)}</span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusCfg.className}`}
                        >
                          {statusCfg.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(order.date)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status === "PAID" ? (
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
                {Math.min(currentPage * ITEMS_PER_PAGE, MOCK_ORDERS.length)} of{" "}
                {MOCK_ORDERS.length} orders
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
        </CardContent>
      </Card>
    </div>
  );
}
