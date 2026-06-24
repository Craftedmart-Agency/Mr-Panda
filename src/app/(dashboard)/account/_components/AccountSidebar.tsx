"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/firebase/AuthProvider";
import { useProfile } from "@/lib/ProfileContext";
import { logout } from "@/lib/firebase/auth";
import { toast } from "sonner";

const menuItems = [
  { label: "ওভারভিউ", href: "/account", icon: LayoutDashboard },
  { label: "আমার অর্ডার", href: "/account/orders", icon: ShoppingBag },
  { label: "আমার কার্ট", href: "/cart", icon: ShoppingCart },
  { label: "প্রোফাইল", href: "/account/profile", icon: User },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { profileImage } = useProfile();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("লগআউট হয়েছে");
      router.push("/");
    } catch {
      toast.error("লগআউটে সমস্যা হয়েছে");
    }
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-20 hidden h-[calc(100vh-96px)] w-72 shrink-0 lg:block">
        <div className="flex h-full flex-col rounded-3xl border border-border bg-card shadow-sm">
          {/* Header — user image + name */}
          <div className="flex flex-col items-center border-b border-border px-6 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-lg shadow-primary/25">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={user?.displayName || "User"}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.displayName?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <p className="mt-3 text-sm font-bold text-foreground">
              {user?.displayName || "ইউজার"}
            </p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {user?.email}
            </p>
          </div>

          {/* Menu */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              মেনু
            </p>
            <nav className="flex flex-col gap-3">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout button — at bottom */}
          <div className="border-t border-border px-4 py-5">
            <button
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-[18px] w-[18px]" />
              লগআউট
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-2 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                    isActive ? "bg-primary/10" : ""
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Logout tab */}
          <button
            onClick={handleLogout}
            className="flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-lg py-2 text-destructive"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl">
              <LogOut className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium">লগআউট</span>
          </button>
        </div>
      </nav>
    </>
  );
}
