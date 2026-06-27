"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart, Flame, Package, UtensilsCrossed } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface Offer {
  id: string;
  type: "DEAL" | "COMBO";
  title: string;
  description: string | null;
  imageUrl: string;
  originalPrice: number;
  offerPrice: number;
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-border bg-card shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-secondary" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-secondary" />
        <div className="h-3 w-full animate-pulse rounded-full bg-secondary" />
        <div className="h-10 w-full animate-pulse rounded-2xl bg-secondary" />
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <h2 className="text-xl font-bold text-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export default function SpecialOfferContent() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/offers?active=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.offers) setOffers(data.offers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const deals = offers.filter((o) => o.type === "DEAL");
  const combos = offers.filter((o) => o.type === "COMBO");

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <UtensilsCrossed className="h-9 w-9 text-muted-foreground" />
        </div>
        <p className="mt-5 text-lg font-semibold text-foreground">এখন কোনো অফার নেই</p>
        <p className="mt-2 text-sm text-muted-foreground">শীঘ্রই নতুন অফার আসছে!</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Deals */}
      {deals.length > 0 && (
        <section className="mb-14">
          <SectionHeader
            icon={Flame}
            label="সেরা ডিল"
            color="bg-orange-100 text-orange-500"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {/* Combos */}
      {combos.length > 0 && (
        <section>
          <SectionHeader
            icon={Package}
            label="কম্বো প্যাকেজ"
            color="bg-violet-100 text-violet-500"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {combos.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const addItem = useCartStore((state) => state.addItem);
  const discount = Math.round(
    ((offer.originalPrice - offer.offerPrice) / offer.originalPrice) * 100,
  );
  const savings = offer.originalPrice - offer.offerPrice;
  const isDeal = offer.type === "DEAL";

  const handleAddToCart = () => {
    addItem({ id: offer.id, name: offer.title, price: offer.offerPrice, imageUrl: offer.imageUrl });
    toast.success(`${offer.title} কার্টে যোগ হয়েছে!`);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-[22px] border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10">

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Image
          src={offer.imageUrl}
          alt={offer.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Type badge — top left */}
        <span
          className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-md backdrop-blur-sm ${
            isDeal ? "bg-orange-500" : "bg-violet-500"
          }`}
        >
          {isDeal ? <Flame className="h-3 w-3" /> : <Package className="h-3 w-3" />}
          {isDeal ? "ডিল" : "কম্বো"}
        </span>

        {/* Discount badge — top right, circular */}
        {discount > 0 && (
          <div className="absolute right-3 top-3 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/50">
            <span className="text-[17px] font-black leading-none text-white">
              {discount}%
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wide text-white/90">
              ছাড়
            </span>
          </div>
        )}

        {/* Title on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="line-clamp-1 text-[15px] font-bold text-white drop-shadow-sm">
            {offer.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 pt-3.5">

        {/* Description */}
        {offer.description && (
          <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
            {offer.description}
          </p>
        )}

        {/* Prices + CTA */}
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-[22px] font-black leading-none text-primary">
                ৳{offer.offerPrice}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ৳{offer.originalPrice}
              </span>
            </div>
            {savings > 0 && (
              <p className="mt-1 text-[11px] font-semibold text-emerald-600">
                ৳{savings} সাশ্রয়
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-bold text-primary-foreground shadow-md shadow-primary/30 transition-all duration-200 hover:brightness-105 hover:shadow-lg hover:shadow-primary/40 active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            কার্টে যোগ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
