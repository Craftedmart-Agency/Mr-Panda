import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-background pt-20 lg:pt-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/70 via-background to-secondary/40" />
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />

      {/* Decorative zigzags */}
      <svg
        className="pointer-events-none absolute left-[6%] top-[24%] h-7 w-11 text-primary/50 sm:h-10 sm:w-16"
        viewBox="0 0 60 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 20 L15 8 L25 20 L35 8 L45 20 L55 8" />
      </svg>
      <svg
        className="pointer-events-none absolute right-[8%] top-[12%] h-6 w-9 rotate-12 text-primary/40 sm:h-8 sm:w-12"
        viewBox="0 0 60 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 20 L15 8 L25 20 L35 8 L45 20 L55 8" />
      </svg>
      <svg
        className="pointer-events-none absolute bottom-[20%] left-[10%] h-6 w-9 -rotate-6 text-primary/40 sm:h-8 sm:w-12"
        viewBox="0 0 60 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 20 L15 8 L25 20 L35 8 L45 20 L55 8" />
      </svg>

      {/* Dots cluster */}
      <div className="pointer-events-none absolute right-[12%] bottom-[22%] grid grid-cols-3 gap-1.5 sm:gap-2">
        {[...Array(9)].map((_, i) => (
          <span
            key={i}
            className="h-1 w-1 rounded-full bg-primary/40 sm:h-1.5 sm:w-1.5"
          />
        ))}
      </div>

      {/* Decorative rings */}
      <div className="pointer-events-none absolute left-[14%] top-[55%] hidden h-10 w-10 rounded-full border-2 border-primary/30 sm:block" />
      <div className="pointer-events-none absolute right-[6%] top-[45%] h-3 w-3 rounded-full bg-primary/40" />
      <div className="pointer-events-none absolute left-[45%] top-[8%] h-2 w-2 rounded-full bg-primary/50" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-8 pb-12 pt-4 sm:min-h-[calc(100vh-80px)] sm:grid-cols-2 sm:gap-8 sm:py-14 lg:min-h-0 lg:gap-12 lg:py-20">
          {/* LEFT CONTENT — mobile e PORE (order-2), desktop e age (order-1) */}
          <div className="order-2 text-center sm:order-1 sm:text-left">
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              শহরের সেরা স্বাদ
            </div>

            <h1 className="text-[2rem] font-light leading-[1.2] sm:text-[2.6rem] md:text-5xl lg:text-6xl xl:text-7xl">
              প্রতিটি কামড়ে
              <br />
              <span className="font-bold">খাঁটি স্বাদের</span>
              <br />
              <span className="relative inline-block text-primary">
                ছোঁয়া
                <svg
                  className="absolute -bottom-2 left-0 w-full text-primary/40"
                  viewBox="0 0 100 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 5 Q25 2 50 5 T98 4"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:mx-0 sm:text-base lg:text-lg">
              যত্ন করে বাছাই করা উপকরণ, শেফের হাতের জাদু — প্রতিটি পদ যেন এক
              নিখুঁত অভিজ্ঞতা।
            </p>

            <Link
              href="/menu"
              className="mt-7 inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/40"
            >
              মেনু এক্সপ্লোর করুন
              <ArrowRight size={16} className="shrink-0" />
            </Link>
          </div>

          {/* RIGHT IMAGE — mobile e AGE (order-1), desktop e pore (order-2) */}
          <div className="order-1 flex justify-center sm:order-2 sm:justify-end">
            <div className="relative flex aspect-square w-full max-w-[240px] items-center justify-center sm:max-w-[280px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-[560px]">
              {/* Glow */}
              <div className="absolute h-[80%] w-[80%] rounded-full bg-primary/25 blur-3xl" />

              {/* Dashed circle backdrop */}
              <div className="absolute h-[95%] w-[95%] rounded-full border-2 border-dashed border-primary/40" />

              {/* Spinning plate */}
              <div className="animate-spin-slow relative z-10 aspect-square w-[85%]">
                <Image
                  src="/hero.png"
                  alt="সুস্বাদু এশিয়ান খাবার"
                  fill
                  priority
                  sizes="(max-width:640px) 200px, (max-width:768px) 240px, (max-width:1024px) 340px, 480px"
                  className="object-contain drop-shadow-[0_20px_60px_rgba(236,72,153,.35)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
