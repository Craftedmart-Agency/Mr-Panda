"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { User, Mail, Phone, MapPin, Save, Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/firebase/AuthProvider";
import { useProfile } from "@/lib/ProfileContext";
import { uploadImage } from "@/lib/cloudinary/upload";
import { toast } from "sonner";

interface Profile {
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
}

export default function ProfileContent() {
  const { user } = useAuth();
  const { setProfileImage } = useProfile();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetch(`/api/users/profile?firebaseUid=${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setForm({
              name: data.user.name || "",
              email: data.user.email || "",
              phone: data.user.phone || "",
              address: data.user.address || "",
              image: data.user.image || "",
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("image/")) {
      toast.error("শুধু ছবি আপলোড করুন");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ছবি ৫MB এর কম হতে হবে");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: url }));
      setProfileImage(url); // Update context for sidebar

      // Sathe sathe database e save (image)
      await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseUid: user?.uid, image: url }),
      });

      toast.success("ছবি আপলোড হয়েছে!");
    } catch {
      toast.error("ছবি আপলোড করতে সমস্যা হয়েছে");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user.uid,
          name: form.name,
          phone: form.phone,
          address: form.address,
        }),
      });

      if (res.ok) {
        toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
      } else {
        toast.error("আপডেট করতে সমস্যা হয়েছে");
      }
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">প্রোফাইল</h1>
        <p className="mt-1.5 text-base text-muted-foreground">
          আপনার তথ্য আপডেট করুন। এই তথ্য অর্ডারের সময় স্বয়ংক্রিয়ভাবে যুক্ত হবে।
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {/* Avatar with upload */}
        <div className="mb-8 flex items-center gap-5 border-b border-border pb-6">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-primary text-3xl font-bold text-primary-foreground shadow-lg shadow-primary/25">
              {form.image ? (
                <Image
                  src={form.image}
                  alt={form.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                form.name.charAt(0).toUpperCase() || "U"
              )}
            </div>

            {/* Upload button */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 disabled:opacity-60"
              aria-label="ছবি আপলোড"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div>
            <p className="text-lg font-bold text-foreground">
              {form.name || "ইউজার"}
            </p>
            <p className="text-sm text-muted-foreground">{form.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              ছবি পরিবর্তন করতে ক্যামেরা আইকনে ক্লিক করুন
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">পুরো নাম</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 transition-colors focus-within:border-primary">
              <User className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="আপনার নাম"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">ইমেইল</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-4 py-3">
              <Mail className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full cursor-not-allowed bg-transparent text-sm text-muted-foreground focus:outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">ইমেইল পরিবর্তন করা যাবে না</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">ফোন নম্বর</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 transition-colors focus-within:border-primary">
              <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="০১XXXXXXXXX"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">ডেলিভারি ঠিকানা</label>
            <div className="flex items-start gap-2 rounded-xl border border-border bg-background px-4 py-3 transition-colors focus-within:border-primary">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                placeholder="বাসা নং, রোড, এলাকা, শহর"
                className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40 disabled:opacity-60 sm:w-auto"
          >
            <Save className="h-4 w-4" />
            {saving ? "সেভ হচ্ছে..." : "পরিবর্তন সেভ করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}