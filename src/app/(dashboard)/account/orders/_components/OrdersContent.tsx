"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ChevronRight,
  Clock,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { useAuth } from "@/lib/firebase/AuthProvider";

interface OrderItem {
  foodName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "পেন্ডিং", color: "bg-amber-100 text-amber-700" },
  ACCEPTED: { label: "গৃহীত", color: "bg-blue-100 text-blue-700" },
  PREPARING: { label: "প্রস্তুত হচ্ছে", color: "bg-blue-100 text-blue-700" },
  OUT_FOR_DELIVERY: { label: "ডেলিভারিতে", color: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "ডেলিভার্ড", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "বাতিল", color: "bg-red-100 text-red-700" },
};

const filterTabs = [
  { label: "সব", value: "ALL" },
  { label: "চলমান", value: "ACTIVE" },
  { label: "ডেলিভার্ড", value: "DELIVERED" },
  { label: "বাতিল", value: "CANCELLED" },
];

export default function OrdersContent() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (user) {
      fetch(`/api/orders?firebaseUid=${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    if (filter === "ALL") return true;
    if (filter === "ACTIVE")
      return ["PENDING", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY"].includes(
        order.status
      );
    return order.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          আমার অর্ডার
        </h1>
        <p className="mt-1.5 text-base text-muted-foreground">
          আপনার সব অর্ডার এক জায়গায়
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`shrink-0 cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              filter === tab.value
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-primary" />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const status = statusLabels[order.status] || statusLabels.PENDING;
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {order.items[0]?.foodName || "খাবার"}
                        {order.items.length > 1 &&
                          ` +${order.items.length - 1}টি আরও`}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("bn-BD", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-base font-bold text-foreground">
                      ৳{order.totalAmount}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)}টি আইটেম
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-primary">
                    বিস্তারিত
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">
            {filter === "ALL" ? "এখনো কোনো অর্ডার নেই" : "এই ধরনের অর্ডার নেই"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            মেনু থেকে আপনার প্রথম অর্ডার করুন
          </p>
          <Link
            href="/recipe"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
          >
            খাবার দেখুন
          </Link>
        </div>
      )}
    </div>
  );
}