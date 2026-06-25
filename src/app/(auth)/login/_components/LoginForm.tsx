"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { loginWithEmail, loginWithGoogle } from "@/lib/firebase/auth";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(form.email, form.password);
      toast.success("সফলভাবে লগইন হয়েছে!");
      router.push("/");
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.message === "USER_BANNED" || err.code === "auth/user-banned") {
        toast.error("You are banned");
      } else if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        toast.error("ইমেইল বা পাসওয়ার্ড ভুল");
      } else {
        toast.error("কিছু একটা সমস্যা হয়েছে");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success("সফলভাবে লগইন হয়েছে!");
      router.push("/");
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.message === "USER_BANNED" || err.code === "auth/user-banned") {
        toast.error("You are banned");
      } else {
        toast.error("Google লগইনে সমস্যা হয়েছে");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left branding */}
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
            সুস্বাদু খাবারের জগতে আবার স্বাগতম! লগইন করে অর্ডার করুন।
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex w-full items-center justify-center bg-background px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-3xl">🐼</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground">লগইন করুন</h1>
          <p className="mt-2 text-base text-muted-foreground">
            আপনার অ্যাকাউন্টে প্রবেশ করুন
          </p>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="mt-8 flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-secondary disabled:opacity-60"
          >
            <GoogleIcon />
            {googleLoading ? "অপেক্ষা করুন..." : "Google দিয়ে চালিয়ে যান"}
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">অথবা</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="আপনার পাসওয়ার্ড"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40 disabled:opacity-60"
            >
              {loading ? "অপেক্ষা করুন..." : "লগইন করুন"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              রেজিস্টার করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
