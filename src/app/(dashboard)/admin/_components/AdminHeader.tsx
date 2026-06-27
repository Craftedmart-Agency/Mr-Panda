"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import OrderNotification from "./OrderNotification";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  FolderTree,
  Users,
  ShieldCheck,
  Bell,
  Tag,
} from "lucide-react";
import { useAuth } from "@/lib/firebase/AuthProvider";
import { logout } from "@/lib/firebase/auth";
import { toast } from "sonner";

const adminLinks = [
  { label: "ওভারভিউ", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "অর্ডার", href: "/admin/orders", icon: ShoppingBag, exact: false },
  { label: "নোটিফিকেশন", href: "/admin/notification", icon: Bell, exact: false },
  { label: "খাবার", href: "/admin/foods", icon: UtensilsCrossed, exact: false },
  { label: "ক্যাটাগরি", href: "/admin/categories", icon: FolderTree, exact: false },
  { label: "ইউজার", href: "/admin/users", icon: Users, exact: false },
  { label: "অফার", href: "/admin/offers", icon: Tag, exact: false },
];

export default function AdminHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("লগআউট হয়েছে");
      router.push("/");
    } catch {
      toast.error("লগআউটে সমস্যা হয়েছে");
    }
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
        {/* Left — mobile menu + panel label */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-1.5 text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
            aria-label="মেনু"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground sm:text-sm">
              অ্যাডমিন প্যানেল
            </span>
          </div>
        </div>

        {/* Right — back to site + user */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification bell */}
          <OrderNotification />

          <Link
            href="/"
            className="flex h-9 items-center gap-2 rounded-xl px-3 text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden text-xs sm:inline">সাইটে ফিরুন</span>
          </Link>

          {/* User dropdown */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-1.5 transition-colors hover:bg-secondary"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {user.displayName?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-medium leading-none text-foreground">
                    {user.displayName?.split(" ")[0] || "অ্যাডমিন"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">ADMIN</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-xl">
                  <div className="mb-1 rounded-xl bg-primary/5 px-3 py-2.5">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.displayName || "অ্যাডমিন"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                    ড্যাশবোর্ড
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    লগআউট
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 top-0 w-72 max-w-[85vw] overflow-y-auto border-r border-border bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-border px-5">
              <Image src="/logo.svg" alt="MR. PANDA" width={36} height={36} className="rounded-xl" />
              <span className="font-bold text-foreground">MR. PANDA</span>
            </div>

            {/* Badge */}
            <div className="px-4 pt-4">
              <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">
                  অ্যাডমিনিস্ট্রেটর অ্যাক্সেস
                </span>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1 p-4">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href, link.exact);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/60 hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}