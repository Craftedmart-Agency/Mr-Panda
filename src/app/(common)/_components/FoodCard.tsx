"use client";

import Image from "next/image";
import { ShoppingCart, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";

interface FoodCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function FoodCard({
  name,
  description,
  price,
  imageUrl,
}: FoodCardProps) {
  const handleAddToCart = () => {
    toast.success(`${name} কার্টে যোগ হয়েছে!`);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Add to cart — top right */}
        <button
          onClick={handleAddToCart}
          aria-label="কার্টে যোগ করুন"
          className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-card/95 text-primary shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground active:scale-95"
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-foreground">{name}</h3>
          <span className="whitespace-nowrap text-lg font-bold text-primary">
            ৳{price}
          </span>
        </div>

        {/* Description */}
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Order now button */}
        <button className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-primary/40 active:scale-95">
          অর্ডার করুন
          <UtensilsCrossed className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}