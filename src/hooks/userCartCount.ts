/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

export function useCartCount() {
  const [isMounted, setIsMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? totalItems() : 0;
}