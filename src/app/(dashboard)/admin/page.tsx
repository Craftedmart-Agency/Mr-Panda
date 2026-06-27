"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ShoppingBag,
  UtensilsCrossed,
  FolderTree,
  Tag,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  PackageCheck,
  ChevronRight,
} from "lucide-react";

const quickActions = [
  {
    serial: "০১",
    label: "অর্ডার",
    desc: "সকল অর্ডার দেখুন ও পরিচালনা করুন",
    icon: ShoppingBag,
    href: "/admin/orders",
    cta: "সব দেখুন",
    ctaIcon: ArrowRight,
    accent: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    ring: "border-blue-100 hover:border-blue-300",
    ctaBg: "bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white",
  },
  {
    serial: "০২",
    label: "খাবার",
    desc: "নতুন খাবার যোগ করুন মেনুতে",
    icon: UtensilsCrossed,
    href: "/admin/foods",
    cta: "যোগ করুন",
    ctaIcon: Plus,
    accent: "from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    ring: "border-emerald-100 hover:border-emerald-300",
    ctaBg: "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
  },
  {
    serial: "০৩",
    label: "ক্যাটাগরি",
    desc: "খাবারের ক্যাটাগরি তৈরি করুন",
    icon: FolderTree,
    href: "/admin/categories",
    cta: "যোগ করুন",
    ctaIcon: Plus,
    accent: "from-violet-500 to-violet-600",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    ring: "border-violet-100 hover:border-violet-300",
    ctaBg: "bg-violet-50 text-violet-700 group-hover:bg-violet-600 group-hover:text-white",
  },
  {
    serial: "০৪",
    label: "অফার",
    desc: "স্পেশাল অফার ও ডিল যোগ করুন",
    icon: Tag,
    href: "/admin/offers",
    cta: "যোগ করুন",
    ctaIcon: Plus,
    accent: "from-pink-500 to-rose-500",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    ring: "border-pink-100 hover:border-pink-300",
    ctaBg: "bg-pink-50 text-pink-700 group-hover:bg-pink-600 group-hover:text-white",
  },
];

interface AdminData {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    deliveredOrders: number;
  };
  orderStatus: { name: string; value: number; color: string }[];
  monthlyRevenue: { month: string; revenue: number }[];
  monthlyOrders: { month: string; orders: number }[];
}

export default function AdminOverview() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const CtaIcon = action.ctaIcon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${action.ring}`}
            >
              {/* Gradient top bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${action.accent}`} />

              <div className="flex flex-col gap-3 p-5">
                {/* Icon + serial */}
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.iconBg}`}>
                    <Icon className={`h-5 w-5 ${action.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-slate-200">
                    {action.serial}
                  </span>
                </div>

                {/* Labels */}
                <div>
                  <p className="text-sm font-bold text-slate-800">{action.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{action.desc}</p>
                </div>

                {/* CTA */}
                <div className={`flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${action.ctaBg}`}>
                  <CtaIcon className="h-3 w-3" />
                  {action.cta}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats Row */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">মোট অর্ডার</p>
            <p className="mt-0.5 text-2xl font-bold text-slate-900">
              {loading ? "—" : data?.stats.totalOrders ?? 0}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">পেন্ডিং অর্ডার</p>
            <p className="mt-0.5 text-2xl font-bold text-amber-600">
              {loading ? "—" : data?.stats.pendingOrders ?? 0}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
            <PackageCheck className="h-5 w-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">ডেলিভার্ড</p>
            <p className="mt-0.5 text-2xl font-bold text-green-600">
              {loading ? "—" : data?.stats.deliveredOrders ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Orders section header with link */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-pink-500">
            অ্যানালিটিক্স
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            অর্ডার ও আয়ের বিশ্লেষণ
          </h2>
        </div>
        <Link
          href="/admin/orders"
          className="flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-600 hover:text-white"
        >
          সব অর্ডার দেখুন
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="grid gap-4">
          {/* Summary mini cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">সর্বমোট অর্ডার</p>
                <TrendingUp className="h-4 w-4 text-slate-300" />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {loading ? "—" : data?.monthlyOrders.reduce((s, i) => s + i.orders, 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">সর্বমোট আয়</p>
                <TrendingUp className="h-4 w-4 text-pink-300" />
              </div>
              <p className="mt-2 text-2xl font-bold text-pink-600">
                {loading ? "—" : `৳${data?.monthlyRevenue.reduce((s, i) => s + i.revenue, 0)}`}
              </p>
            </div>
          </div>

          {/* Bar chart */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-slate-900">মাসিক অর্ডার গ্রাফ</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data?.monthlyOrders ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#e2e8f0" />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#e2e8f0" />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    color: "#0f172a",
                  }}
                />
                <Bar dataKey="orders" fill="#ec4899" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          {/* Line chart */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-slate-900">আয় (গত ৬ মাস)</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data?.monthlyRevenue ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#e2e8f0" />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} stroke="#e2e8f0" />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    color: "#0f172a",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  dot={{ fill: "#ec4899", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">অর্ডার স্ট্যাটাস</p>
                <p className="text-xs text-slate-400">বর্তমান বিভাগভিত্তিক</p>
              </div>
              <span className="rounded-full bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-600">
                লাইভ
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data?.orderStatus ?? []}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {(data?.orderStatus ?? []).map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    color: "#0f172a",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {(data?.orderStatus ?? []).map((status) => (
                <div
                  key={status.name}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-xs text-slate-600">{status.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{status.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
