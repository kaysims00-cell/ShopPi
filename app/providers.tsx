"use client";

import { CartProvider } from "@/app/context/CartContext";
import { RewardsProvider } from "@/app/context/RewardsContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <RewardsProvider>{children}</RewardsProvider>
    </CartProvider>
  );
}
