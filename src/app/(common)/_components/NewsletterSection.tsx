"use client";

import Image from "next/image";
import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed:", email);
  };

  return (
    <section className="w-full px-4 py-16 sm:px-6 lg:px-12 lg:py-20">
      <div className="relative mx-auto min-h-[440px] max-w-[1400px] overflow-hidden rounded-[2rem] sm:min-h-[480px] sm:rounded-[2.5rem]">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
          alt="পান্ডা রেস্টুরেন্টের পরিবেশ"
          fill
          sizes="(max-width: 1400px) 100vw, 1400px"
          className="object-cover"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[440px] flex-col items-center justify-center px-5 py-14 text-center sm:min-h-[480px] sm:px-10 sm:py-20">
          <h2 className="max-w-3xl text-xl font-bold leading-snug text-white sm:text-3xl lg:text-4xl">
            আমাদের প্রোমো কোড পেতে সাবস্ক্রাইব করুন
            <br className="hidden sm:block" />
            <span className="sm:inline"> </span>আর জানুন খাবারের সব আপডেট
          </h2>

          {/* Subscribe form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex w-full max-w-xl flex-col gap-3 rounded-3xl bg-white p-2 shadow-2xl sm:mt-10 sm:flex-row sm:items-center sm:rounded-full"
          >
            <div className="flex flex-1 items-center gap-2 px-4">
              <Mail className="h-5 w-5 shrink-0 text-foreground/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল লিখুন"
                className="w-full bg-transparent py-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none sm:text-base"
              />
            </div>

            <button
              type="submit"
              className="group inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 sm:rounded-full sm:text-base"
            >
              সাবস্ক্রাইব করুন
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-5 max-w-md text-xs text-white/60 sm:text-sm">
            আমরা আপনার তথ্য কখনো শেয়ার করব না। যেকোনো সময় আনসাবস্ক্রাইব করতে
            পারবেন।
          </p>
        </div>
      </div>
    </section>
  );
}
