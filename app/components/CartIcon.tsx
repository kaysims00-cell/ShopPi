"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function CartIcon() {
  const { cart } = useCart();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6 text-gray-700" />
      {totalQuantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
}
