"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // 🔁 FORCE RE-RENDER ON PAGE LOAD (NO REFRESH)
  const [, setTick] = useState(0);
  useEffect(() => {
    setTick(t => t + 1);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Your Cart</h1>
        <p className="mb-4">Your cart is empty.</p>
        <Link href="/products" className="text-blue-600 underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>

      {cart.map(item => (
        <div
          key={item.id}
          className="flex justify-between items-center border p-4 rounded"
        >
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-600">₦{item.price}</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={e =>
                updateQuantity(item.id, Number(e.target.value))
              }
              className="w-16 border p-1 rounded"
            />

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>₦{total}</span>
      </div>

      <div className="flex justify-end">
        <Link
          href="/checkout"
          className="bg-black text-white px-6 py-2 rounded"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}