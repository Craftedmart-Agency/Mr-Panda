"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  // Admin ar account dashboard e navbar hide
  const hideNavbar = pathname.startsWith("/admin");
  if (hideNavbar) return null;
  return <Navbar />;
}