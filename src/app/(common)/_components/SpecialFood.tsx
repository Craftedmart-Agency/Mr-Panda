import FoodCard from "./FoodCard";

const foods = [
  {
    id: "1",
    name: "স্পেশাল সালাদ",
    description: "তাজা সবজি আর বিশেষ ড্রেসিং দিয়ে তৈরি স্বাস্থ্যকর সালাদ।",
    price: 250,
    imageUrl: "/hero.png",
  },
  {
    id: "2",
    name: "রাশিয়ান সালাদ",
    description: "ক্রিমি টেক্সচার আর মুখরোচক স্বাদের রাশিয়ান সালাদ।",
    price: 300,
    imageUrl: "/hero.png",
  },
  {
    id: "3",
    name: "এশিয়ান সালাদ",
    description: "এশিয়ান হার্বস আর সসে তৈরি ঝরঝরে সুস্বাদু সালাদ।",
    price: 280,
    imageUrl: "/hero.png",
  },
  {
    id: "4",
    name: "আমেরিকান সালাদ",
    description: "প্রোটিন আর সবজির পারফেক্ট কম্বিনেশনের আমেরিকান সালাদ।",
    price: 320,
    imageUrl: "/hero.png",
  },
];

export default function SpecialFood() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#fce7f3] via-[#fbd5e8] to-[#f9c5dd] py-20 lg:py-28">
      {/* SVG Blob — top left */}
      <svg
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 text-primary/20"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.2,88.5,-0.9C87,14.5,81.4,29,73.1,42.2C64.8,55.4,53.8,67.3,40.3,74.8C26.8,82.3,10.7,85.4,-4.8,83.6C-20.3,81.8,-35.2,75.1,-48.6,66C-62,56.9,-73.9,45.4,-79.9,31.4C-85.9,17.4,-86,0.9,-82.4,-14.4C-78.8,-29.7,-71.5,-43.8,-60.5,-51.8C-49.5,-59.8,-34.8,-61.7,-21.3,-69.5C-7.8,-77.3,4.5,-91,18.1,-91.4C31.7,-91.8,46.6,-78.9,44.7,-76.4Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* SVG Blob — bottom right */}
      <svg
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 text-accent/40"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M39.5,-65.3C52.3,-58.3,64.5,-49.6,72.6,-37.6C80.7,-25.6,84.7,-10.3,83.1,4.3C81.5,18.9,74.3,32.8,64.8,44.9C55.3,57,43.5,67.3,29.7,73.5C15.9,79.7,0.1,81.8,-15.8,79.4C-31.7,77,-47.7,70.1,-59.4,58.6C-71.1,47.1,-78.5,31,-81.3,14.1C-84.1,-2.8,-82.3,-20.5,-75.1,-35.3C-67.9,-50.1,-55.3,-62,-41.1,-68.5C-26.9,-75,-13.5,-76.1,0.2,-76.4C13.8,-76.7,27.7,-76.2,39.5,-65.3Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* SVG Blob — small accent, top right */}
      <svg
        className="pointer-events-none absolute right-10 top-16 hidden h-32 w-32 text-primary/15 lg:block"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M48.2,-77.8C61.9,-69.3,72.3,-55.3,78.7,-40.1C85.1,-24.9,87.5,-8.5,85.3,7.2C83.1,22.9,76.3,37.9,66.4,50.6C56.5,63.3,43.5,73.7,28.8,78.9C14.1,84.1,-2.3,84.1,-18.1,80.3C-33.9,76.5,-49.1,68.9,-60.8,57.3C-72.5,45.7,-80.7,30.1,-83.5,13.4C-86.3,-3.3,-83.7,-21.1,-75.8,-35.8C-67.9,-50.5,-54.7,-62.1,-40.3,-70.2C-25.9,-78.3,-10.3,-82.9,3.2,-87.9C16.7,-92.9,34.5,-86.3,48.2,-77.8Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Soft glow blobs */}
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            আমাদের সুস্বাদু এবং স্পেশাল
            <br />
            <span className="text-primary">খাবার</span>
          </h2>
          <p className="mt-5 text-base text-foreground/70">
            যত্ন করে বাছাই করা উপকরণে তৈরি আমাদের প্রতিটি পদ, পুষ্টি আর স্বাদের
            নিখুঁত মিশ্রণ।
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {foods.map((food) => (
            <FoodCard key={food.name} {...food} />
          ))}
        </div>
      </div>
    </section>
  );
}