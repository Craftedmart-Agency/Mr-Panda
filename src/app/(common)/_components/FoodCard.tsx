"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface FoodCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export default function FoodCard({
  id,
  name,
  price,
  imageUrl,
  description,
}: FoodCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({ id, name, price, imageUrl });
    toast.success(`${name} কার্টে যোগ হয়েছে!`);
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-foreground">{name}</h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">৳{price}</span>
          <button
            onClick={handleAddToCart}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            যোগ করুন
          </button>
        </div>
      </div>
    </div>
  );
}