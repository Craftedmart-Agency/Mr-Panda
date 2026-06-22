"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, X, Clock, Flame, Users, Star, ChefHat } from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  cookTime: string;
  difficulty: string;
  servings: number;
  ingredients: number;
  rating: number;
}

const categories = ["সব", "সালাদ", "পিৎজা", "বার্গার", "পাস্তা", "ড্রিংকস"];

const recipes: Recipe[] = [
  {
    id: "1",
    name: "স্পেশাল সালাদ",
    description: "তাজা সবজি আর বিশেষ ড্রেসিং দিয়ে তৈরি স্বাস্থ্যকর সালাদ।",
    imageUrl: "/hero.png",
    category: "সালাদ",
    cookTime: "১৫ মিনিট",
    difficulty: "সহজ",
    servings: 2,
    ingredients: 8,
    rating: 4.8,
  },
  {
    id: "2",
    name: "চিজ বার্গার",
    description: "জুসি বিফ প্যাটি, চিজ আর তাজা সবজি দিয়ে তৈরি মজাদার বার্গার।",
    imageUrl: "/hero.png",
    category: "বার্গার",
    cookTime: "২৫ মিনিট",
    difficulty: "মাঝারি",
    servings: 1,
    ingredients: 12,
    rating: 4.9,
  },
  {
    id: "3",
    name: "মার্গারিটা পিৎজা",
    description: "ক্লাসিক টমেটো সস, মোজারেলা চিজ আর তুলসি পাতার পিৎজা।",
    imageUrl: "/hero.png",
    category: "পিৎজা",
    cookTime: "৪০ মিনিট",
    difficulty: "মাঝারি",
    servings: 4,
    ingredients: 10,
    rating: 4.7,
  },
  {
    id: "4",
    name: "হোয়াইট সস পাস্তা",
    description: "ক্রিমি হোয়াইট সসে রান্না করা মুখরোচক ইতালিয়ান পাস্তা।",
    imageUrl: "/hero.png",
    category: "পাস্তা",
    cookTime: "৩০ মিনিট",
    difficulty: "সহজ",
    servings: 2,
    ingredients: 9,
    rating: 4.6,
  },
  {
    id: "5",
    name: "রাশিয়ান সালাদ",
    description:
      "ক্রিমি টেক্সচার আর মুখরোচক স্বাদের ঐতিহ্যবাহী রাশিয়ান সালাদ।",
    imageUrl: "/hero.png",
    category: "সালাদ",
    cookTime: "২০ মিনিট",
    difficulty: "সহজ",
    servings: 3,
    ingredients: 7,
    rating: 4.5,
  },
  {
    id: "6",
    name: "পেপারোনি পিৎজা",
    description: "স্পাইসি পেপারোনি আর এক্সট্রা চিজে ভরা মজাদার পিৎজা।",
    imageUrl: "/hero.png",
    category: "পিৎজা",
    cookTime: "৪৫ মিনিট",
    difficulty: "কঠিন",
    servings: 4,
    ingredients: 14,
    rating: 4.9,
  },
];

export default function RecipeContent() {
  const [activeCategory, setActiveCategory] = useState("সব");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => setSearchQuery(searchInput.trim());
  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      activeCategory === "সব" || recipe.category === activeCategory;
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-12">
      {/* Search bar */}
      <div className="mx-auto mb-8 max-w-2xl">
        <div className="group relative flex items-center gap-3 rounded-2xl border border-border bg-card p-2 shadow-sm transition-all focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/10">
          {/* Search icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
            <Search className="h-5 w-5" />
          </div>

          {/* Input */}
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="রেসিপি খুঁজুন... যেমন পিৎজা, সালাদ"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-base"
          />

          {/* Clear button */}
          {searchInput && (
            <button
              onClick={handleClear}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="shrink-0 cursor-pointer rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/40"
          >
            সার্চ
          </button>
        </div>

        {/* Popular searches */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">জনপ্রিয়:</span>
          {["পিৎজা", "বার্গার", "সালাদ"].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchInput(tag);
                setSearchQuery(tag);
              }}
              className="cursor-pointer rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "border border-border bg-card text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Category badge */}
                <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                  {recipe.category}
                </span>
                {/* Rating badge */}
                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  {recipe.rating}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground">
                  {recipe.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {recipe.description}
                </p>

                {/* Meta info */}
                <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    {recipe.cookTime}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    {recipe.servings} জন
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-primary" />
                    {recipe.difficulty}
                  </div>
                </div>

                {/* Ingredients + button */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ChefHat className="h-4 w-4 text-primary" />
                    {recipe.ingredients} উপকরণ
                  </span>
                  <button className="cursor-pointer rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                    রেসিপি দেখুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="mb-2 text-4xl">😕</p>
          <p className="text-base text-muted-foreground">
            কোনো রেসিপি পাওয়া যায়নি।{" "}
            <span className="font-medium text-primary">অন্য কিছু খুঁজুন।</span>
          </p>
        </div>
      )}
    </div>
  );
}
