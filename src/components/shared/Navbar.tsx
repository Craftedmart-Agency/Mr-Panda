"use client";

import { useCartCount } from "../../hooks/userCartCount";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Phone,
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/lib/firebase/AuthProvider";
import { logout } from "@/lib/firebase/auth";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const AdminOrderNotification = dynamic(
  () => import("@/app/(dashboard)/admin/_components/OrderNotification"),
  { ssr: false }
);

const navLinks = [
  { label: "প্রোডাক্ট", href: "/menu" },
  { label: "রেসিপি", href: "/recipe" },
  { label: "আমাদের সম্পর্কে", href: "/about" },
];

export default function Navbar() {
  const { user, loading } = useAuth();
  const cartCount = useCartCount();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [role, setRole] = useState("CUSTOMER");
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);

  // Role fetch (Neon theke)
  useEffect(() => {
    if (user) {
      fetch(`/api/users/me?firebaseUid=${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.role) setRole(data.user.role);
        })
        .catch(() => {});
    }
  }, [user]);

  // Baire click korle profile dropdown bondho (desktop + mobile)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        profileRef.current &&
        !profileRef.current.contains(target) &&
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setProfileOpen(false);
      setMobileOpen(false);
      toast.success("লগআউট হয়েছে");
      router.push("/");
    } catch {
      toast.error("লগআউটে সমস্যা হয়েছে");
    }
  };

  const dashboardHref = role === "ADMIN" ? "/admin" : "/account";
  const dashboardLabel = role === "ADMIN" ? "ড্যাশবোর্ড" : "আমার অ্যাকাউন্ট";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full border-b border-border bg-background">
      <nav className="flex w-full items-center justify-between px-6 py-4 lg:px-12">
        {/* Left — Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <span className="text-xl">🐼</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            MR. PANDA
          </span>
        </Link>

        {/* Center — Nav Links + Phone */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/special-offer"
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            স্পেশাল অফার
          </Link>
          <a
            href="tel:+923351263561"
            className="flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4 text-primary" />
            <span className="hidden xl:inline">+৯২৩৩৫১২৬৩৫৬১</span>
          </a>
        </div>

        {/* Right — Cart or Admin notification + Auth/Profile (desktop) */}
        <div className="hidden items-center gap-4 lg:flex">
          {role === "ADMIN" ? (
            <AdminOrderNotification />
          ) : (
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
              aria-label="কার্ট"
            >
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {loading ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-secondary" />
          ) : user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                aria-label="প্রোফাইল"
              >
                <User className="h-5 w-5" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.displayName || "ইউজার"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href={dashboardHref}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    {dashboardLabel}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    লগআউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
              >
                লগইন
              </Link>
              <Link
                href="/register"
                className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>

        {/* Mobile right icons */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Profile icon — logged in hole (hamburger er baire) */}
          {!loading && user && (
            <div className="relative" ref={mobileProfileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                aria-label="প্রোফাইল"
              >
                <User className="h-5 w-5" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.displayName || "ইউজার"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href={dashboardHref}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    {dashboardLabel}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    লগআউট
                  </button>
                </div>
              )}
            </div>
          )}

          {role === "ADMIN" ? (
            <AdminOrderNotification />
          ) : (
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
              aria-label="কার্ট"
            >
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-label="মেনু খুলুন"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-[80%] max-w-sm bg-background shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <span className="text-lg">🐼</span>
            </div>
            <span className="font-bold text-foreground">MR. PANDA</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
            aria-label="মেনু বন্ধ করুন"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex flex-col gap-1 px-5 py-6">
          <a
            href="tel:+923351263561"
            className="rounded-lg px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary flex items-center gap-2"
          >
            <Phone className="h-4 w-4 text-primary" />
            কল করুন
          </a>
          
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/special-offer"
            onClick={() => setMobileOpen(false)}
            className="mt-2 rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground"
          >
            স্পেশাল অফার
          </Link>
        </div>

        {/* Drawer Footer — Auth */}
        <div className="absolute bottom-0 left-0 w-full border-t border-border px-5 py-6">
          {loading ? null : user ? (
            // Logged in — shudhu logout
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-base font-semibold text-destructive transition-colors hover:bg-destructive/20"
            >
              <LogOut className="h-4 w-4" />
              লগআউট
            </button>
          ) : (
            // Logged out — login/signup
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-border px-4 py-3 text-center text-base font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                লগইন
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
