"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Users,
  Ban,
  CircleCheck,
  Search,
  Shield,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  role: string;
  isBanned: boolean;
  createdAt: string;
  _count: { orders: number };
}

const ROWS_PER_PAGE = 8;

export default function UsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchUsers = () => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBanToggle = async (user: User) => {
    const action = user.isBanned ? "আনব্যান" : "ব্যান";
    if (!confirm(`"${user.name}" কে ${action} করবেন?`)) return;

    setUpdating(user.id);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: !user.isBanned }),
      });
      if (res.ok) {
        toast.success(`${action} করা হয়েছে`);
        fetchUsers();
      } else {
        toast.error("সমস্যা হয়েছে");
      }
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  const activeCount = users.filter((u) => !u.isBanned).length;
  const bannedCount = users.filter((u) => u.isBanned).length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const summaryCards = [
    { label: "মোট ইউজার", value: users.length, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "একটিভ", value: activeCount, icon: UserCheck, color: "text-green-600", bg: "bg-green-100" },
    { label: "ব্যানড", value: bannedCount, icon: UserX, color: "text-red-600", bg: "bg-red-100" },
    { label: "অ্যাডমিন", value: adminCount, icon: Shield, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">ইউজার</h1>
        <p className="mt-1.5 text-base text-muted-foreground">
          সব ইউজার ম্যানেজ করুন
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="mt-4 text-2xl font-bold text-foreground">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm focus-within:border-primary">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="নাম বা ইমেইল দিয়ে খুঁজুন"
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex min-h-75 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-primary" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-left">
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ইউজার</th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ফোন</th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">অর্ডার</th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">রোল</th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">স্ট্যাটাস</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-secondary/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          <div className="absolute inset-0 overflow-hidden rounded-full">
                            {user.image ? (
                              <Image src={user.image} alt={user.name} width={40} height={40} className="h-full w-full object-cover" />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-base">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{user.phone || "—"}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{user._count.orders}টি</td>
                    <td className="px-6 py-4">
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          <Shield className="h-3 w-3" />
                          অ্যাডমিন
                        </span>
                      ) : (
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                          কাস্টমার
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.isBanned ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                          ব্যানড
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                          একটিভ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== "ADMIN" ? (
                        <button
                          onClick={() => handleBanToggle(user)}
                          disabled={updating === user.id}
                          className={`inline-flex min-w-[104px] cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold text-white transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                            user.isBanned
                              ? "bg-green-600 shadow-lg shadow-green-500/25 hover:bg-green-700 hover:-translate-y-[1px]"
                              : "bg-red-600 shadow-lg shadow-red-500/25 hover:bg-red-700 hover:-translate-y-[1px]"
                          }`}
                        >
                          {updating === user.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : user.isBanned ? (
                            <>
                              <CircleCheck className="h-4 w-4" />
                              <span>আনব্যান</span>
                            </>
                          ) : (
                            <>
                              <Ban className="h-4 w-4" />
                              <span>ব্যান</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-border lg:hidden">
            {paginated.map((user) => (
              <div key={user.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                      {user.image ? (
                        <Image src={user.image} alt={user.name} width={44} height={44} className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-base">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {user._count.orders}টি অর্ডার · {user.role === "ADMIN" ? "অ্যাডমিন" : "কাস্টমার"}
                  </span>
                  {user.role !== "ADMIN" ? (
                    <button
                      onClick={() => handleBanToggle(user)}
                      disabled={updating === user.id}
                      className={`inline-flex min-w-[104px] cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold text-white transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                        user.isBanned
                          ? "bg-green-600 shadow-lg shadow-green-500/25 hover:bg-green-700 hover:-translate-y-[1px]"
                          : "bg-red-600 shadow-lg shadow-red-500/25 hover:bg-red-700 hover:-translate-y-[1px]"
                      }`}
                    >
                      {user.isBanned ? (
                        <>
                          <CircleCheck className="h-4 w-4" />
                          <span>আনব্যান</span>
                        </>
                      ) : (
                        <>
                          <Ban className="h-4 w-4" />
                          <span>ব্যান</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      অ্যাডমিন
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-border bg-secondary/20 px-6 py-4 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                {(page - 1) * ROWS_PER_PAGE + 1}–
                {Math.min(page * ROWS_PER_PAGE, filtered.length)} /{" "}
                {filtered.length} জন
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 cursor-pointer rounded-full text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "border border-border bg-card text-foreground hover:border-primary"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">
            {search ? "কোনো ইউজার পাওয়া যায়নি" : "কোনো ইউজার নেই"}
          </p>
        </div>
      )}
    </div>
  );
}