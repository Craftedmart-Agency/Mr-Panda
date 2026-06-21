"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const reviews = [
  {
    name: "আব্দুল্লাহ ইকবাল",
    image: "https://i.pravatar.cc/200?img=12",
    rating: 5,
    review:
      "একজন গ্রাহক এমন ব্যক্তি বা প্রতিষ্ঠান যিনি অন্য প্রতিষ্ঠান থেকে পণ্য বা সেবা ক্রয় করেন। গ্রাহকরা অত্যন্ত গুরুত্বপূর্ণ কারণ তারাই রাজস্ব তৈরি করেন।",
  },
  {
    name: "হেনরি জন",
    image: "https://i.pravatar.cc/200?img=33",
    rating: 5,
    review:
      "খাবারের মান আর পরিবেশনা দুটোই অসাধারণ ছিল। প্রতিটি পদে তাজা উপকরণের ছোঁয়া আর যত্নের ছাপ স্পষ্ট বোঝা যায়। আবারও আসব নিশ্চিত।",
  },
  {
    name: "সাবরিনা আক্তার",
    image: "https://i.pravatar.cc/200?img=47",
    rating: 5,
    review:
      "পরিবারের সবাই মিলে খেতে গিয়েছিলাম, সবার অভিজ্ঞতা দারুণ ছিল। স্টাফরা অনেক আন্তরিক আর খাবারও সময়মতো পেয়েছি।",
  },
  {
    name: "রাকিবুল হাসান",
    image: "https://i.pravatar.cc/200?img=68",
    rating: 4,
    review:
      "পরিবেশ খুব সুন্দর আর শান্ত। খাবারের স্বাদ চমৎকার, বিশেষ করে এদের স্পেশাল ডিশগুলো অবশ্যই ট্রাই করা উচিত।",
  },
  {
    name: "তানজিলা ফেরদৌস",
    image: "https://i.pravatar.cc/200?img=45",
    rating: 5,
    review:
      "প্রতিবার নতুন কিছু চেষ্টা করার সুযোগ পাই এখানে। কোয়ালিটি কখনো কমেনি, বরং দিন দিন আরও ভালো হচ্ছে। হাইলি রিকমেন্ডেড।",
  },
];

export default function HappyCustomers() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#fce7f3] via-[#fbd5e8] to-[#fce7f3] py-20 lg:py-28">
      {/* Soft glow accents */}
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

      {/* Dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-primary) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            আমাদের <span className="text-primary">পান্ডা</span> রেস্টুরেন্টের
            <br />
            সুখী গ্রাহকরা
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
            একজন গ্রাহক এমন ব্যক্তি বা প্রতিষ্ঠান যিনি অন্য প্রতিষ্ঠান থেকে
            পণ্য বা সেবা ক্রয় করেন। গ্রাহকরা অত্যন্ত গুরুত্বপূর্ণ, কারণ তারাই
            ব্যবসার প্রাণ।
          </p>
        </div>

        {/* Carousel */}
        <div className="mt-20">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="mx-auto w-full max-w-6xl overflow-visible"
          >
            <CarouselContent className="-ml-4 overflow-visible pt-12 pb-6 sm:-ml-6">
              {reviews.map((customer, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 sm:basis-1/2 sm:pl-6 lg:basis-1/3"
                >
                  <ReviewCard {...customer} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-8 flex items-center justify-center gap-4">
              <CarouselPrevious className="static h-11 w-11 translate-x-0 translate-y-0 border-primary/30 bg-white text-primary hover:bg-primary hover:text-primary-foreground" />
              <CarouselNext className="static h-11 w-11 translate-x-0 translate-y-0 border-primary/30 bg-white text-primary hover:bg-primary hover:text-primary-foreground" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  name,
  image,
  rating,
  review,
}: {
  name: string;
  image: string;
  rating: number;
  review: string;
}) {
  return (
    <div className="group relative h-full rounded-3xl bg-white p-8 pt-16 shadow-lg shadow-primary/10 ring-1 ring-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
      {/* Quote icon accent */}
      <div className="absolute right-6 top-6 text-primary/10">
        <Quote className="h-10 w-10" fill="currentColor" />
      </div>

      {/* Avatar — overlapping top of card */}
      <div className="absolute -top-10 left-1/2 z-10 -translate-x-1/2">
        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-white ring-4 ring-primary/20">
          <Image
            src={image}
            alt={name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Star rating */}
      <div className="flex justify-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>

      {/* Review text */}
      <p className="mt-5 text-center text-sm leading-relaxed text-foreground/70 sm:text-base">
        {review}
      </p>

      {/* Name */}
      <p className="mt-6 text-center text-lg font-bold text-foreground">
        {name}
      </p>
    </div>
  );
}