"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const cart: CartItem[] = JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = () => {
    if (!name || !phone || !address) {
      alert("Please fill all fields");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const orders = JSON.parse(
      localStorage.getItem("orders_db") || "[]"
    );

    const newOrder = {
      id: Date.now().toString(),
      customerName: name,
      phone,
      address,
      items: cart,
      total,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    localStorage.setItem("orders_db", JSON.stringify(orders));
    localStorage.removeItem("cart");

    router.push("/orders");
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {cart.map(item => (
        <div key={item.id} className="border p-3 rounded">
          <p className="font-semibold">{item.name}</p>
          <p>
            ₦{item.price} × {item.quantity}
          </p>
        </div>
      ))}

      <p className="font-bold text-lg">Total: ₦{total}</p>

      <input
        className="w-full border p-2"
        placeholder="Full Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Phone Number"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />

      <textarea
        className="w-full border p-2"
        placeholder="Delivery Address"
        value={address}
        onChange={e => setAddress(e.target.value)}
      />

      <button
        onClick={placeOrder}
        className="w-full bg-black text-white py-2 rounded"
      >
        Place Order
      </button>
    </div>
  );
}