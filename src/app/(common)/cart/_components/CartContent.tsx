"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const initialCart: CartItem[] = [
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

export default function CartContent() {
  const [cart, setCart] = useState<CartItem[]>(initialCart);

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + (cart.length > 0 ? DELIVERY_FEE : 0);

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-12 w-12 text-primary" />
        </div>
        <h2 className="mt-8 text-2xl font-bold text-foreground">
          আপনার কার্ট খালি
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          এখনো কোনো খাবার যোগ করা হয়নি। মেনু থেকে পছন্দের খাবার বেছে নিন।
        </p>
        <Link
          href="/menu"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
        >
          মেনু দেখুন
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:gap-5 sm:p-5"
              >
                {/* Image */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-bold text-foreground sm:text-lg">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    ৳{item.price}
                  </p>

                  {/* Quantity controls */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-1 rounded-full border border-border">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                        aria-label="কমান"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                        aria-label="বাড়ান"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price + Remove */}
                <div className="flex flex-col items-end gap-3">
                  <p className="text-base font-bold text-foreground sm:text-lg">
                    ৳{item.price * item.quantity}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="সরান"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">অর্ডার সারাংশ</h2>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">সাবটোটাল</span>
                <span className="font-semibold text-foreground">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                <span className="font-semibold text-foreground">
                  ৳{DELIVERY_FEE}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-foreground">মোট</span>
                  <span className="text-xl font-bold text-primary">৳{total}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
            >
              চেকআউট করুন
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/menu"
              className="mt-3 flex w-full items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              আরও কিছু যোগ করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}