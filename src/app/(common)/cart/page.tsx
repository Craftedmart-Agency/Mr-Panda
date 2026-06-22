import CartContent from "./_components/CartContent";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-12 lg:py-16">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            আপনার <span className="text-primary">কার্ট</span>
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            পছন্দের খাবারগুলো দেখে নিন আর অর্ডার সম্পন্ন করুন
          </p>
        </div>
      </div>

      <CartContent />
    </div>
  );
}