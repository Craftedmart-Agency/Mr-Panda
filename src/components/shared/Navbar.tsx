"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, ShoppingCart, Menu, X } from "lucide-react";

const navLinks = [
  { label: "প্রোডাক্ট", href: "/menu" },
  { label: "রেসিপি", href: "/recipe" },
  { label: "আমাদের সম্পর্কে", href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background border-b border-border">
      <nav className="flex w-full items-center justify-between px-6 py-4 lg:px-12">
        {/* Left — Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <span className="text-xl">🐼</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            MR. PANDA
          </span>
        </Link>

        {/* Center — Nav Links + Phone */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

          {/* Special Offer — box shape */}
          <Link
            href="/special-offer"
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            স্পেশাল অফার
          </Link>

          {/* Phone */}
          <a
            href="tel:+923351263561"
            className="flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4 text-primary" />
            <span className="hidden xl:inline">+৯২৩৩৫১২৬৩৫৬১</span>
          </a>
        </div>
        <div className="hidden items-center gap-4 lg:flex">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
            aria-label="কার্ট"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
          </Link>
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            লগইন
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            সাইন আপ
          </Link>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href="tel:+923351263561"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
            aria-label="কল করুন"
          >
            <Phone className="h-4 w-4 text-primary" />
          </a>
          <Link
            href="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
            aria-label="কার্ট"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-label="মেনু খুলুন"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Slide-in Menu */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-[80%] max-w-sm bg-background shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <span className="text-lg">🐼</span>
            </div>
            <span className="font-bold text-foreground">MR. PANDA</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
            aria-label="মেনু বন্ধ করুন"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex flex-col gap-1 px-5 py-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/special-offer"
            onClick={() => setMobileOpen(false)}
            className="mt-2 rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground"
          >
            স্পেশাল অফার
          </Link>
        </div>

        {/* Drawer Footer — Auth Buttons */}
        <div className="absolute bottom-0 left-0 w-full border-t border-border px-5 py-6">
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg border border-border px-4 py-3 text-center text-base font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              লগইন
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground"
            >
              সাইন আপ
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
