"use client";

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
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-600">
              অর্ডার ড্যাশবোর্ড
            </p>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              অর্ডার স্ট্যাটাস ও অ্যানালিটিক্স
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              মোট অর্ডার, ডেলিভার্ড এবং পেন্ডিং স্ট্যাটাস সরাসরি দেখুন।
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              মোট অর্ডার
            </p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">
              {loading ? "—" : data?.stats.totalOrders ?? 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">পেন্ডিং অর্ডার</p>
          <p className="mt-4 text-3xl font-bold text-amber-600">
            {loading ? "—" : data?.stats.pendingOrders ?? 0}
          </p>
          <p className="mt-2 text-sm text-slate-500">এই মুহূর্তে প্রক্রিয়াধীন</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">ডেলিভার্ড</p>
          <p className="mt-4 text-3xl font-bold text-green-600">
            {loading ? "—" : data?.stats.deliveredOrders ?? 0}
          </p>
          <p className="mt-2 text-sm text-slate-500">সফলভাবে ডেলিভারি হয়েছে</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">স্ট্যাটাস বিভাগ</p>
          <p className="mt-4 text-3xl font-bold text-pink-600">
            {loading ? "—" : data?.orderStatus.length ?? 0}
          </p>
          <p className="mt-2 text-sm text-slate-500">বর্তমান অর্ডার বিভাগসমূহ</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">অ্যানালিটিক্স</h2>
                <p className="mt-2 text-sm text-slate-500">
                  মাসিক অর্ডার ও আয়ের মোট সংখ্যা দেখুন।
                </p>
              </div>
              <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                লাইভ আপডেট
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">মোট মোট অর্ডার</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {loading ? "—" : data?.monthlyOrders.reduce((sum, item) => sum + item.orders, 0)}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">মোট আয়</p>
                <p className="mt-3 text-2xl font-semibold text-pink-600">
                  {loading ? "—" : `৳${data?.monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0)}`}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-sm font-semibold text-slate-900">মাসিক অর্ডার গ্রাফ</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data?.monthlyOrders ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    color: "#0f172a",
                  }}
                />
                <Bar dataKey="orders" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-sm font-semibold text-slate-900">আয় (গত ৬ মাস)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data?.monthlyRevenue ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} stroke="#cbd5e1" />
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
                  strokeWidth={3}
                  dot={{ fill: "#ec4899", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">অর্ডার স্ট্যাটাস</h3>
                <p className="text-xs text-slate-500">বর্তমান বিভাগভিত্তিক স্ট্যাটাস</p>
              </div>
              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
                লাইভ
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data?.orderStatus ?? []}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={4}
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
            <div className="mt-5 grid gap-3">
              {(data?.orderStatus ?? []).map((status) => (
                <div
                  key={status.name}
                  className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm text-slate-600">{status.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{status.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
