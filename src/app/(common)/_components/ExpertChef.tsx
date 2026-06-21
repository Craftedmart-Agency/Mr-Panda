import Image from "next/image";

export default function ExpertChef() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-20 lg:py-28">
      {/* Soft glow accents */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-12 lg:px-12">
        {/* Left — Content */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <h2 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            আমাদের <span className="text-primary">পান্ডা</span>
            <br />
            রেস্টুরেন্ট এক্সপার্ট
            <br />
            শেফ
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-foreground/70 lg:mx-0">
            খাবার মূলত প্রোটিন, কার্বোহাইড্রেট, ফ্যাট আর অন্যান্য পুষ্টি উপাদানে
            তৈরি, যা শরীরের বৃদ্ধি আর শক্তির জোগান দেয়। আমাদের অভিজ্ঞ শেফরা
            প্রতিটি পদ তৈরি করেন সর্বোচ্চ যত্ন আর তাজা উপকরণে, যাতে প্রতিটি
            কামড়ে থাকে পুষ্টি আর স্বাদের নিখুঁত মিশ্রণ।
          </p>
        </div>

        {/* Right — Chef Image with circle backdrop */}
        <div className="order-1 flex items-center justify-center lg:order-2">
          <div className="relative flex aspect-square w-full max-w-xl items-center justify-center lg:max-w-2xl">
            {/* Pink circle backdrop */}
            <div className="absolute h-[85%] w-[85%] rounded-full bg-primary/80" />
            {/* Outline ring */}
            <div className="absolute h-[92%] w-[92%] rounded-full border-2 border-primary/40" />
            <div className="absolute left-1/2 top-[38%] z-10 w-[85%] -translate-x-1/2 -translate-y-1/2">
              <Image
                src="/chef.png"
                alt="পান্ডা রেস্টুরেন্ট এক্সপার্ট শেফ"
                width={800}
                height={800}
                sizes="(max-width: 1024px) 70vw, 40vw"
                className="h-auto w-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}