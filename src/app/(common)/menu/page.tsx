import MenuContent from "./_components/MenuContent";

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-16 lg:py-20">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            আমাদের <span className="text-primary">মেনু</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            তাজা উপকরণে তৈরি আমাদের সব সুস্বাদু খাবার এক জায়গায়। আপনার পছন্দের পদ
            বেছে নিন আর অর্ডার করুন ঘরে বসেই।
          </p>
        </div>
      </div>

      {/* Menu content (filter + grid) */}
      <MenuContent />
    </div>
  );
}