"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CircleCheck,
  Clock,
  ChefHat,
  Truck,
  PackageCheck,
  CircleX,
  MapPin,
  Phone,
} from "lucide-react";

interface OrderItem {
  id: string;
  foodName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  phoneNumber: string;
  createdAt: string;
  items: OrderItem[];
}

// Track steps (order onujayi)
const trackSteps = [
  { status: "PENDING", label: "অর্ডার পেয়েছি", icon: Clock },
  { status: "ACCEPTED", label: "গৃহীত হয়েছে", icon: CircleCheck },
  { status: "PREPARING", label: "প্রস্তুত হচ্ছে", icon: ChefHat },
  { status: "OUT_FOR_DELIVERY", label: "ডেলিভারিতে", icon: Truck },
  { status: "DELIVERED", label: "ডেলিভার্ড", icon: PackageCheck },
];

const statusOrder = ["PENDING", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

export default function OrderTrackContent() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <p className="text-base font-medium text-foreground">অর্ডার পাওয়া যায়নি</p>
        <Link
          href="/account/orders"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          অর্ডার লিস্টে ফিরুন
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === "CANCELLED";
  const currentStepIndex = statusOrder.indexOf(order.status);

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        অর্ডার লিস্ট
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div>
          <p className="text-sm text-muted-foreground">অর্ডার নম্বর</p>
          <p className="text-xl font-bold text-foreground">
            #{order.id.slice(-8).toUpperCase()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("bn-BD", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">মোট</p>
          <p className="text-2xl font-bold text-primary">৳{order.totalAmount}</p>
        </div>
      </div>

      {/* Track timeline */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-foreground">অর্ডার ট্র্যাকিং</h2>

        {isCancelled ? (
          <div className="flex items-center gap-4 rounded-xl bg-red-50 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <CircleX className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="font-bold text-red-700">অর্ডার বাতিল হয়েছে</p>
              <p className="text-sm text-red-600/80">এই অর্ডারটি বাতিল করা হয়েছে</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {trackSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isLast = index === trackSteps.length - 1;

              return (
                <div key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
                  {/* Line */}
                  {!isLast && (
                    <div
                      className={`absolute left-6 top-12 h-full w-0.5 ${
                        index < currentStepIndex ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>

                  {/* Label */}
                  <div className="pt-2.5">
                    <p
                      className={`font-semibold ${
                        isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-primary">বর্তমান অবস্থা</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delivery info */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-foreground">ডেলিভারি তথ্য</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">ঠিকানা</p>
              <p className="text-sm text-foreground">{order.deliveryAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">ফোন</p>
              <p className="text-sm text-foreground">{order.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-foreground">অর্ডার আইটেম</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {item.quantity}x
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item.foodName}
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                ৳{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="font-bold text-foreground">সর্বমোট</span>
          <span className="text-lg font-bold text-primary">৳{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
}