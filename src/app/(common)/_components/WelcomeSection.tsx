import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WelcomeSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-tl from-[#fbd5e8] via-[#fce7f3] to-[#fdf2f8] py-14 sm:py-20 lg:py-28">
      {/* Big organic blob — bottom right corner */}
      <svg
        className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] text-primary/15"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M39.5,-65.3C52.3,-58.3,64.5,-49.6,72.6,-37.6C80.7,-25.6,84.7,-10.3,83.1,4.3C81.5,18.9,74.3,32.8,64.8,44.9C55.3,57,43.5,67.3,29.7,73.5C15.9,79.7,0.1,81.8,-15.8,79.4C-31.7,77,-47.7,70.1,-59.4,58.6C-71.1,47.1,-78.5,31,-81.3,14.1C-84.1,-2.8,-82.3,-20.5,-75.1,-35.3C-67.9,-50.1,-55.3,-62,-41.1,-68.5C-26.9,-75,-13.5,-76.1,0.2,-76.4C13.8,-76.7,27.7,-76.2,39.5,-65.3Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Soft glow */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

      {/* Dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-primary) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:px-12">
        {/* Left — Image */}
        <div className="order-1 flex items-center justify-center">
          <div className="relative aspect-square w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-none lg:w-full xl:max-w-3xl">
            <Image
              src="/cutlery.png"
              alt="পান্ডা রেস্টুরেন্টের সুস্বাদু খাবার"
              fill
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, (max-width: 1280px) 50vw, 45vw"
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Right — Content */}
        <div className="order-2 text-center lg:text-left">
          <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
            স্বাগতম আমাদের
            <br />
            <span className="text-primary">পান্ডা</span> রেস্টুরেন্টে
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/70 sm:mt-8 sm:text-lg lg:mx-0">
            খাবার মূলত প্রোটিন, কার্বোহাইড্রেট, ফ্যাট আর অন্যান্য পুষ্টি উপাদানে
            তৈরি, যা শরীরের বৃদ্ধি আর শক্তির জোগান দেয়। আমরা প্রতিটি পদ তৈরি করি
            সর্বোচ্চ যত্ন আর তাজা উপকরণে, যাতে প্রতিটি কামড়ে থাকে পুষ্টি আর স্বাদের
            নিখুঁত মিশ্রণ।
          </p>

          <div className="mt-8 sm:mt-10">
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/40 sm:px-9 sm:py-4 sm:text-base"
            >
              আরও জানুন
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}