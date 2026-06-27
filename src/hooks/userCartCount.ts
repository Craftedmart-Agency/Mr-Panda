"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

export function useCartCount() {
  const [isMounted, setIsMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;
}