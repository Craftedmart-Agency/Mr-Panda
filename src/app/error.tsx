"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, Home, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-6">
      {/* Soft pink background blobs */}
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-destructive/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>

        {/* Message */}
        <h2 className="mt-8 text-2xl font-bold text-foreground sm:text-3xl">
          কিছু একটা সমস্যা হয়েছে
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          দুঃখিত, একটি অপ্রত্যাশিত সমস্যা ঘটেছে। আবার চেষ্টা করুন অথবা কিছুক্ষণ পর
          ফিরে আসুন।
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40 sm:w-auto"
          >
            <RotateCw className="h-4 w-4 transition-transform group-hover:rotate-90" />
            আবার চেষ্টা করুন
          </button>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-border px-8 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary sm:w-auto"
          >
            <Home className="h-4 w-4" />
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}