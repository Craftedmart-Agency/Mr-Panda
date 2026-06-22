"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Better Auth register logic
    console.log("Register:", form);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left — Branding (desktop) */}
      <div className="relative hidden w-1/2 overflow-hidden bg-primary lg:block">
        <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
            <span className="text-4xl">🐼</span>
          </div>
          <h2 className="mt-8 text-4xl font-bold text-primary-foreground">
            MR. PANDA
          </h2>
          <p className="mt-4 max-w-md text-lg text-primary-foreground/80">
            আমাদের পরিবারে যোগ দিন! অ্যাকাউন্ট তৈরি করে সুস্বাদু খাবারের জগৎ
            আবিষ্কার করুন।
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex w-full items-center justify-center bg-background px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-3xl">🐼</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground">অ্যাকাউন্ট তৈরি করুন</h1>
          <p className="mt-2 text-base text-muted-foreground">
            শুরু করতে আপনার তথ্য দিন
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                পুরো নাম
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 transition-colors focus-within:border-primary">
                <User className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="আপনার নাম"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                ইমেইল
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 transition-colors focus-within:border-primary">
                <Mail className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="আপনার ইমেইল"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                পাসওয়ার্ড
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 transition-colors focus-within:border-primary">
                <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "লুকান" : "দেখান"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
            >
              রেজিস্টার করুন
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Login link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}