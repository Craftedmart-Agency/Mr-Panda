import RecipeContent from "./_components/RecipeContent";

export default function RecipePage() {
  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-16 lg:py-20">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <ChefHatIcon />
            শেফের স্পেশাল
          </div>
          <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            আমাদের <span className="text-primary">রেসিপি</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            ঘরে বসেই বানিয়ে ফেলুন আমাদের জনপ্রিয় খাবারগুলো। প্রতিটি রেসিপিতে
            ধাপে ধাপে নির্দেশনা আর প্রয়োজনীয় উপকরণ।
          </p>
        </div>
      </div>

      <RecipeContent />
    </div>
  );
}

function ChefHatIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <line x1="6" x2="18" y1="17" y2="17" />
    </svg>
  );
}