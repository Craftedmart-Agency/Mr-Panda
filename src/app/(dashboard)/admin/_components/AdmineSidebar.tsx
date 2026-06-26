"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Tag } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  FolderTree,
  Users,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

const adminLinks = [
  { label: "ওভারভিউ", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "অর্ডার", href: "/admin/orders", icon: ShoppingBag, exact: false },
  {
    label: "নোটিফিকেশন",
    href: "/admin/notification",
    icon: Bell,
    exact: false,
  },
  { label: "খাবার", href: "/admin/foods", icon: UtensilsCrossed, exact: false },
  {
    label: "ক্যাটাগরি",
    href: "/admin/categories",
    icon: FolderTree,
    exact: false,
  },
  { label: "ইউজার", href: "/admin/users", icon: Users, exact: false },

  { label: "অফার", href: "/admin/offers", icon: Tag, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary/10 text-xl">
          🐼
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-bold text-foreground">MR. PANDA</span>
          <span className="mt-1 text-xs text-muted-foreground">
            অ্যাডমিন প্যানেল
          </span>
        </div>
      </div>

      {/* Admin badge */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">
            অ্যাডমিনিস্ট্রেটর অ্যাক্সেস
          </span>
        </div>
      </div>

      {/* Quick action: New Offer (fixed inside sidebar) */}
      <div className="px-4 pt-4">
        <Link
          href="/admin/offers/new"
          className="group mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:brightness-95"
        >
          <Tag className="h-4 w-4" />
          <span>নতুন অফার</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-foreground/60 hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1">{link.label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — back to site */}
      <div className="border-t border-border p-4">
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          সাইটে ফিরুন
        </Link>
      </div>
    </aside>
  );
}