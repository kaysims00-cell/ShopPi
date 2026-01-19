"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

export default function CartPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // -------------------------------
  // SAVE ORDER TO LOCAL STORAGE
  // -------------------------------
  const saveOrder = () => {
    const orders = JSON.parse(localStorage.getItem("orders_db") || "[]");

    const newOrder = {
      id: Date.now().toString(),
      userId: user?.id || "guest",
      items: cart,
      total,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    localStorage.setItem("orders_db", JSON.stringify(orders));
  };

  // -------------------------------
  // NORMAL CHECKOUT (no Pi for now)
  // -------------------------------
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    saveOrder();
    clearCart();
    alert("Order placed successfully! 🎉");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="border p-3 mb-2 rounded">
              <p>
                {item.name} — {item.quantity} × ₦{item.price}
              </p>
            </div>
          ))}

          <h2 className="mt-4 text-lg font-bold">Total: ₦{total}</h2>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}
