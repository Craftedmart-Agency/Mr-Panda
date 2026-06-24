"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const DELIVERY_FEE = 60;

export default function CartContent() {
  const items = useCartStore((state) => state.items);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalPrice = useCartStore((state) => state.totalPrice);

  const subtotal = totalPrice();
  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingCart className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-foreground">
          আপনার কার্ট খালি
        </h1>
        <p className="mt-2 text-muted-foreground">
          মেনু থেকে আপনার পছন্দের খাবার যোগ করুন
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
        >
          মেনু দেখুন
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        আমার কার্ট
      </h1>
      <p className="mt-1.5 text-muted-foreground">
        {items.length}টি আইটেম আপনার কার্টে
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-foreground">{item.name}</h3>
                    <p className="mt-1 text-sm text-primary">৳{item.price}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="রিমুভ"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center gap-1 rounded-lg border border-border">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-l-lg transition-colors hover:bg-secondary"
                      aria-label="কমান"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-r-lg transition-colors hover:bg-secondary"
                      aria-label="বাড়ান"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <span className="font-bold text-foreground">
                    ৳{item.price * item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">অর্ডার সারসংক্ষেপ</h2>
            <div className="mt-4 space-y-3">
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

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
            >
              চেকআউট করুন
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}