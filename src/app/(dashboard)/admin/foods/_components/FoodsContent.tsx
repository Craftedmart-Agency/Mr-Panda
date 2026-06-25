"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, UtensilsCrossed, X, ChevronDown } from "lucide-react";
import { uploadImage } from "@/lib/cloudinary/upload";
import { toast } from "sonner";

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
  isAvailable: boolean;
  category: { id: string; name: string };
}

export default function FoodsContent() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Food | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    isAvailable: true,
  });

  const fetchData = () => {
    Promise.all([
      fetch("/api/foods").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([foodData, catData]) => {
        if (foodData.foods) setFoods(foodData.foods);
        if (catData.categories) setCategories(catData.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      categoryId: categories[0]?.id || "",
      isAvailable: true,
    });
    setModalOpen(true);
  };

  const openEdit = (food: Food) => {
    setEditing(food);
    setForm({
      name: food.name,
      description: food.description,
      price: String(food.price),
      imageUrl: food.imageUrl,
      categoryId: food.category.id,
      isAvailable: food.isAvailable,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("শুধু ছবি আপলোড করুন");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
      toast.success("ছবি আপলোড হয়েছে!");
    } catch {
      toast.error("ছবি আপলোডে সমস্যা");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.price || !form.categoryId) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }
    if (!form.imageUrl) {
      toast.error("ছবি আপলোড করুন");
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/foods/${editing.id}` : "/api/foods";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editing ? "খাবার আপডেট হয়েছে!" : "খাবার যোগ হয়েছে!");
        setModalOpen(false);
        fetchData();
      } else {
        toast.error(data.error || "সমস্যা হয়েছে");
      }
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (food: Food) => {
    if (!confirm(`"${food.name}" ডিলিট করবেন?`)) return;
    try {
      const res = await fetch(`/api/foods/${food.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("খাবার ডিলিট হয়েছে!");
        fetchData();
      } else {
        toast.error(data.error || "ডিলিট করতে সমস্যা");
      }
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">খাবার</h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            খাবার ম্যানেজ করুন
          </p>
        </div>
        <button
          onClick={openAdd}
          disabled={categories.length === 0}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          নতুন খাবার
        </button>
      </div>

      {/* Category warning */}
      {!loading && categories.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          আগে ক্যাটাগরি যোগ করুন, তারপর খাবার যোগ করতে পারবেন।
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-primary" />
        </div>
      ) : foods.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <div
              key={food.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative h-40 sm:h-48 md:h-52 bg-slate-50">
                <Image src={food.imageUrl} alt={food.name} fill className="object-contain" />
                {!food.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                      স্টক নেই
                    </span>
                  </div>
                )}
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                  {food.category.name}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-foreground">{food.name}</h3>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {food.description}
                    </p>
                    <p className="mt-1 text-base font-bold text-primary">৳{food.price}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => openEdit(food)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(food)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">কোনো খাবার নেই</p>
          <p className="mt-1 text-sm text-muted-foreground">প্রথম খাবার যোগ করুন</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {editing ? "খাবার এডিট" : "নতুন খাবার"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">ছবি</label>
                <div className="relative h-40 overflow-hidden rounded-xl border border-dashed border-border bg-secondary/30">
                  {form.imageUrl ? (
                    <Image src={form.imageUrl} alt="preview" fill className="object-contain" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      {uploading ? "আপলোড হচ্ছে..." : "ছবি নির্বাচন করুন"}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">নাম</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="খাবারের নাম"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">বিবরণ</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="খাবারের বিবরণ"
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">দাম (৳)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="০"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">ক্যাটাগরি</label>
                <div className="relative">
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm focus:border-primary focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                </div>
              </div>

              {/* Available toggle */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                <span className="text-sm font-medium text-foreground">স্টকে আছে</span>
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                  className="h-5 w-5 accent-primary"
                />
              </label>

              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl disabled:opacity-60"
              >
                {saving ? "সেভ হচ্ছে..." : editing ? "আপডেট করুন" : "যোগ করুন"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}