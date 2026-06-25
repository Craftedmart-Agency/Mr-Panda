"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, FolderTree, X } from "lucide-react";
import { uploadImage } from "@/lib/cloudinary/upload";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  imageUrl: string | null;
  _count: { foods: number };
}

export default function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", imageUrl: "" });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", imageUrl: "" });
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, imageUrl: cat.imageUrl || "" });
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
    if (!form.name.trim()) {
      toast.error("ক্যাটাগরির নাম দিন");
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(editing ? "ক্যাটাগরি আপডেট হয়েছে!" : "ক্যাটাগরি যোগ হয়েছে!");
        setModalOpen(false);
        fetchCategories();
      } else {
        toast.error(data.error || "সমস্যা হয়েছে");
      }
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`"${cat.name}" ডিলিট করবেন?`)) return;
    try {
      const res = await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("ক্যাটাগরি ডিলিট হয়েছে!");
        fetchCategories();
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
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">ক্যাটাগরি</h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            খাবারের ক্যাটাগরি ম্যানেজ করুন
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          নতুন ক্যাটাগরি
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-primary" />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="transform-gpu transition-transform hover:scale-[1.02] hover:shadow-lg overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative h-48 sm:h-56 md:h-64 bg-secondary/50 overflow-hidden">
                {cat.imageUrl ? (
                  <>
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground">
                      {cat._count.foods} টি
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <FolderTree className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {cat._count.foods}টি খাবার
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(cat)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
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
            <FolderTree className="h-8 w-8 text-primary" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">কোনো ক্যাটাগরি নেই</p>
          <p className="mt-1 text-sm text-muted-foreground">প্রথম ক্যাটাগরি যোগ করুন</p>
          <button
            onClick={openAdd}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            ক্যাটাগরি যোগ করুন
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {editing ? "ক্যাটাগরি এডিট" : "নতুন ক্যাটাগরি"}
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
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  ছবি (ঐচ্ছিক)
                </label>
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
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  ক্যাটাগরির নাম
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="যেমন: বার্গার, পিৎজা"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>

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