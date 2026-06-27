"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CircleCheck,
  CircleX,
  ArrowRight,
  ArrowUpRight,
  UtensilsCrossed,
  Receipt,
} from "lucide-react";
import { useAuth } from "@/lib/firebase/AuthProvider";

interface Stats {
  totalOrders: number;
  activeOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

interface RecentOrder {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: { foodName: string }[];
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "পেন্ডিং", color: "bg-amber-100 text-amber-700" },
  ACCEPTED: { label: "গৃহীত", color: "bg-blue-100 text-blue-700" },
  PREPARING: { label: "প্রস্তুত হচ্ছে", color: "bg-blue-100 text-blue-700" },
  OUT_FOR_DELIVERY: { label: "ডেলিভারিতে", color: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "ডেলিভার্ড", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "বাতিল", color: "bg-red-100 text-red-700" },
};

export default function AccountOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    activeOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/orders/overview?firebaseUid=${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.stats) setStats(data.stats);
          if (data.recentOrders) setRecentOrders(data.recentOrders);
        })
        .catch(() => {})
        .finally(() => setFetching(false));
    }
  }, [user]);

  const statCards = [
    { label: "মোট অর্ডার", value: stats.totalOrders, icon: ShoppingBag, iconBg: "bg-primary/10", iconColor: "text-primary" },
    { label: "চলমান", value: stats.activeOrders, icon: Clock, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
    { label: "ডেলিভার্ড", value: stats.deliveredOrders, icon: CircleCheck, iconBg: "bg-green-100", iconColor: "text-green-600" },
    { label: "বাতিল", value: stats.cancelledOrders, icon: CircleX, iconBg: "bg-red-100", iconColor: "text-red-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner — gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 right-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              স্বাগতম, {user?.displayName || "ইউজার"}! 👋
            </h1>
            <p className="mt-2 text-sm text-primary-foreground/80 sm:text-base">
              আপনার অর্ডারের সারসংক্ষেপ আর দ্রুত অ্যাকশন এক জায়গায়
            </p>
          </div>
          <Link
            href="/recipe"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-transform hover:scale-105"
          >
            অর্ডার করুন
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground">
              {fetching ? "—" : card.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/recipe"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <UtensilsCrossed className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground">খাবার দেখুন</p>
            <p className="text-sm text-muted-foreground">নতুন খাবার আবিষ্কার করুন</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
        <Link
          href="/account/orders"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
            <Receipt className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground">আমার অর্ডার</p>
            <p className="text-sm text-muted-foreground">অর্ডার ট্র্যাক করুন</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-foreground">সাম্প্রতিক অর্ডার</h2>
            <p className="text-sm text-muted-foreground">আপনার সর্বশেষ অর্ডারগুলো</p>
          </div>
          <Link
            href="/account/orders"
            className="flex items-center gap-1 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            সব দেখুন
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {fetching ? (
          <div className="px-6 py-16 text-center text-sm text-muted-foreground">
            লোড হচ্ছে...
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => {
              const status = statusLabels[order.status] || statusLabels.PENDING;
              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary/50"
                >
                  {/* Icon */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {order.items[0]?.foodName || "খাবার"}
                      {order.items.length > 1 && ` +${order.items.length - 1}টি আরও`}
                    </p>
                  </div>

                  {/* Price + status */}
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-sm font-bold text-foreground">
                      ৳{order.totalAmount}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-4 text-base font-medium text-foreground">
              এখনো কোনো অর্ডার নেই
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              মেনু থেকে আপনার প্রথম অর্ডার করুন
            </p>
            <Link
              href="/recipe"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
            >
              খাবার দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}