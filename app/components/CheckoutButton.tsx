"use client";

import { useCart } from "@/app/context/CartContext";
import { useRewards } from "@/app/context/RewardsContext";

export default function CheckoutButton() {
  const { cart, clearCart } = useCart();
  const { addPoints } = useRewards();

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = {
      items: cart,
      total,
      customer: {
        name: "Guest User",
        contact: "Not provided"
      }
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(order)
    });

    if (res.ok) {
      addPoints(10); // reward bonus
      clearCart();
      alert("Order placed successfully!");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/80"
    >
      Checkout
    </button>
  );
}
