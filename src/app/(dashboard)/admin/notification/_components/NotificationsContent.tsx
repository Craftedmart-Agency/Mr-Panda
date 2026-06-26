"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ShoppingBag, RefreshCw, CircleCheck } from "lucide-react";
import { pusherClient } from "@/lib/pusher/client";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  orderId: string | null;
  orderStatus?: string | null;
  isRead: boolean;
  createdAt: string;
}

const PAGE_SIZE = 10;

export default function NotificationsContent() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchNotifications = () => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) setNotifications(data.notifications);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();

    // Read mark (page khulle)
    fetch("/api/notifications", { method: "PATCH" });

    // Real-time — notun notification ashle list e add
    const channel = pusherClient.subscribe("admin-orders");
    channel.bind("new-order", () => {
      fetchNotifications();
    });

    return () => {
      pusherClient.unsubscribe("admin-orders");
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [notifications]);

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [notifications],
  );

  const totalPages = Math.max(1, Math.ceil(sortedNotifications.length / PAGE_SIZE));
  const paginatedNotifications = sortedNotifications.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            নোটিফিকেশন
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            সব নোটিফিকেশন এক জায়গায়
          </p>
        </div>
        <button
          onClick={fetchNotifications}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-secondary"
          aria-label="রিফ্রেশ"
        >
          <RefreshCw className="h-4 w-4 text-foreground" />
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-primary" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {paginatedNotifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => {
                if (notif.orderId) {
                  router.push(`/admin/orders?orderId=${notif.orderId}`);
                }
              }}
              className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left shadow-sm transition-all hover:shadow-md ${
                notif.isRead
                  ? "border-border bg-card"
                  : "border-primary/30 bg-primary/5"
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  notif.type === "new-order" ? "bg-primary/10" : "bg-blue-100"
                }`}
              >
                {notif.type === "new-order" ? (
                  <ShoppingBag className="h-6 w-6 text-primary" />
                ) : (
                  <CircleCheck className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-foreground">{notif.title}</p>
                    {!notif.isRead && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      notif.orderStatus === "DELIVERED"
                        ? "bg-emerald-100 text-emerald-700"
                        : notif.orderStatus === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : notif.orderStatus
                        ? "bg-amber-100 text-amber-800"
                        : notif.type === "new-order"
                        ? "bg-primary/10 text-primary"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {notif.orderStatus === "PENDING"
                      ? "পেন্ডিং"
                      : notif.orderStatus === "ACCEPTED"
                      ? "গৃহীত"
                      : notif.orderStatus === "PREPARING"
                      ? "প্রস্তুত হচ্ছে"
                      : notif.orderStatus === "OUT_FOR_DELIVERY"
                      ? "ডেলিভারিতে"
                      : notif.orderStatus === "DELIVERED"
                      ? "ডেলিভার্ড"
                      : notif.orderStatus === "CANCELLED"
                      ? "বাতিল"
                      : notif.type === "new-order"
                      ? "নতুন অর্ডার"
                      : "আপডেট"}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {notif.message}
                </p>
                {notif.orderId && (
                  <p className="mt-1 text-xs font-medium text-primary">
                    #{notif.orderId.slice(-8).toUpperCase()}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(notif.createdAt).toLocaleString("bn-BD")}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">
            কোনো নোটিফিকেশন নেই
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            নতুন অর্ডার এলে এখানে দেখাবে
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          <p>
            পৃষ্ঠা {page} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded-lg border border-border bg-card px-3 py-1.5 transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              আগের
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-lg border border-border bg-card px-3 py-1.5 transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              পরের
            </button>
          </div>
        </div>
      )}
    </div>
  );
}