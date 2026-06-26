"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, ShoppingBag, X, BellRing, VolumeX } from "lucide-react";
import { pusherClient } from "@/lib/pusher/client";
import { toast } from "sonner";

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
  const NOTIFICATION_STORAGE_KEY = "admin-order-notifications";

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const saved = window.localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved) as unknown;
      if (!Array.isArray(parsed)) return [];

      return parsed.filter(
        (item): item is Notification => {
          if (typeof item !== "object" || item === null) return false;

          const candidate = item as Record<string, unknown>;

          return (
            typeof candidate.id === "string" &&
            typeof candidate.orderId === "string" &&
            typeof candidate.totalAmount === "number" &&
            typeof candidate.time === "string" &&
            typeof candidate.read === "boolean" &&
            (candidate.type === "new-order" || candidate.type === "order-updated")
          );
        }
      );
    } catch {
      return [];
    }
  });

  const [open, setOpen] = useState(false);
  const [ringing, setRinging] = useState(false); // sound bajche kina
  const dropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ringingTimeoutRef = useRef<number | null>(null);

  // Persist notification history when it changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
      }
    } catch {
      // ignore storage failures
    }
  }, [notifications]);

  // Sound setup (loop)
  useEffect(() => {
    const audio = new Audio("/notification.mp3");
    audio.loop = true; // continuous loop
    audioRef.current = audio;
    return () => {
      audio.pause();
    };
  }, []);

  // Sound start
  const startRinging = () => {
    if (ringing) {
      return;
    }

    stopRinging();
    setRinging(true);
    audioRef.current?.play().catch(() => {});

    ringingTimeoutRef.current = window.setTimeout(() => {
      stopRinging();
    }, 8000);
  };

  // Sound stop
  const stopRinging = () => {
    setRinging(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (ringingTimeoutRef.current) {
      window.clearTimeout(ringingTimeoutRef.current);
      ringingTimeoutRef.current = null;
    }
  };

  // Pusher — notun order
  useEffect(() => {
    if (pusherClient.connection.state === "disconnected") {
      pusherClient.connect();
    }

    const channel = pusherClient.subscribe("admin-orders");

    const handleNewOrder = (data: { orderId: string; totalAmount: number }) => {
      const newNotif: Notification = {
        id: `${data.orderId}-${Date.now()}`,
        orderId: data.orderId,
        totalAmount: data.totalAmount,
        time: new Date().toLocaleTimeString("bn-BD"),
        read: false,
        type: "new-order",
      };

      setNotifications((prev) => [newNotif, ...prev].slice(0, 20));

      startRinging();

      toast.success("নতুন অর্ডার এসেছে! 🔔", {
        description: `৳${data.totalAmount} এর একটি অর্ডার`,
      });
    };

    const handleOrderUpdated = (data: { orderId: string; status: string }) => {
      const updateNotif: Notification = {
        id: `${data.orderId}-${Date.now()}`,
        orderId: data.orderId,
        totalAmount: 0,
        time: new Date().toLocaleTimeString("bn-BD"),
        read: false,
        type: "order-updated",
        status: data.status,
      };

      setNotifications((prev) => [updateNotif, ...prev].slice(0, 20));

      toast.success("অর্ডার আপডেট হয়েছে", {
        description: `স্ট্যাটাস: ${data.status}`,
      });
    };

    const handleConnected = () => {
      console.log("Pusher connected to admin-orders channel");
    };

    const handleSubscriptionError = (err: unknown) => {
      console.error("Pusher subscription error:", err);
    };

    const handleConnectionError = (err: unknown) => {
      console.error("Pusher connection error:", err);
    };

    channel.bind("pusher:subscription_succeeded", handleConnected);
    channel.bind("pusher:subscription_error", handleSubscriptionError);
    channel.bind("new-order", handleNewOrder);
    channel.bind("order-updated", handleOrderUpdated);
    pusherClient.connection.bind("connected", handleConnected);
    pusherClient.connection.bind("error", handleConnectionError);

    return () => {
      channel.unbind("pusher:subscription_succeeded", handleConnected);
      channel.unbind("pusher:subscription_error", handleSubscriptionError);
      channel.unbind("new-order", handleNewOrder);
      channel.unbind("order-updated", handleOrderUpdated);
      pusherClient.connection.unbind("connected", handleConnected);
      pusherClient.connection.unbind("error", handleConnectionError);
      pusherClient.unsubscribe("admin-orders");
    };
  }, []);

  // Baire click bondho (dropdown)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (ringingTimeoutRef.current !== null) {
        window.clearTimeout(ringingTimeoutRef.current);
      }
      stopRinging();
    };
  }, []);

  useEffect(() => {
    if (open) {
      stopRinging();
    }
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Bell click — sound stop + dropdown open + read mark
  const handleBellClick = () => {
    stopRinging(); // ⚠️ click korle sound bondho
    setOpen(!open);
    if (!open) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-colors ${
          ringing
            ? "bg-red-100 text-red-600"
            : "text-foreground/60 hover:bg-secondary hover:text-foreground"
        }`}
        aria-label="নোটিফিকেশন"
      >
        {ringing ? (
          <BellRing className="h-5 w-5 animate-bounce" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Ringing hole — floating stop bar (jotokkhon na stop kore) */}
      {ringing && !open && (
        <div className="absolute right-0 top-12 z-50 flex w-64 items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 shadow-xl">
          <BellRing className="h-5 w-5 shrink-0 animate-bounce text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">নতুন অর্ডার!</p>
            <p className="text-xs text-red-600/80">
              {unreadCount}টি নতুন অর্ডার এসেছে
            </p>
          </div>
          <button
            onClick={stopRinging}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-red-600 text-white transition-colors hover:bg-red-700"
            aria-label="সাউন্ড বন্ধ"
          >
            <VolumeX className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Dropdown */}
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
                    stopRinging();
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
                      #{notif.orderId.slice(-8).toUpperCase()} {notif.type === "new-order" ? `· ৳${notif.totalAmount}` : `· ${notif.status}`}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{notif.time}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-10 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">
                  কোনো নোটিফিকেশন নেই
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}