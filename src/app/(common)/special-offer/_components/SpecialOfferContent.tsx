import Image from "next/image";
import Link from "next/link";
import { Check, Percent, Gift, ArrowRight } from "lucide-react";

interface Deal {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  offerPrice: number;
  discount: number;
}

interface Combo {
  id: string;
  name: string;
  items: string[];
  imageUrl: string;
  price: number;
  savings: number;
}

const deals: Deal[] = [
  {
    id: "1",
    name: "চিজ বার্গার",
    description: "জুসি বিফ প্যাটি, ডাবল চিজ আর তাজা সবজি।",
    imageUrl: "/hero.png",
    originalPrice: 350,
    offerPrice: 250,
    discount: 28,
  },
  {
    id: "2",
    name: "মার্গারিটা পিৎজা",
    description: "ক্লাসিক টমেটো সস আর মোজারেলা চিজ।",
    imageUrl: "/hero.png",
    originalPrice: 550,
    offerPrice: 420,
    discount: 24,
  },
  {
    id: "3",
    name: "স্পেশাল সালাদ",
    description: "তাজা সবজি আর বিশেষ ড্রেসিং।",
    imageUrl: "/hero.png",
    originalPrice: 250,
    offerPrice: 180,
    discount: 28,
  },
];

const combos: Combo[] = [
  {
    id: "1",
    name: "ফ্যামিলি কম্বো",
    items: ["২টি বার্গার", "১টি পিৎজা", "৪টি ড্রিংকস"],
    imageUrl: "/hero.png",
    price: 999,
    savings: 350,
  },
  {
    id: "2",
    name: "কাপল কম্বো",
    items: ["২টি বার্গার", "২টি ড্রিংকস", "১টি সালাদ"],
    imageUrl: "/hero.png",
    price: 650,
    savings: 200,
  },
];

export default function SpecialOfferContent() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-12">
      {/* DEALS SECTION */}
      <section className="mb-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <Percent className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">আজকের ডিল</h2>
            <p className="text-sm text-muted-foreground">
              বিশেষ ছাড়ে পছন্দের খাবার
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={deal.imageUrl}
                  alt={deal.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-lg">
                  {deal.discount}% ছাড়
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground">{deal.name}</h3>
                <p className="mt-1.5 line-clamp-1 text-sm text-muted-foreground">
                  {deal.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">
                      ৳{deal.offerPrice}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ৳{deal.originalPrice}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    className="cursor-pointer rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:shadow-lg"
                  >
                    অর্ডার করুন
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMBO SECTION */}
      <section className="mb-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">কম্বো প্যাকেজ</h2>
            <p className="text-sm text-muted-foreground">একসাথে বেশি, দামে কম</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-xl sm:flex-row"
            >
              <div className="relative aspect-[4/3] sm:aspect-auto sm:w-2/5">
                <Image
                  src={combo.imageUrl}
                  alt={combo.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 40vw"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-lg">
                  ৳{combo.savings} সাশ্রয়
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {combo.name}
                  </h3>
                  <ul className="mt-3 space-y-1.5">
                    {combo.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ৳{combo.price}
                  </span>
                  <Link
                    href="/checkout"
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:shadow-lg"
                  >
                    অর্ডার করুন
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-3xl bg-primary p-10 text-center sm:p-14">
        <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">
          আরও খাবার অর্ডার করতে চান?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/80">
          আমাদের পুরো মেনু দেখুন আর পছন্দের খাবার বেছে নিন।
        </p>
        <Link
          href="/menu"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-background px-8 py-3.5 text-sm font-semibold text-primary shadow-lg transition-all hover:shadow-xl"
        >
          মেনু দেখুন
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}