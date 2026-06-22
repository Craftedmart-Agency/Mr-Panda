"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  User,
  Phone,
  MapPin,
  Wallet,
  Banknote,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const orderItems: OrderItem[] = [
  {
    id: "1",
    name: "স্পেশাল সালাদ",
    price: 250,
    quantity: 2,
    imageUrl: "/hero.png",
  },
  {
    id: "2",
    name: "চিজ বার্গার",
    price: 350,
    quantity: 1,
    imageUrl: "/hero.png",
  },
  {
    id: "3",
    name: "মার্গারিটা পিৎজা",
    price: 550,
    quantity: 1,
    imageUrl: "/hero.png",
  },
];

const DELIVERY_FEE = 60;

export default function CheckoutContent() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [payment, setPayment] = useState<"cod" | "online">("cod");

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal + DELIVERY_FEE;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }
    // TODO: এখানে API কল করে অর্ডার প্লেস করা হবে
    const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000);
    router.push(`/order-success?id=${orderId}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left — Delivery form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Delivery info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">ডেলিভারি তথ্য</h2>

            <div className="mt-5 space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  পুরো নাম
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 transition-colors focus-within:border-primary">
                  <User className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="আপনার নাম লিখুন"
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  ফোন নম্বর
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 transition-colors focus-within:border-primary">
                  <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="০১XXXXXXXXX"
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  ডেলিভারি ঠিকানা
                </label>
                <div className="flex items-start gap-2 rounded-xl border border-border bg-background px-4 py-3 transition-colors focus-within:border-primary">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="বাসা নং, রোড, এলাকা, শহর"
                    className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  অতিরিক্ত নোট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="ডেলিভারি সম্পর্কে কোনো নির্দেশনা"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">
              পেমেন্ট পদ্ধতি
            </h2>

            <div className="mt-5 space-y-3">
              {/* Cash on delivery */}
              <button
                onClick={() => setPayment("cod")}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                  payment === "cod"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    payment === "cod"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-primary"
                  }`}
                >
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    ক্যাশ অন ডেলিভারি
                  </p>
                  <p className="text-xs text-muted-foreground">
                    খাবার হাতে পেয়ে টাকা দিন
                  </p>
                </div>
              </button>

              {/* Online payment */}
              <button
                onClick={() => setPayment("online")}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                  payment === "online"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    payment === "online"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-primary"
                  }`}
                >
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    অনলাইন পেমেন্ট
                  </p>
                  <p className="text-xs text-muted-foreground">
                    বিকাশ, নগদ, কার্ড
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right — Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">আপনার অর্ডার</h2>

            {/* Items */}
            <div className="mt-5 space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ৳{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    ৳{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-5 space-y-3 border-t border-border pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">সাবটোটাল</span>
                <span className="font-semibold text-foreground">
                  ৳{subtotal}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                <span className="font-semibold text-foreground">
                  ৳{DELIVERY_FEE}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="text-base font-bold text-foreground">মোট</span>
                <span className="text-xl font-bold text-primary">৳{total}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
            >
              <ShoppingBag className="h-4 w-4" />
              অর্ডার নিশ্চিত করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
