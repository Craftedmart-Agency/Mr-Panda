"use client";

import { useEffect, useState, memo } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
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

interface CategoryWithCount extends Category {
  count: number;
}

interface FilterPanelProps {
  categories: CategoryWithCount[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchInput: string;
  setSearchInput: (input: string) => void;
  handleSearch: () => void;
  handleClear: () => void;
  onSelect?: () => void;
}

const FilterPanel = memo(
  ({
    categories,
    activeCategory,
    setActiveCategory,
    searchInput,
    setSearchInput,
    handleSearch,
    handleClear,
    onSelect,
  }: FilterPanelProps) => (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-7">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
        খুঁজুন
      </p>
      <div className="mb-3 flex items-center gap-2 rounded-2xl border-2 border-border bg-background px-4 py-3 transition-colors focus-within:border-primary">
        <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="খাবার খুঁজুন..."
          className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        {searchInput && (
          <button
            onClick={handleClear}
            className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            aria-label="clear"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <button
        onClick={handleSearch}
        className="mb-6 w-full cursor-pointer rounded-2xl bg-primary py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90"
      >
        সার্চ করুন
      </button>

      <div className="mb-6 h-px bg-border" />

      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
        ক্যাটাগরি
      </p>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            setActiveCategory("ALL");
            onSelect?.();
          }}
          className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-all ${
            activeCategory === "ALL"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "text-foreground hover:bg-secondary"
          }`}
        >
          <span>সব</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              activeCategory === "ALL"
                ? "bg-white/20 text-primary-foreground"
                : "bg-secondary text-primary"
            }`}
          >
            {categories.reduce((count, cat) => count + cat.count, 0)}
          </span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              onSelect?.();
            }}
            className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-all ${
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <span>{cat.name}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                activeCategory === cat.id
                  ? "bg-white/20 text-primary-foreground"
                  : "bg-secondary text-primary"
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  ),
);

FilterPanel.displayName = "FilterPanel";

export default function MenuContent() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const categoriesWithCount: CategoryWithCount[] = categories.map((cat) => ({
    ...cat,
    count: foods.filter((food) => food.category.id === cat.id).length,
  }));

  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      activeCategory === "ALL" || food.category.id === activeCategory;
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm) ||
      food.description.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-12">
      <div className="mb-5 flex items-center justify-between lg:hidden">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">
            {filteredFoods.length}
          </span>{" "}
          টি আইটেম
        </p>
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25"
        >
          <SlidersHorizontal className="h-4 w-4" />
          ফিল্টার
        </button>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-24">
            <FilterPanel
              categories={categoriesWithCount}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              handleSearch={handleSearch}
              handleClear={handleClear}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <p className="mb-6 hidden text-base text-muted-foreground lg:block">
            <span className="font-bold text-foreground">
              {filteredFoods.length}
            </span>{" "}
            টি আইটেম পাওয়া গেছে
          </p>

          {filteredFoods.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
            <div className="py-24 text-center">
              <p className="mb-2 text-4xl">😕</p>
              <p className="text-base text-muted-foreground">
                কোনো খাবার পাওয়া যায়নি।{" "}
                <span className="font-medium text-primary">
                  অন্য কিছু খুঁজুন।
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
