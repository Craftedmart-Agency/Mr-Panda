import SpecialOfferContent from "./_components/SpecialOfferContent";

export default function SpecialOfferPage() {
  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-16 lg:py-20">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <TagIcon />
            সীমিত সময়ের অফার
          </div>
          <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            স্পেশাল <span className="text-primary">অফার</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            সেরা ডিল আর কম্বো প্যাকেজে উপভোগ করুন আপনার পছন্দের খাবার।
          </p>
        </div>
      </div>

      <SpecialOfferContent />
    </div>
  );
}

function TagIcon() {
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
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}