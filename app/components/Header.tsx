"use client";

import Link from "next/link";
import { ShoppingCart, Trophy } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useRewards } from "@/app/context/RewardsContext";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const { cart } = useCart();
  const { points } = useRewards(); // <-- Rewards points

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="w-full bg-card border-b border-border flex items-center justify-between px-4 py-3 sticky top-0 z-50">
      <Link href="/rewards">
  <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full cursor-pointer">
    <Trophy className="w-4 h-4 text-yellow-600" />
    <span className="font-semibold text-yellow-700">{points}</span>
  </div>
</Link>

      <div className="flex items-center gap-6">

        {/* 🏅 Rewards Badge */}
        <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full cursor-pointer">
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="font-semibold text-yellow-700">{points}</span>
        </div>

        {/* 🛒 Cart Drawer */}
        <CartDrawer onCheckout={() => {}}>
          <div className="relative cursor-pointer">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
        </CartDrawer>
      </div>
    </header>
  );
}
