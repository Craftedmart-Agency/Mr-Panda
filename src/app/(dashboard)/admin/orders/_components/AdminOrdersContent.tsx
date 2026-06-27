"use client";

import { pusherClient } from "@/lib/pusher/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  CircleCheck,
  ChefHat,
  Truck,
  PackageCheck,
  CircleX,
  X,
  Phone,
  MapPin,
  Printer,
} from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  foodName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  phoneNumber: string;
  note: string | null;
  createdAt: string;
  items: OrderItem[];
  user: { name: string; email: string };
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: "পেন্ডিং", color: "bg-amber-100 text-amber-700", icon: Clock },
  ACCEPTED: { label: "গৃহীত", color: "bg-blue-100 text-blue-700", icon: CircleCheck },
  PREPARING: { label: "প্রস্তুত হচ্ছে", color: "bg-indigo-100 text-indigo-700", icon: ChefHat },
  OUT_FOR_DELIVERY: { label: "ডেলিভারিতে", color: "bg-purple-100 text-purple-700", icon: Truck },
  DELIVERED: { label: "ডেলিভার্ড", color: "bg-green-100 text-green-700", icon: PackageCheck },
  CANCELLED: { label: "বাতিল", color: "bg-red-100 text-red-700", icon: CircleX },
};

const statusFlow = [
  "PENDING",
  "ACCEPTED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const filterTabs = [
  { label: "সব", value: "ALL" },
  { label: "পেন্ডিং", value: "PENDING" },
  { label: "চলমান", value: "ACTIVE" },
  { label: "ডেলিভার্ড", value: "DELIVERED" },
  { label: "বাতিল", value: "CANCELLED" },
];

const ROWS_PER_PAGE = 10;

export default function AdminOrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);



  
  const fetchOrders = useCallback(() => {
    fetch(`/api/admin/orders?ts=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    const channel = pusherClient.subscribe("admin-orders");

    const handleOrderUpdated = () => {
      fetchOrders();
    };

    channel.bind("order-updated", handleOrderUpdated);
    channel.bind("new-order", handleOrderUpdated);

    return () => {
      channel.unbind("order-updated", handleOrderUpdated);
      channel.unbind("new-order", handleOrderUpdated);
    };
  }, [fetchOrders]);

  const orderId = searchParams?.get("orderId") ?? null;

  useEffect(() => {
    if (!orderId || orderId === currentOrderId) return;

    const selectedOrder = orders.find((order) => order.id === orderId);
    if (selectedOrder) {
      setSelected(selectedOrder);
      setCurrentOrderId(orderId);
    }
  }, [orders, orderId, currentOrderId]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success("স্ট্যাটাস আপডেট হয়েছে");
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
        setSelected((prev) => (prev ? { ...prev, status } : null));
      } else {
        toast.error("আপডেট করতে সমস্যা");
      }
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setUpdating(false);
      fetchOrders();
    }
  };

  const handlePrint = (order: Order) => {
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharge = Math.round(order.totalAmount - subtotal);
    const logoUrl = `${window.location.origin}/logo.svg`;
    const win = window.open("", "_blank", "width=860,height=900");
    if (!win) return;
    win.document.write(`
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8"/>
  <title>অর্ডার ইনভয়েস — #${order.id.slice(-8).toUpperCase()}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Hind Siliguri',sans-serif;background:#f8fafc;color:#0f172a;min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px}
    .page{background:#fff;width:100%;max-width:680px;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.10)}
    /* ── Header ── */
    .top-bar{background:linear-gradient(135deg,#ec4899,#f43f5e);padding:32px 40px;display:flex;align-items:center;justify-content:space-between}
    .top-bar img{width:90px;height:90px;object-fit:contain;filter:drop-shadow(0 4px 12px rgba(0,0,0,.25))}
    .top-bar-right{text-align:right}
    .top-bar-right h1{font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.5px}
    .top-bar-right p{font-size:13px;color:rgba(255,255,255,.8);margin-top:2px}
    .top-bar-right .invoice-id{margin-top:10px;background:rgba(255,255,255,.2);border-radius:8px;padding:6px 14px;display:inline-block;font-size:13px;font-weight:700;color:#fff;letter-spacing:1px}
    /* ── Meta row ── */
    .meta-row{background:#fdf2f8;display:flex;gap:0;border-bottom:1px solid #fce7f3}
    .meta-cell{flex:1;padding:14px 24px;border-right:1px solid #fce7f3}
    .meta-cell:last-child{border-right:none}
    .meta-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#be185d;margin-bottom:4px}
    .meta-value{font-size:13px;font-weight:600;color:#0f172a}
    /* ── Body ── */
    .body{padding:32px 40px}
    /* customer card */
    .customer-card{background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;padding:20px 24px;margin-bottom:28px}
    .card-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#94a3b8;margin-bottom:14px}
    .cust-name{font-size:16px;font-weight:700;color:#0f172a;margin-bottom:8px}
    .cust-row{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#475569;margin-bottom:6px}
    .cust-row:last-child{margin-bottom:0}
    .cust-dot{width:6px;height:6px;border-radius:50%;background:#ec4899;margin-top:5px;flex-shrink:0}
    /* items table */
    .table-wrap{border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;margin-bottom:20px}
    table{width:100%;border-collapse:collapse}
    thead{background:#f1f5f9}
    th{padding:12px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#64748b}
    th.right,td.right{text-align:right}
    td{padding:13px 16px;font-size:13px;color:#334155;border-top:1px solid #f1f5f9}
    tr:first-child td{border-top:none}
    tr:hover td{background:#fdf9ff}
    td.food-name{font-weight:600;color:#0f172a}
    td.qty{font-size:12px;color:#64748b;text-align:center}
    /* totals */
    .totals{border-radius:12px;border:1px solid #e2e8f0;overflow:hidden}
    .totals-row{display:flex;justify-content:space-between;align-items:center;padding:12px 20px;font-size:13px;color:#475569;border-bottom:1px solid #f1f5f9}
    .totals-row:last-child{border-bottom:none;background:#fdf2f8;padding:16px 20px}
    .totals-row.grand span:first-child{font-size:15px;font-weight:700;color:#0f172a}
    .totals-row.grand span:last-child{font-size:20px;font-weight:800;color:#ec4899}
    /* footer */
    .print-footer{margin-top:32px;text-align:center;padding-top:20px;border-top:1px dashed #e2e8f0}
    .print-footer p{font-size:12px;color:#94a3b8;margin-bottom:4px}
    .print-footer strong{color:#ec4899}
    @media print{
      body{background:#fff;padding:0}
      .page{box-shadow:none;border-radius:0;max-width:100%}
    }
  </style>
</head>
<body>
<div class="page">

  <div class="top-bar">
    <img src="${logoUrl}" alt="মি. পান্ডা লোগো" />
    <div class="top-bar-right">
      <h1>মি. পান্ডা</h1>
      <p>অর্ডার ইনভয়েস</p>
      <div class="invoice-id">#${order.id.slice(-8).toUpperCase()}</div>
    </div>
  </div>

  <div class="meta-row">
    <div class="meta-cell">
      <div class="meta-label">তারিখ</div>
      <div class="meta-value">${new Date(order.createdAt).toLocaleDateString("bn-BD")}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">সময়</div>
      <div class="meta-value">${new Date(order.createdAt).toLocaleTimeString("bn-BD")}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">মোট আইটেম</div>
      <div class="meta-value">${order.items.length}টি</div>
    </div>
  </div>

  <div class="body">

    <div class="customer-card">
      <div class="card-title">কাস্টমার তথ্য</div>
      <div class="cust-name">${order.user.name}</div>
      <div class="cust-row"><span class="cust-dot"></span>${order.user.email}</div>
      <div class="cust-row"><span class="cust-dot"></span>${order.phoneNumber}</div>
      <div class="cust-row"><span class="cust-dot"></span>${order.deliveryAddress}</div>
    </div>

    <div class="card-title" style="margin-bottom:12px">অর্ডার আইটেম</div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>খাবার</th>
            <th style="text-align:center">পরিমাণ</th>
            <th class="right">একক মূল্য</th>
            <th class="right">মোট</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map((item) => `
          <tr>
            <td class="food-name">${item.foodName}</td>
            <td class="qty">${item.quantity}টি</td>
            <td class="right">৳${item.price.toFixed(0)}</td>
            <td class="right">৳${(item.price * item.quantity).toFixed(0)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>

    <div class="totals">
      <div class="totals-row">
        <span>সাবটোটাল</span>
        <span>৳${subtotal.toFixed(0)}</span>
      </div>
      <div class="totals-row">
        <span>ডেলিভারি চার্জ</span>
        <span>৳${deliveryCharge > 0 ? deliveryCharge.toFixed(0) : "০"}</span>
      </div>
      <div class="totals-row grand">
        <span>সর্বমোট</span>
        <span>৳${order.totalAmount.toFixed(0)}</span>
      </div>
    </div>

    <div class="print-footer">
      <p>ধন্যবাদ আমাদের সাথে থাকার জন্য!</p>
      <p><strong>মি. পান্ডা রেস্টুরেন্ট</strong> — সুস্বাদু খাবার, দ্রুত ডেলিভারি</p>
    </div>

  </div>
</div>
<script>window.onload=()=>{window.print()}<\/script>
</body>
</html>`);
    win.document.close();
  };

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      // Filter tab
      let matchFilter = true;
      if (filter === "ACTIVE") {
        matchFilter = ["ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY"].includes(
          order.status
        );
      } else if (filter !== "ALL") {
        matchFilter = order.status === filter;
      }
      // Search (order id, user name, email)
      const matchSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.user.name.toLowerCase().includes(search.toLowerCase()) ||
        order.user.email.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [orders, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">অর্ডার</h1>
        <p className="mt-1.5 text-base text-muted-foreground">
          সব অর্ডার ম্যানেজ করুন
        </p>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setFilter(tab.value);
                setPage(1);
              }}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:bg-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 shadow-sm focus-within:border-primary sm:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="অর্ডার আইডি, নাম খুঁজুন"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Orders table */}
      {loading ? (
        <div className="flex min-h-75 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-primary" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-left">
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">অর্ডার আইডি</th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">কাস্টমার</th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">আইটেম</th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">মোট</th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">স্ট্যাটাস</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.PENDING;
                  return (
                    <tr key={order.id} className="transition-colors hover:bg-secondary/20">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-primary">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-foreground">{order.user.name}</p>
                        <p className="text-xs text-muted-foreground">{order.user.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {order.items.length}টি
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-foreground">
                        ৳{order.totalAmount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelected(order)}
                          className="cursor-pointer rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          বিস্তারিত
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-border lg:hidden">
            {paginated.map((order) => {
              const status = statusConfig[order.status] || statusConfig.PENDING;
              return (
                <div key={order.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-primary">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm font-medium text-foreground">{order.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length}টি আইটেম · ৳{order.totalAmount}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                      <status.icon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelected(order)}
                    className="mt-3 w-full cursor-pointer rounded-lg bg-primary/10 py-2 text-xs font-semibold text-primary"
                  >
                    বিস্তারিত দেখুন
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-border bg-secondary/20 px-6 py-4 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                {(page - 1) * ROWS_PER_PAGE + 1}–
                {Math.min(page * ROWS_PER_PAGE, filtered.length)} / {filtered.length}টি অর্ডার
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-primary disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 cursor-pointer rounded-full text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card hover:border-primary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-primary disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">কোনো অর্ডার নেই</p>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => {
            setSelected(null);
            setCurrentOrderId(null);
            router.replace("/admin/orders", { scroll: false });
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  #{selected.id.slice(-8).toUpperCase()}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {new Date(selected.createdAt).toLocaleString("bn-BD")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrint(selected)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Printer className="h-3.5 w-3.5" />
                  প্রিন্ট
                </button>
                <button
                  onClick={() => {
                    setSelected(null);
                    setCurrentOrderId(null);
                    router.replace("/admin/orders", { scroll: false });
                  }}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-secondary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Customer */}
            <div className="mb-4 rounded-xl bg-secondary/30 p-4">
              <p className="text-sm font-semibold text-foreground">{selected.user.name}</p>
              <p className="text-xs text-muted-foreground">{selected.user.email}</p>
              <div className="mt-2 flex items-start gap-2 text-sm text-foreground">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {selected.phoneNumber}
              </div>
              <div className="mt-1 flex items-start gap-2 text-sm text-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {selected.deliveryAddress}
              </div>
              {selected.note && (
                <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                  <span className="font-semibold">নির্দেশনা: </span>{selected.note}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="mb-4">
              <p className="mb-2 text-sm font-semibold text-foreground">আইটেম</p>
              <div className="space-y-2">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">
                      {item.foodName} <span className="text-muted-foreground">x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-foreground">
                      ৳{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-3">
                <span className="font-bold text-foreground">মোট</span>
                <span className="text-lg font-bold text-primary">৳{selected.totalAmount}</span>
              </div>
            </div>

            {/* Status update */}
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">স্ট্যাটাস পরিবর্তন</p>
              <div className="grid grid-cols-2 gap-2">
                {statusFlow.map((s) => {
                  const cfg = statusConfig[s];
                  const isCurrent = selected.status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(selected.id, s)}
                      disabled={updating || isCurrent}
                      className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all disabled:opacity-60 ${
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-card text-foreground hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      <cfg.icon className="h-3.5 w-3.5" />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Cancel */}
              <button
                onClick={() => handleStatusUpdate(selected.id, "CANCELLED")}
                disabled={updating || selected.status === "CANCELLED"}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-60"
              >
                <CircleX className="h-3.5 w-3.5" />
                অর্ডার বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}