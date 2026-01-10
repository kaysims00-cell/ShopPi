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
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canRetry, setCanRetry] = useState(false);

  // 🔐 Require login
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // 🛒 Load cart
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ PAYMENT SUCCESS
  function paymentSuccess() {
    if (!user) return;

    const order = {
      id: Date.now().toString(),
      customerEmail: user.email,
      customerName: fullName,
      phone,
      address,
      items: cart,
      total,
      status: "Pending",
      paymentStatus: "Paid",
      paymentRef: "MOCK-" + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(
      localStorage.getItem("orders_db") || "[]"
    );

    localStorage.setItem(
      "orders_db",
      JSON.stringify([order, ...existing])
    );

    // 🔴 ADMIN BADGE COUNTER
    const count = Number(
      localStorage.getItem("admin_new_orders_count") || 0
    );

    localStorage.setItem(
      "admin_new_orders_count",
      String(count + 1)
    );

    // ✅ USER MESSAGE
    localStorage.setItem(
      "user_notification",
      "✅ Payment successful! Your order has been placed."
    );

    localStorage.removeItem("cart");

    setTimeout(() => {
      router.replace("/profile");
    }, 100);
  }

  // ❌ PAYMENT FAILURE
  function paymentFailure() {
    setProcessing(false);
    setError("❌ Payment failed. Please try again.");
    setCanRetry(true);
  }

  function startPayment() {
    setError(null);
    setCanRetry(false);
    setProcessing(true);

    // 🎯 Simulated gateway result
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success

      if (success) {
        paymentSuccess();
      } else {
        paymentFailure();
      }
    }, 2000);
  }

  function handlePayNow() {
    if (!fullName || !phone || !address) {
      alert("Please fill all delivery details");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    startPayment();
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

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

      {/* ACTION BUTTONS */}
      {!canRetry && (
        <button
          onClick={handlePayNow}
          disabled={processing}
          className="w-full bg-black text-white py-3 rounded disabled:opacity-60"
        >
          {processing ? "Processing Payment..." : "Pay Now (Mock)"}
        </button>
      )}

      {canRetry && (
        <button
          onClick={startPayment}
          className="w-full bg-orange-600 text-white py-3 rounded"
        >
          🔁 Retry Payment
        </button>
      )}
    </div>
  );
}