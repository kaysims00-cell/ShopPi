"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 🔐 Require login
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // 🛒 Load cart
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handlePlaceOrder() {
    if (!user) return;

    if (!fullName || !phone || !address) {
      alert("Please fill all delivery details");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      customerEmail: user.email,
      customerName: fullName,
      phone,
      address,
      items: cart,
      total,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(
      localStorage.getItem("orders_db") || "[]"
    );

    localStorage.setItem(
      "orders_db",
      JSON.stringify([newOrder, ...existingOrders])
    );

    // 🔔 ADMIN BADGE COUNTER (INCREMENT)
    const currentCount = Number(
      localStorage.getItem("admin_new_orders_count") || 0
    );
    localStorage.setItem(
      "admin_new_orders_count",
      String(currentCount + 1)
    );

    // ✅ USER SUCCESS MESSAGE
    localStorage.setItem(
      "user_notification",
      "✅ Your order has been placed successfully!"
    );

    // 🧹 CLEAR CART
    localStorage.removeItem("cart");

    // ➡️ REDIRECT TO PROFILE
    setTimeout(() => {
      router.replace("/profile");
    }, 50);
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Order Summary */}
      <div className="border rounded p-4 space-y-2">
        <h2 className="font-semibold">Order Summary</h2>

        {cart.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₦{item.price * item.quantity}</span>
          </div>
        ))}

        <hr />
        <p className="font-bold">Total: ₦{total}</p>
      </div>

      {/* Delivery Form */}
      <div className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Delivery Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-black text-white py-3 rounded"
      >
        Place Order
      </button>
    </div>
  );
}