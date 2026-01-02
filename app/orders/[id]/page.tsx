"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered";
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const orders: Order[] = JSON.parse(
      localStorage.getItem("orders_db") || "[]"
    );

    const found = orders.find(
      (o) => o.id === id && o.userEmail === user.email
    );

    if (!found) {
      router.replace("/orders");
      return;
    }

    setOrder(found);
  }, [id, user, loading, router]);

  if (!order) {
    return <div className="p-6">Loading order...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded space-y-6">
      <h1 className="text-2xl font-bold">Order Details</h1>

      <div className="space-y-1">
        <p>
          <strong>Order ID:</strong> {order.id}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="font-semibold">{order.status}</span>
        </p>
        <p>
          <strong>Total:</strong> ₦{order.total}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Items</h2>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border p-3 rounded"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  ₦{item.price} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold">
                ₦{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => router.push("/orders")}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Back to Orders
      </button>
    </div>
  );
}