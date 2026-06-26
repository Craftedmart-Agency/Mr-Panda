"use client";

import { useEffect, useState } from "react";
import { Search, UtensilsCrossed, SlidersHorizontal, X } from "lucide-react";
import FoodCard from "../../../../(common)/_components/FoodCard";

interface Category {
  id: string;
  name: string;
}

interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: { id: string; name: string };
}

export default function MenuContent() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        if (data.foods) setFoods(data.foods);
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filter
  const filteredFoods = foods.filter((food) => {
    const matchCategory =
      activeCategory === "ALL" || food.category.id === activeCategory;
    const matchSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleSearch = () => setSearchQuery(searchInput);

  // Category wise count
  const getCount = (catId: string) =>
    catId === "ALL"
      ? foods.length
      : foods.filter((f) => f.category.id === catId).length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          আমাদের <span className="text-primary">মেনু</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          আপনার পছন্দের সুস্বাদু খাবার বেছে নিন
        </p>
      </div>

      {/* Search */}
      <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-sm focus-within:border-primary">
        <div className="flex flex-1 items-center gap-2 pl-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="খাবার খুঁজুন..."
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
        <button
          onClick={handleSearch}
          className="cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          খুঁজুন
        </button>
      </div>

      {/* Category pills */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveCategory("ALL")}
          className={`cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            activeCategory === "ALL"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-foreground hover:bg-secondary"
          }`}
        >
          সব ({getCount("ALL")})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-secondary"
            }`}
          >
            {cat.name} ({getCount(cat.id)})
          </button>
        ))}
      </div>

      {/* Food grid */}
      {filteredFoods.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              id={food.id}
              name={food.name}
              price={food.price}
              imageUrl={food.imageUrl}
              description={food.description}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <UtensilsCrossed className="h-10 w-10 text-primary" />
          </div>
          <p className="mt-4 text-lg font-medium text-foreground">
            কোনো খাবার পাওয়া যায়নি
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {foods.length === 0
              ? "শীঘ্রই নতুন খাবার যোগ করা হবে"
              : "অন্য কিছু খুঁজে দেখুন"}
          </p>
        </div>
      )}
    </div>
  );
}