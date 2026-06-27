"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import FoodCard from "./FoodCard";

interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: { id: string; name: string };
}

export default function SpecialFood() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        const list: Food[] = Array.isArray(data.foods) ? data.foods : [];
        setFoods(list.slice(0, 6));
      })
      .catch(() => setFoods([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#fce7f3] via-[#fbd5e8] to-[#f9c5dd] py-20 lg:py-28">
      {/* Blob decorations */}
      <svg
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 text-primary/20"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.2,88.5,-0.9C87,14.5,81.4,29,73.1,42.2C64.8,55.4,53.8,67.3,40.3,74.8C26.8,82.3,10.7,85.4,-4.8,83.6C-20.3,81.8,-35.2,75.1,-48.6,66C-62,56.9,-73.9,45.4,-79.9,31.4C-85.9,17.4,-86,0.9,-82.4,-14.4C-78.8,-29.7,-71.5,-43.8,-60.5,-51.8C-49.5,-59.8,-34.8,-61.7,-21.3,-69.5C-7.8,-77.3,4.5,-91,18.1,-91.4C31.7,-91.8,46.6,-78.9,44.7,-76.4Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 text-accent/40"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M39.5,-65.3C52.3,-58.3,64.5,-49.6,72.6,-37.6C80.7,-25.6,84.7,-10.3,83.1,4.3C81.5,18.9,74.3,32.8,64.8,44.9C55.3,57,43.5,67.3,29.7,73.5C15.9,79.7,0.1,81.8,-15.8,79.4C-31.7,77,-47.7,70.1,-59.4,58.6C-71.1,47.1,-78.5,31,-81.3,14.1C-84.1,-2.8,-82.3,-20.5,-75.1,-35.3C-67.9,-50.1,-55.3,-62,-41.1,-68.5C-26.9,-75,-13.5,-76.1,0.2,-76.4C13.8,-76.7,27.7,-76.2,39.5,-65.3Z"
          transform="translate(100 100)"
        />
      </svg>
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur-sm">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            আমাদের মেনু
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            আমাদের সুস্বাদু এবং স্পেশাল
            <br />
            <span className="text-primary">খাবার</span>
          </h2>
          <p className="mt-5 text-base text-foreground/70">
            যত্ন করে বাছাই করা উপকরণে তৈরি আমাদের প্রতিটি পদ, পুষ্টি আর স্বাদের
            নিখুঁত মিশ্রণ।
          </p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/40 border-t-primary" />
          </div>
        ) : foods.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {foods.map((food) => (
              <FoodCard
                key={food.id}
                id={food.id}
                name={food.name}
                price={food.price}
                imageUrl={food.imageUrl}
                description={food.description}
                category={food.category?.name}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-base text-foreground/60">এখনো কোনো খাবার যোগ করা হয়নি।</p>
          </div>
        )}

        {/* View all button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/recipe"
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:brightness-105 hover:shadow-2xl hover:shadow-primary/40 sm:text-base"
          >
            সব খাবার দেখুন
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
