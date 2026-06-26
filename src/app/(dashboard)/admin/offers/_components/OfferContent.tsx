"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Tag, X, Power } from "lucide-react";
import { uploadImage } from "@/lib/cloudinary/upload";
import { toast } from "sonner";

interface Offer {
  id: string;
  type: "DEAL" | "COMBO";
  title: string;
  description: string | null;
  imageUrl: string;
  originalPrice: number;
  offerPrice: number;
  isActive: boolean;
}

export default function OffersContent() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: "DEAL" as "DEAL" | "COMBO",
    title: "",
    description: "",
    imageUrl: "",
    originalPrice: "",
    offerPrice: "",
  });

  const fetchOffers = () => {
    fetch("/api/offers")
      .then((res) => res.json())
      .then((data) => {
        if (data.offers) setOffers(data.offers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      type: "DEAL",
      title: "",
      description: "",
      imageUrl: "",
      originalPrice: "",
      offerPrice: "",
    });
    setModalOpen(true);
  };

  const openEdit = (offer: Offer) => {
    setEditing(offer);
    setForm({
      type: offer.type,
      title: offer.title,
      description: offer.description || "",
      imageUrl: offer.imageUrl,
      originalPrice: String(offer.originalPrice),
      offerPrice: String(offer.offerPrice),
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
    if (!form.title || !form.originalPrice || !form.offerPrice) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }
    if (!form.imageUrl) {
      toast.error("ছবি আপলোড করুন");
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/offers/${editing.id}` : "/api/offers";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editing ? "অফার আপডেট হয়েছে!" : "অফার যোগ হয়েছে!");
        setModalOpen(false);
        fetchOffers();
      } else {
        toast.error(data.error || "সমস্যা হয়েছে");
      }
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (offer: Offer) => {
    if (!confirm(`"${offer.title}" ডিলিট করবেন?`)) return;
    try {
      const res = await fetch(`/api/offers/${offer.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("অফার ডিলিট হয়েছে!");
        fetchOffers();
      } else {
        toast.error("ডিলিট করতে সমস্যা");
      }
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    }
  };

  const toggleActive = async (offer: Offer) => {
    try {
      const res = await fetch(`/api/offers/${offer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !offer.isActive }),
      });
      if (res.ok) {
        toast.success(offer.isActive ? "অফার বন্ধ হয়েছে" : "অফার চালু হয়েছে");
        fetchOffers();
      }
    } catch {
      toast.error("সমস্যা হয়েছে");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            স্পেশাল অফার
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">
            ডিল ও কম্বো অফার ম্যানেজ করুন
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          নতুন অফার
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-primary" />
        </div>
      ) : offers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => {
            const discount = Math.round(
              ((offer.originalPrice - offer.offerPrice) / offer.originalPrice) * 100
            );
            return (
              <div
                key={offer.id}
                className={`overflow-hidden rounded-2xl border bg-card shadow-sm ${
                  offer.isActive ? "border-border" : "border-border opacity-60"
                }`}
              >
                <div className="relative h-40">
                  <Image src={offer.imageUrl} alt={offer.title} fill className="object-cover" />
                  <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                    {offer.type === "DEAL" ? "ডিল" : "কম্বো"}
                  </span>
                  {discount > 0 && (
                    <span className="absolute right-2 top-2 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                      {discount}% ছাড়
                    </span>
                  )}
                  {!offer.isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-foreground">
                        বন্ধ
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground">{offer.title}</h3>
                  {offer.description && (
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {offer.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">৳{offer.offerPrice}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      ৳{offer.originalPrice}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-1 border-t border-border pt-3">
                    <button
                      onClick={() => toggleActive(offer)}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium transition-colors ${
                        offer.isActive
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      <Power className="h-3.5 w-3.5" />
                      {offer.isActive ? "চালু" : "বন্ধ"}
                    </button>
                    <button
                      onClick={() => openEdit(offer)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Tag className="h-8 w-8 text-primary" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">কোনো অফার নেই</p>
          <p className="mt-1 text-sm text-muted-foreground">প্রথম অফার যোগ করুন</p>
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
                {editing ? "অফার এডিট" : "নতুন অফার"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">ধরন</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["DEAL", "COMBO"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, type: t })}
                      className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                        form.type === t
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      {t === "DEAL" ? "ডিল (একক)" : "কম্বো প্যাকেজ"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">ছবি</label>
                <div className="relative h-40 overflow-hidden rounded-xl border border-dashed border-border bg-secondary/30">
                  {form.imageUrl ? (
                    <Image src={form.imageUrl} alt="preview" fill className="object-cover" />
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

              {/* Title */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">টাইটেল</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="অফারের নাম"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  বিবরণ (ঐচ্ছিক)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="অফারের বিবরণ"
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    আসল দাম (৳)
                  </label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    placeholder="০"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    অফার দাম (৳)
                  </label>
                  <input
                    type="number"
                    value={form.offerPrice}
                    onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
                    placeholder="০"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
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