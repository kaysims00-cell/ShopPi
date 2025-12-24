"use client";

import { useCart } from "@/app/context/CartContext";
import { useOrders } from "@/app/context/OrdersContext";
import { useRewards } from "@/app/context/RewardsContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { createOrder } = useOrders();
  const { addPoints } = useRewards();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (!name || !phone || !address) {
      alert("Please fill all fields");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    // Create order
    const orderId = createOrder({
      name,
      phone,
      address,
      items: cart,
      total,
    });

    // Give reward points
    const rewardPoints = Math.floor(total * 0.05); // 5% back
    addPoints(rewardPoints, "Order Checkout Reward");

    alert(`Order placed! ID: ${orderId}\nYou earned ${rewardPoints} points.`);

    // Clear the cart
    localStorage.removeItem("cart");
    location.href = `/orders/${orderId}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="mt-6 grid gap-4">

        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="border p-2 rounded w-full"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          placeholder="Delivery Address"
          className="border p-2 rounded w-full"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <h2 className="text-xl font-semibold mt-4">Order Summary</h2>

        {cart.map((item) => (
          <div key={item.id} className="border p-3 rounded flex justify-between">
            <div>
              <p className="font-bold">{item.name}</p>
              <p>Qty: {item.quantity}</p>
            </div>
            <p>${item.price * item.quantity}</p>
          </div>
        ))}

        <h2 className="text-xl font-semibold mt-4">Total: ${total}</h2>

        <Button className="mt-4 w-full" onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </div>
    </div>
  );
}
