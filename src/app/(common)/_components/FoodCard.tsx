"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface FoodCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  category?: string;
}

export default function FoodCard({
  id,
  name,
  price,
  imageUrl,
  description,
  category,
}: FoodCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({ id, name, price, imageUrl });
    toast.success(`${name} কার্টে যোগ হয়েছে!`);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-[22px] border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10">

      {/* Image section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Category badge */}
        {category && (
          <span className="absolute left-3 top-3 rounded-lg bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
            {category}
          </span>
        )}

        {/* Food name */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="line-clamp-1 text-[15px] font-bold leading-snug text-white drop-shadow-sm">
            {name}
          </h3>
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col p-4 pt-3.5">
        {description && (
          <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        {/* Price + Button */}
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              মূল্য
            </p>
            <p className="text-[22px] font-black leading-none text-primary">
              ৳{price}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground shadow-md shadow-primary/30 transition-all duration-200 hover:brightness-105 hover:shadow-lg hover:shadow-primary/40 active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            যোগ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
