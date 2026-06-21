import Link from "next/link";
import { Send, Share2, AtSign } from "lucide-react";
const navigation = [
  { label: "মেনু", href: "/menu" },
  { label: "আমাদের সম্পর্কে", href: "/about" },
  { label: "যোগাযোগ", href: "/contact" },
  { label: "প্রধান খাবার", href: "/menu" },
];

const dishes = [
  { label: "ফিশ অ্যান্ড ভেজি", href: "/menu" },
  { label: "টোফু চিলি", href: "/menu" },
  { label: "এগ অ্যান্ড কিউকাম্বার", href: "/menu" },
  { label: "লুম্পিয়া উইথ সস", href: "/menu" },
];

const socials = [
  { icon: Send, href: "https://facebook.com", label: "ফেসবুক" },
  { icon: Share2, href: "https://instagram.com", label: "ইনস্টাগ্রাম" },
  { icon: AtSign, href: "https://twitter.com", label: "টুইটার" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand + Opening Hours */}
          <div className="lg:col-span-5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl">🐼</span>
              </div>
              <span className="text-lg font-bold text-foreground">MR. PANDA</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              তাজা উপকরণে তৈরি সুস্বাদু এশিয়ান খাবার, ঘরে বসেই উপভোগ করুন আমাদের
              যত্নে তৈরি প্রতিটি পদ।{" "}
              <Link href="/about" className="font-medium text-primary hover:underline">
                আরও জানুন
              </Link>
            </p>

            {/* Opening Hours */}
            <div className="mt-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                খোলার সময়
              </h4>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="font-medium text-foreground">শনি - বৃহস্পতি</p>
                  <p className="mt-1 text-muted-foreground">সকাল ৯টা - রাত ৯টা</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">শুক্রবার</p>
                  <p className="mt-1 text-muted-foreground">বিকাল ৩টা - রাত ৯টা</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              ন্যাভিগেশন
            </h4>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dishes */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              খাবার
            </h4>
            <ul className="mt-5 space-y-3">
              {dishes.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              ফলো করুন
            </h4>
            <div className="mt-5 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © ২০২৬ মিস্টার পান্ডা। সর্বস্বত্ব সংরক্ষিত। ডিজাইন করেছে{" "}
            <span className="font-semibold text-foreground">Craftedmart Agency</span>
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              শর্তাবলী
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              প্রাইভেসি পলিসি
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}