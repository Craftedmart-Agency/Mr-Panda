"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Offer {
  id: string;
  type: "DEAL" | "COMBO";
  title: string;
  description: string | null;
  imageUrl: string;
  originalPrice: number;
  offerPrice: number;
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          স্পেশাল <span className="text-primary">অফার</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          আকর্ষণীয় ছাড় ও কম্বো প্যাকেজ
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="mt-16 text-center text-muted-foreground">
          এখন কোনো অফার নেই। শীঘ্রই আসছে!
        </div>
      ) : (
        <>
          {/* Deals */}
          {deals.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-5 text-xl font-bold text-foreground">🔥 সেরা ডিল</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {deals.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </section>
          )}

          {/* Combos */}
          {combos.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-5 text-xl font-bold text-foreground">🍱 কম্বো প্যাকেজ</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {combos.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const discount = Math.round(
    ((offer.originalPrice - offer.offerPrice) / offer.originalPrice) * 100
  );
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="relative h-48">
        <Image src={offer.imageUrl} alt={offer.title} fill className="object-cover" />
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
            {discount}% ছাড়
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground">{offer.title}</h3>
        {offer.description && (
          <p className="mt-1 text-sm text-muted-foreground">{offer.description}</p>
        )}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">৳{offer.offerPrice}</span>
          <span className="text-base text-muted-foreground line-through">
            ৳{offer.originalPrice}
          </span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
        >
          অর্ডার করুন
        </Link>
      </div>
    </div>
  );
}