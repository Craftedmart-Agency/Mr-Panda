"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, FileText, CreditCard, Wallet } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/lib/firebase/AuthProvider";
import { toast } from "sonner";

const DELIVERY_FEE = 60;

export default function CheckoutContent() {
  const router = useRouter();
  const { user } = useAuth();
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    payment: "cod",
  });

  // Profile theke auto-fill (phone, address)
  useEffect(() => {
    if (user) {
      fetch(`/api/users/profile?firebaseUid=${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setForm((prev) => ({
              ...prev,
              name: data.user.name || "",
              phone: data.user.phone || "",
              address: data.user.address || "",
            }));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const subtotal = totalPrice();
  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("অর্ডার করতে লগইন করুন");
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("আপনার কার্ট খালি");
      return;
    }

    if (!form.name || !form.phone || !form.address) {
      toast.error("নাম, ফোন ও ঠিকানা দিন");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user.uid,
          items,
          totalAmount: total,
          deliveryAddress: form.address,
          phoneNumber: form.phone,
        }),
      });

      const data = await res.json();

      if (res.ok && data.order) {
        clearCart();
        toast.success("অর্ডার সফল হয়েছে!");
        router.push(`/order-success?id=${data.order.id}`);
      } else {
        toast.error(data.error || "অর্ডার করতে সমস্যা হয়েছে");
      }
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  // Cart khali hole
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">আপনার কার্ট খালি</h1>
        <p className="mt-2 text-muted-foreground">
          চেকআউট করতে কার্টে খাবার যোগ করুন
        </p>
        <button
          onClick={() => router.push("/menu")}
          className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          মেনু দেখুন
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">চেকআউট</h1>
      <p className="mt-1.5 text-muted-foreground">অর্ডার সম্পন্ন করতে তথ্য দিন</p>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Delivery form */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-foreground">ডেলিভারি তথ্য</h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">নাম</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 focus-within:border-primary">
                  <User className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="আপনার নাম"
                    className="w-full bg-transparent text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">ফোন</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 focus-within:border-primary">
                  <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="০১XXXXXXXXX"
                    className="w-full bg-transparent text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">ঠিকানা</label>
                <div className="flex items-start gap-2 rounded-xl border border-border bg-background px-4 py-3 focus-within:border-primary">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={2}
                    placeholder="বাসা, রোড, এলাকা"
                    className="w-full resize-none bg-transparent text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  নোট (ঐচ্ছিক)
                </label>
                <div className="flex items-start gap-2 rounded-xl border border-border bg-background px-4 py-3 focus-within:border-primary">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    rows={2}
                    placeholder="বিশেষ কোনো নির্দেশনা"
                    className="w-full resize-none bg-transparent text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-foreground">পেমেন্ট পদ্ধতি</h2>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={form.payment === "cod"}
                  onChange={(e) => setForm({ ...form, payment: e.target.value })}
                  className="accent-primary"
                />
                <Wallet className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  ক্যাশ অন ডেলিভারি
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={form.payment === "online"}
                  onChange={(e) => setForm({ ...form, payment: e.target.value })}
                  className="accent-primary"
                />
                <CreditCard className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  অনলাইন পেমেন্ট
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">অর্ডার সারসংক্ষেপ</h2>

            {/* Items */}
            <div className="mt-4 max-h-60 space-y-3 overflow-y-auto">
              {items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center justify-between gap-2">
                  <span className="flex-1 text-sm text-foreground">
                    {item.name}{" "}
                    <span className="text-muted-foreground">x{item.quantity}</span>
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    ৳{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">সাবটোটাল</span>
                <span className="font-medium text-foreground">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ডেলিভারি ফি</span>
                <span className="font-medium text-foreground">৳{DELIVERY_FEE}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="font-bold text-foreground">সর্বমোট</span>
                <span className="text-lg font-bold text-primary">৳{total}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl disabled:opacity-60"
            >
              {loading ? "অর্ডার হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}