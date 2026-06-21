import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/70 via-background to-secondary/40" />
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-20 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:px-12 lg:py-28">
        {/* Left Content */}
        <div className="order-2 lg:order-1">
          <h1 className="text-5xl font-light leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            প্রতিটি কামড়ে
            <br />
            <span className="font-bold">খাঁটি স্বাদের</span>
            <br />
            <span className="text-primary">ছোঁয়া</span>
          </h1>

          <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">
            যত্ন করে বাছাই করা উপকরণ, শেফের হাতের জাদু — প্রতিটি পদ যেন এক নিখুঁত
            অভিজ্ঞতা।
          </p>

          <div className="mt-10">
            <Link
              href="/menu"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/40"
            >
              মেনু এক্সপ্লোর করুন
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="order-1 flex items-center justify-center lg:order-2">
          <div className="relative flex aspect-square w-full max-w-xl items-center justify-center">
            <div className="absolute h-[80%] w-[80%] rounded-full bg-primary/25 blur-3xl" />

            {/* Floating food image — bigger */}
            <div className="animate-float relative z-10 aspect-square w-full">
              <Image
                src="/hero.png"
                alt="সুস্বাদু এশিয়ান খাবার"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-contain drop-shadow-[0_25px_45px_rgba(236,72,153,0.35)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}