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
      pusherClient.unsubscribe("admin-orders");
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