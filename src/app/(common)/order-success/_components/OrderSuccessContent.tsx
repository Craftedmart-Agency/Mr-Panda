"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleCheck, Home, ClipboardList, Clock } from "lucide-react";

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "ORD000000";

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-6 pt-20">
      {/* Soft pink background */}
      <div className="pointer-events-none absolute -left-20 top-10 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-lg py-16 text-center">
        {/* Success icon with pulse */}
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
          <span className="absolute h-full w-full animate-ping rounded-full bg-primary/20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary">
            <CircleCheck className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>

        {/* Message */}
        <h1 className="mt-8 text-3xl font-bold text-foreground sm:text-4xl">
          অর্ডার সফল হয়েছে!
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          আপনার অর্ডারটি গ্রহণ করা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব আর
          খাবার প্রস্তুত করা শুরু করব।
        </p>

        {/* Order ID */}
        <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 shadow-sm">
          <ClipboardList className="h-5 w-5 text-primary" />
          <div className="text-left">
            <p className="text-xs text-muted-foreground">অর্ডার আইডি</p>
            <p className="text-lg font-bold text-foreground">{orderId}</p>
          </div>
        </div>

        {/* Estimated time */}
        <div className="mx-auto mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          আনুমানিক ডেলিভারি সময়: ৩০-৪৫ মিনিট
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/account/orders"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40 sm:w-auto"
          >
            <ClipboardList className="h-4 w-4" />
            অর্ডার ট্র্যাক করুন
          </Link>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary sm:w-auto"
          >
            <Home className="h-4 w-4" />
            হোমে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
}