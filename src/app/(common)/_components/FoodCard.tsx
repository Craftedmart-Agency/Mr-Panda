"use client";

import Image from "next/image";
import { ShoppingCart, Leaf, Flame, Heart } from "lucide-react";
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
    <div className="relative w-full max-w-[400px] overflow-hidden rounded-[24px] border border-pink-100 bg-[#FFF5F6] p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Top Banner / Category Section */}
      <div className="relative z-10 flex justify-between items-start">
        {category && (
          <div className="flex items-center gap-1.5 rounded-full bg-black opacity-80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
            <span className="text-[12px]">🍲</span>
            {category}
          </div>
        )}
      </div>

      {/* Main Layout Area */}
      <div className="relative mt-2 grid grid-cols-12 gap-2 min-h-[220px] mb-4">
        {/* Left Side: Content & Pricing */}
        <div className="col-span-6 z-10 flex flex-col justify-end pt-4">
          <div>
            <h3 className="text-[18px] font-extrabold leading-tight text-[#3A231C] font-serif opacity-80">
              {name}
            </h3>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-bold text-[#A3908A] uppercase tracking-wider">
              মূল্য
            </p>
            <p className="text-[32px] font-black leading-none text-[#E64A79] mt-0.5">
              ৳{price}
            </p>
          </div>
        </div>

        {/* Right Side: Image and Add to Cart Button */}
        <div className="col-span-6 flex flex-col justify-between items-end relative">
          {/* FIXED: Added explicit height/width wrapper with absolute container */}
          <div className="absolute -top-6 -right-6">
            <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-full overflow-hidden bg-orange-50 shadow-inner border-[4px] border-white">
              <Image
                src={imageUrl}
                alt={name}
                fill
                sizes="(max-width: 640px) 180px, 200px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Cart Button */}
          <div className="w-full mt-auto z-10 flex justify-end relative top-2 right-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 rounded-xl bg-[#E64A79] px-3 py-2 text-[14px] font-bold text-white shadow-md shadow-pink-200 transition-all duration-200 hover:bg-[#D13D6A] hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              যোগ করুন
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Features/Badges */}
      <div className="mt-4 border-t border-dashed border-pink-200/60 pt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#A3908A]">
        <div className="flex items-center gap-1">
          <Leaf className="w-3.5 h-3.5 text-[#E64A79]" />
          Fresh Ingredients
        </div>
        <div className="h-6 mr-4 w-[2px] bg-pink-200" />
        {description && (
          <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-[#9c5742]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}