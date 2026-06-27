import Image from "next/image";
import Link from "next/link";
import { Heart, Leaf, ChefHat, Clock, ArrowRight, Quote } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "তাজা উপকরণ",
    description: "প্রতিদিন বাছাই করা তাজা ও মানসম্পন্ন উপকরণ দিয়ে রান্না।",
  },
  {
    icon: ChefHat,
    title: "দক্ষ শেফ",
    description: "অভিজ্ঞ শেফদের হাতের জাদুতে তৈরি প্রতিটি সুস্বাদু পদ।",
  },
  {
    icon: Heart,
    title: "ভালোবাসায় তৈরি",
    description: "প্রতিটি খাবার যত্ন আর ভালোবাসা দিয়ে প্রস্তুত করা হয়।",
  },
  {
    icon: Clock,
    title: "দ্রুত ডেলিভারি",
    description: "গরম গরম খাবার সময়মতো আপনার দরজায় পৌঁছে দেওয়া।",
  },
];

const stats = [
  { number: "১০ হাজার+", label: "সন্তুষ্ট গ্রাহক" },
  { number: "৫০+", label: "সুস্বাদু পদ" },
  { number: "৫ বছর+", label: "অভিজ্ঞতা" },
  { number: "৪.৯", label: "গড় রেটিং" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-16 lg:py-20">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <Heart className="h-3.5 w-3.5" />
            আমাদের গল্প
          </div>
          <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            আমাদের <span className="text-primary">সম্পর্কে</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            মিস্টার পান্ডা শুধু একটি রেস্টুরেন্ট নয় — এটি স্বাদ, ভালোবাসা আর
            যত্নের এক অনন্য যাত্রা।
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="relative">
            <div className="absolute inset-0 -rotate-3 rounded-3xl bg-primary/50" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                alt="মিস্টার পান্ডা রেস্টুরেন্ট"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              যেখানে স্বাদের শুরু
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              ২০২০ সালে এক ছোট স্বপ্ন নিয়ে যাত্রা শুরু করে মিস্টার পান্ডা।
              আমাদের লক্ষ্য ছিল সহজ — প্রতিটি মানুষের কাছে খাঁটি, সুস্বাদু আর
              স্বাস্থ্যকর খাবার পৌঁছে দেওয়া।
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              আজ আমরা গর্বিত যে হাজারো গ্রাহকের ভরসার নাম হয়ে উঠেছি। প্রতিটি
              পদে আমরা যত্ন আর ভালোবাসা মিশিয়ে দিই, যাতে আপনার প্রতিটি কামড়
              হয় এক অবিস্মরণীয় অভিজ্ঞতা।
            </p>

            <Link
              href="/recipe"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
            >
              খাবার দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-14">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary-foreground sm:text-4xl">
                  {stat.number}
                </p>
                <p className="mt-2 text-sm text-primary-foreground/80">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground">
            কেন আমরা <span className="text-primary">আলাদা</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            আমাদের প্রতিশ্রুতি আপনার সন্তুষ্টি আর সেরা মানের খাবার।
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <value.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="mx-auto max-w-4xl px-6 pb-20 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-secondary/50 p-10 text-center sm:p-14">
          <Quote className="mx-auto h-10 w-10 text-primary/40" />
          <p className="mx-auto mt-6 max-w-2xl text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
            &ldquo;আমাদের কাছে খাবার মানে শুধু পেট ভরানো নয় — এটি আনন্দ, স্মৃতি
            আর ভালোবাসা ভাগ করে নেওয়ার একটি উপায়।&rdquo;
          </p>
          <p className="mt-6 text-sm font-semibold text-primary">
            — মিস্টার পান্ডা টিম
          </p>
        </div>
      </section>
    </div>
  );
}
