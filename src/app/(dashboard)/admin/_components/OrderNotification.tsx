"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, ShoppingBag, X, Check, CircleX } from "lucide-react";
import { pusherClient } from "@/lib/pusher/client";
import { toast } from "sonner";

interface PendingOrder {
  orderId: string;
  totalAmount: number;
  time: string;
}

interface Notification {
  id: string;
  orderId: string;
  totalAmount: number;
  time: string;
  read: boolean;
  type: "new-order" | "order-updated";
  status?: string;
}

export default function OrderNotification() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [processing, setProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ringingRef = useRef(false);
  const ringingTimeoutRef = useRef<number | null>(null);

  const currentPending = pendingOrders[0] ?? null;

  // DB থেকে notifications load
  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data.notifications)) return;
        setNotifications(
          data.notifications.map((n: {
            id: string;
            type: string;
            orderId: string | null;
            isRead: boolean;
            createdAt: string;
            orderStatus: string | null;
            orderTotalAmount: number | null;
          }) => ({
            id: n.id,
            orderId: n.orderId ?? "",
            totalAmount: n.orderTotalAmount ?? 0,
            time: new Date(n.createdAt).toLocaleTimeString("bn-BD"),
            read: n.isRead,
            type: (n.type === "new-order" || n.type === "order-updated") ? n.type : "new-order",
            status: n.orderStatus ?? undefined,
          }))
        );
      })
      .catch(() => {});
  }, []);

  // Audio setup
  useEffect(() => {
    const audio = new Audio("/notification.mp3");
    audio.loop = true;
    audioRef.current = audio;
    return () => { audio.pause(); };
  }, []);

  // Autoplay unlock on first interaction
  useEffect(() => {
    const unlock = () => {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0;
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 1;
        }).catch(() => {});
      }
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  const stopRinging = () => {
    ringingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (ringingTimeoutRef.current) {
      window.clearTimeout(ringingTimeoutRef.current);
      ringingTimeoutRef.current = null;
    }
  };

  const startRinging = () => {
    if (ringingRef.current) return;
    ringingRef.current = true;
    audioRef.current?.play().catch(() => {});
    ringingTimeoutRef.current = window.setTimeout(() => {
      ringingRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      ringingTimeoutRef.current = null;
    }, 8000);
  };

  // Pusher
  useEffect(() => {
    if (pusherClient.connection.state === "disconnected") pusherClient.connect();

    const channel = pusherClient.subscribe("admin-orders");

    const handleNewOrder = (data: { orderId: string; totalAmount: number }) => {
      const time = new Date().toLocaleTimeString("bn-BD");

      // Notification history te add
      setNotifications((prev) => [
        {
          id: `${data.orderId}-${Date.now()}`,
          orderId: data.orderId,
          totalAmount: data.totalAmount,
          time,
          read: false,
          type: "new-order" as const,
        },
        ...prev,
      ].slice(0, 20));

      // Accept/Cancel queue te add
      setPendingOrders((prev) => [
        ...prev,
        { orderId: data.orderId, totalAmount: data.totalAmount, time },
      ]);

      startRinging();
    };

    const handleOrderUpdated = (data: { orderId: string; status: string }) => {
      setNotifications((prev) => [
        {
          id: `${data.orderId}-${Date.now()}`,
          orderId: data.orderId,
          totalAmount: 0,
          time: new Date().toLocaleTimeString("bn-BD"),
          read: false,
          type: "order-updated" as const,
          status: data.status,
        },
        ...prev,
      ].slice(0, 20));
    };

    channel.bind("new-order", handleNewOrder);
    channel.bind("order-updated", handleOrderUpdated);

    return () => {
      channel.unbind("new-order", handleNewOrder);
      channel.unbind("order-updated", handleOrderUpdated);
      pusherClient.unsubscribe("admin-orders");
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ringingRef.current = false;
      if (audioRef.current) audioRef.current.pause();
      if (ringingTimeoutRef.current) window.clearTimeout(ringingTimeoutRef.current);
    };
  }, []);

  // Outside click closes dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dismissCurrent = () => {
    stopRinging();
    setPendingOrders((prev) => prev.slice(1));
  };

  const handleAccept = async () => {
    if (!currentPending || processing) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/orders/${currentPending.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED" }),
      });
      if (res.ok) {
        toast.success("অর্ডার গ্রহণ করা হয়েছে");
      } else {
        toast.error("সমস্যা হয়েছে");
      }
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setProcessing(false);
      dismissCurrent();
    }
  };

  const handleReject = async () => {
    if (!currentPending || processing) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/orders/${currentPending.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (res.ok) {
        toast.success("অর্ডার বাতিল করা হয়েছে");
      } else {
        toast.error("সমস্যা হয়েছে");
      }
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setProcessing(false);
      dismissCurrent();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBellClick = () => {
    setOpen((prev) => !prev);
    if (!open) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      fetch("/api/notifications", { method: "PATCH" }).catch(() => {});
    }
  };

  return (
    <>
      {/* Accept / Cancel modal */}
      {currentPending && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-2xl">
            {/* Header */}
            <div className="bg-primary px-6 py-5 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <ShoppingBag className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">নতুন অর্ডার!</h2>
              <p className="mt-1 text-sm text-white/80">
                #{currentPending.orderId.slice(-8).toUpperCase()} · {currentPending.time}
              </p>
            </div>

            {/* Amount */}
            <div className="px-6 py-5 text-center">
              <p className="text-sm text-muted-foreground">মোট পরিমাণ</p>
              <p className="mt-1 text-3xl font-extrabold text-foreground">
                ৳{currentPending.totalAmount}
              </p>
              {pendingOrders.length > 1 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  আরও {pendingOrders.length - 1}টি অর্ডার অপেক্ষায় আছে
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 px-6 pb-6">
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-900 dark:bg-red-950/30 dark:hover:bg-red-950/50"
              >
                <CircleX className="h-4 w-4" />
                বাতিল
              </button>
              <button
                onClick={handleAccept}
                disabled={processing}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                গ্রহণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bell button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleBellClick}
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="নোটিফিকেশন"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Notification history dropdown */}
        {open && (
          <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-bold text-foreground">নোটিফিকেশন</h3>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => {
                      setOpen(false);
                      router.push(`/admin/orders?orderId=${notif.orderId}`);
                    }}
                    className="flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {notif.type === "new-order" ? "নতুন অর্ডার এসেছে" : "অর্ডার আপডেট হয়েছে"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        #{notif.orderId.slice(-8).toUpperCase()}
                        {notif.type === "new-order" ? ` · ৳${notif.totalAmount}` : ` · ${notif.status}`}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{notif.time}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-10 text-center">
                  <Bell className="mx-auto h-8 w-8 text-muted-foreground/30" />
                  <p className="mt-2 text-sm text-muted-foreground">কোনো নোটিফিকেশন নেই</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
