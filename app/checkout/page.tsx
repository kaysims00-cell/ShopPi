"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "@/types/cart";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { isPiBrowser, piPayment } from "@/lib/pi";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [processing, setProcessing] = useState(false);
  const [piAvailable, setPiAvailable] = useState(false);

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

  // 🟣 Detect Pi Browser
  useEffect(() => {
    setPiAvailable(isPiBrowser());
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ===============================
     ✅ CENTRAL ORDER SAVE
     =============================== */
  function saveOrder(order: any) {
    const existing = JSON.parse(localStorage.getItem("orders_db") || "[]");
    localStorage.setItem("orders_db", JSON.stringify([order, ...existing]));

    // 🔴 ADMIN BADGE
    const count = Number(
      localStorage.getItem("admin_new_orders_count") || 0
    );
    localStorage.setItem(
      "admin_new_orders_count",
      String(count + 1)
    );

    // 🔔 ADMIN TOAST
    localStorage.setItem(
      "admin_toast_message",
      "🛒 New order paid successfully"
    );

    // 🔔 REAL-TIME EVENT
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "admin_toast_message",
      })
    );

    // 👤 USER FEEDBACK
    localStorage.setItem(
      "user_notification",
      "✅ Payment successful! Your order has been placed."
    );

    // 🧹 CLEAR CART
    localStorage.removeItem("cart");

    router.replace("/profile");
  }

  // 🌐 WEB MOCK PAYMENT
  function handleWebPayment() {
    if (!user) return;

    if (!fullName || !phone || !address) {
      alert("Please fill delivery details");
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      const orderId = Date.now().toString();

      const order = {
        id: orderId,
        customerEmail: user.email,
        customerName: fullName,
        phone,
        address,
        items: cart,
        total,
        status: "Pending",
        paymentStatus: "Paid",
        paymentMethod: "web",
        paymentRef: "WEB-" + Math.random().toString(36).slice(2, 10),
        createdAt: new Date().toISOString(),
      };

      saveOrder(order);
      setProcessing(false);
    }, 1200);
  }

  // 🟣 PI PAYMENT (SERVER VERIFIED + WEBHOOK READY)
  async function handlePiPayment() {
    if (!user) return;

    if (!fullName || !phone || !address) {
      alert("Please fill delivery details");
      return;
    }

    try {
      setProcessing(true);

      // ✅ CREATE ORDER ID ONCE
      const orderId = Date.now().toString();

      // 1️⃣ PI PAYMENT
      const payment = await piPayment({
        amount: total,
        memo: "Order payment",
        metadata: {
          email: user.email,
          orderId, // 🔑 USED BY WEBHOOK
        },
      });

      // 2️⃣ SERVER VERIFY
      const verify = await fetch("/api/pi/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: payment.identifier,
        }),
      });

      const result = await verify.json();

      if (!verify.ok || !result.success) {
        throw new Error("Verification failed");
      }

      // 3️⃣ SAVE ORDER (ID MATCHES METADATA)
      const order = {
        id: orderId,
        customerEmail: user.email,
        customerName: fullName,
        phone,
        address,
        items: cart,
        total,
        status: "Pending",
        paymentStatus: "Paid",
        paymentMethod: "pi",
        paymentRef: payment.identifier,
        createdAt: new Date().toISOString(),
      };

      saveOrder(order);
    } catch (err) {
      alert("Pi payment failed or cancelled");
      setProcessing(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* ORDER SUMMARY */}
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

      {/* DELIVERY */}
      <div className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>

      {/* PAY BUTTONS */}
      <div className="space-y-3">
        {piAvailable && (
          <button
            onClick={handlePiPayment}
            disabled={processing}
            className="w-full bg-purple-700 text-white py-3 rounded"
          >
            Pay with Pi
          </button>
        )}

        <button
          onClick={handleWebPayment}
          disabled={processing}
          className="w-full bg-black text-white py-3 rounded"
        >
          Pay with Web (Mock)
        </button>
      </div>
    </div>
  );
}