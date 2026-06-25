"use client";

import { useState, memo } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import FoodCard from "../../_components/FoodCard";

const categories = ["সব", "সালাদ", "পিৎজা", "বার্গার", "পাস্তা", "ড্রিংকস"];

interface FilterPanelProps {
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
    activeCategory,
    setActiveCategory,
    searchInput,
    setSearchInput,
    handleSearch,
    handleClear,
    onSelect,
  }: FilterPanelProps) => (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-7">
      {/* Search */}
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

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="mb-6 w-full cursor-pointer rounded-2xl bg-primary py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90"
      >
        সার্চ করুন
      </button>

      {/* Divider */}
      <div className="mb-6 h-px bg-border" />

      {/* Categories */}
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
        ক্যাটাগরি
      </p>
      <div className="flex flex-col gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              onSelect?.();
            }}
            className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <span>{cat}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                activeCategory === cat
                  ? "bg-white/20 text-primary-foreground"
                  : "bg-secondary text-primary"
              }`}
            >
              {countFor(cat)}
            </span>
          </button>
        ))}
      </div>
    </div>
  ),
);

FilterPanel.displayName = "FilterPanel";

const allFoods = [
  {
    id: "salad-001",
    name: "স্পেশাল সালাদ",
    description: "তাজা সবজি আর বিশেষ ড্রেসিং দিয়ে তৈরি স্বাস্থ্যকর সালাদ।",
    price: 250,
    imageUrl: "/hero.png",
    category: "সালাদ",
  },
  {
    id: "salad-002",
    name: "রাশিয়ান সালাদ",
    description: "ক্রিমি টেক্সচার আর মুখরোচক স্বাদের রাশিয়ান সালাদ।",
    price: 300,
    imageUrl: "/hero.png",
    category: "সালাদ",
  },
  {
    id: "burger-001",
    name: "চিজ বার্গার",
    description: "জুসি বিফ প্যাটি, চিজ আর তাজা সবজি দিয়ে তৈরি বার্গার।",
    price: 350,
    imageUrl: "/hero.png",
    category: "বার্গার",
  },
  {
    id: "burger-002",
    name: "চিকেন বার্গার",
    description: "ক্রিস্পি চিকেন ফিলে আর স্পেশাল সস দিয়ে তৈরি বার্গার।",
    price: 320,
    imageUrl: "/hero.png",
    category: "বার্গার",
  },
  {
    id: "pizza-001",
    name: "মার্গারিটা পিৎজা",
    description: "ক্লাসিক টমেটো সস, মোজারেলা চিজ আর তুলসি পাতার পিৎজা।",
    price: 550,
    imageUrl: "/hero.png",
    category: "পিৎজা",
  },
  {
    id: "pizza-002",
    name: "পেপারোনি পিৎজা",
    description: "স্পাইসি পেপারোনি আর এক্সট্রা চিজে ভরা মজাদার পিৎজা।",
    price: 600,
    imageUrl: "/hero.png",
    category: "পিৎজা",
  },
  {
    id: "pasta-001",
    name: "হোয়াইট সস পাস্তা",
    description: "ক্রিমি হোয়াইট সসে রান্না করা মুখরোচক ইতালিয়ান পাস্তা।",
    price: 400,
    imageUrl: "/hero.png",
    category: "পাস্তা",
  },
  {
    id: "drink-001",
    name: "লেমন মিন্ট",
    description: "তাজা লেবু আর পুদিনা পাতার রিফ্রেশিং ঠান্ডা পানীয়।",
    price: 120,
    imageUrl: "/hero.png",
    category: "ড্রিংকস",
  },
];

function countFor(cat: string) {
  if (cat === "সব") return allFoods.length;
  return allFoods.filter((f) => f.category === cat).length;
}

export default function MenuContent() {
  const [activeCategory, setActiveCategory] = useState("সব");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const filteredFoods = allFoods.filter((food) => {
    const matchesCategory =
      activeCategory === "সব" || food.category === activeCategory;
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-12">
      {/* Mobile: filter toggle button */}
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
                <FoodCard key={food.id} {...food} />
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

      {/* Overlay */}
      <div
        onClick={() => setMobileFilterOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileFilterOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Bottom sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-5 pt-3 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <button
          onClick={() => setMobileFilterOpen(false)}
          className="mb-4 flex w-full cursor-pointer justify-center py-2"
          aria-label="বন্ধ করুন"
        >
          <div className="h-1.5 w-12 rounded-full bg-border" />
        </button>

        <FilterPanel
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
          handleClear={handleClear}
          onSelect={() => setMobileFilterOpen(false)}
        />
      </div>
    </div>
  );
}
