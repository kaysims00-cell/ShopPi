"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

type Order = {
  id: string;
  user: string;
  items: any[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered";
};

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage
  useEffect(() => {
    const data = localStorage.getItem("orders_db");
    if (data) setOrders(JSON.parse(data));
  }, []);

  // Save updated orders
  const saveOrders = (updated: Order[]) => {
    localStorage.setItem("orders_db", JSON.stringify(updated));
    setOrders(updated);
  };

  const updateStatus = (orderId: string, newStatus: Order["status"]) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );

    saveOrders(updated);
  };

  // Restrict non-admins
  if (!user || user.role !== "admin") {
    return (
      <div className="p-6 text-red-600">
        You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Admin: Order Manager</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="border p-4 mb-4 rounded shadow-sm bg-white"
          >
            <p className="font-bold">Order ID: {order.id}</p>
            <p>User: {order.user}</p>
            <p>Total: ₦{order.total}</p>
            <p className="mb-2">Status: {order.status}</p>

            {/* Status change buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(order.id, "Pending")}
                className="px-3 py-1 bg-gray-500 text-white rounded"
              >
                Pending
              </button>

              <button
                onClick={() => updateStatus(order.id, "Shipped")}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Shipped
              </button>

              <button
                onClick={() => updateStatus(order.id, "Delivered")}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Delivered
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
