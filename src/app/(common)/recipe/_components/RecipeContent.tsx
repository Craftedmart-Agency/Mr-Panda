"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, UtensilsCrossed } from "lucide-react";
import FoodCard from "../../_components/FoodCard";

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

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-secondary" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-secondary" />
        <div className="h-3 w-full animate-pulse rounded-full bg-secondary" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-secondary" />
        <div className="mt-4 h-10 w-full animate-pulse rounded-2xl bg-secondary" />
      </div>
    </div>
  );
}

export default function RecipeContent() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [isFixed, setIsFixed] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(80);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setFoods(Array.isArray(data.foods) ? data.foods : []);
        setCategories(Array.isArray(data.categories) ? data.categories : []);
      })
      .catch(() => {
        setFoods([]);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Measure actual navbar height
  useEffect(() => {
    const navbar = document.querySelector("header");
    if (navbar) setNavbarHeight(navbar.getBoundingClientRect().height);
  }, []);

  // Measure filter bar height
  useEffect(() => {
    if (barRef.current) setBarHeight(barRef.current.offsetHeight);
  }, [categories]);

  // Fixed on scroll — use scroll listener with measured navbar height
  useEffect(() => {
    const handleScroll = () => {
      if (!sentinelRef.current) return;
      const top = sentinelRef.current.getBoundingClientRect().top;
      setIsFixed(top <= navbarHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navbarHeight]);

  // Check if category chips can scroll right
  useEffect(() => {
    const el = chipsRef.current;
    if (!el) return;
    const check = () => setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 4);
    check();
    el.addEventListener("scroll", check);
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [categories]);

  const handleSearch = () => setSearchQuery(searchInput.trim());
  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      activeCategory === "ALL" || food.category.id === activeCategory;
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm) ||
      food.description.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const FilterBar = (
    <div className={isFixed ? "mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12" : ""}>
      {/* Search */}
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-sm transition-all focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="পছন্দের খাবার খুঁজুন..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {searchInput && (
            <button
              onClick={handleClear}
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="মুছুন"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="shrink-0 cursor-pointer rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:shadow-primary/30 active:scale-95"
          >
            খুঁজুন
          </button>
        </div>
      </div>

      {/* Category chips — horizontal scroll with fade indicator */}
      <div className="relative mt-3">
        <div
          ref={chipsRef}
          className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
        >
          <button
            onClick={() => setActiveCategory("ALL")}
            className={`shrink-0 cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              activeCategory === "ALL"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                : "border border-border bg-card text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            সব খাবার
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "border border-border bg-card text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Right fade — shows when more chips are hidden */}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent" />
        )}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-12 pt-6 sm:px-6 lg:px-12">
      {/* Sentinel — scroll position reference */}
      <div ref={sentinelRef} className="h-0" />

      {/* Filter bar */}
      <div
        ref={barRef}
        className={`z-20 border-b border-border bg-background ${
          isFixed
            ? "fixed left-0 right-0 pb-3 pt-3 shadow-md"
            : "pb-5 pt-0"
        }`}
        style={isFixed ? { top: navbarHeight } : undefined}
      >
        {FilterBar}
      </div>

      {/* Spacer */}
      {isFixed && <div style={{ height: barHeight }} />}

      {/* Count */}
      {!loading && (
        <div className="mb-5 mt-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{filteredFoods.length}</span> টি খাবার পাওয়া গেছে
          </span>
          {searchQuery && (
            <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
              &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFoods.map((food) => (
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
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <UtensilsCrossed className="h-9 w-9 text-muted-foreground" />
          </div>
          <p className="mt-5 text-lg font-semibold text-foreground">
            কোনো খাবার পাওয়া যায়নি
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            অন্য কিছু দিয়ে সার্চ করুন অথবা{" "}
            <button
              onClick={handleClear}
              className="cursor-pointer font-medium text-primary hover:underline"
            >
              সব দেখুন
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
