"use client";

import React, { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useRewards } from "@/app/context/RewardsContext";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";

type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

type Order = {
  id: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
};

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addPoints } = useRewards();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Save order in localStorage (orders_db)
  const saveOrderLocal = (
    items: CartItem[],
    totalAmount: number,
    status = "Pending"
  ): Order => {
    const ordersJson = localStorage.getItem("orders_db");
    const orders: Order[] = ordersJson ? JSON.parse(ordersJson) : [];

    const newOrder: Order = {
      id: Date.now().toString(),
      userEmail: user?.email || "unknown",
      items,
      total: totalAmount,
      status,
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    localStorage.setItem("orders_db", JSON.stringify(orders));

    return newOrder;
  };

  // Optional server sync (safe if API does not exist)
  const postOrderToServer = async (order: Order) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) {
        console.warn("Server /api/orders responded", res.status);
        return null;
      }

      return await res.json();
    } catch (err) {
      console.warn("Posting order failed:", err);
      return null;
    }
  };

  // Place order (Pay on Delivery)
  const handlePlaceOrder = async () => {
    if (!user) {
      setMessage("Please login to place an order.");
      return;
    }

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1) Save locally with user email
      const createdLocal = saveOrderLocal(cart, total, "Pending");

      // 2) Optional API sync
      await postOrderToServer(createdLocal);

      // 3) Rewards
      const earnedPoints = cart.reduce(
        (sum, item) => sum + item.quantity * 5,
        0
      );
      addPoints(earnedPoints, "Order placed");

      // 4) Clear cart
      clearCart();

      // 5) Success message
      setMessage(
        `Order placed successfully! Order ID: ${createdLocal.id}. You earned ${earnedPoints} points.`
      );
    } catch (err) {
      console.error(err);
      setMessage("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 border-b pb-4"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}

                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ₦{item.price}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </Button>

                    <span className="px-4 font-semibold">
                      {item.quantity}
                    </span>

                    <Button
                      size="sm"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t pt-6">
            <p className="text-xl font-semibold">Total: ₦{total}</p>

            <div className="flex gap-3 mt-4">
              <Button
                className="flex-1"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? "Placing order..." : "Place Order (Pay on Delivery)"}
              </Button>
            </div>
          </div>
        </>
      )}

      {message && (
        <div className="mt-6 p-3 rounded bg-green-100 text-green-800">
          {message}
        </div>
      )}
    </div>
  );
}
