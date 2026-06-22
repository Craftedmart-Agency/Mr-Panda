import Link from "next/link";
import { Home, UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-6">
      {/* Soft pink background blobs */}
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-lg text-center">
        {/* Big 404 */}
        <h1 className="text-[120px] font-bold leading-none text-primary sm:text-[160px]">
          ৪০৪
        </h1>

        {/* Icon */}
        <div className="mx-auto -mt-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <UtensilsCrossed className="h-8 w-8 text-primary" />
        </div>

        {/* Message */}
        <h2 className="mt-6 text-2xl font-bold text-foreground sm:text-3xl">
          ওহো! পেজটি খুঁজে পাওয়া যায়নি
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          আপনি যে পেজটি খুঁজছেন সেটি হয়তো সরিয়ে ফেলা হয়েছে, নাম পরিবর্তন হয়েছে,
          অথবা সাময়িকভাবে অনুপলব্ধ। চলুন আবার শুরু করি।
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            হোমে ফিরে যান
          </Link>
          <Link
            href="/menu"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-border px-8 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary sm:w-auto"
          >
            মেনু দেখুন
          </Link>
        </div>
      </div>
    </div>
  );
}