"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type Order = {
  id: string;
  customerName: string;
  total: number;
  status: string;
  paymentStatus?: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  // 🔁 CLEAR BADGE + LOAD ORDERS
  useEffect(() => {
    // ✅ RESET BADGE COUNT PROPERLY
    localStorage.setItem("admin_new_orders_count", "0");

    // 🔔 FORCE STORAGE EVENT (IMPORTANT)
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "admin_new_orders_count",
        newValue: "0",
      })
    );

    loadOrders();
  }, []);

  function loadOrders() {
    const stored = JSON.parse(
      localStorage.getItem("orders_db") || "[]"
    );
    setOrders(stored);
  }

  function refundOrder(id: string) {
    const updated = orders.map(o =>
      o.id === id
        ? {
            ...o,
            status: "Refunded",
            paymentStatus: "Refunded",
          }
        : o
    );

    localStorage.setItem("orders_db", JSON.stringify(updated));

    // 🔔 Notify dashboard
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "orders_db",
      })
    );

    loadOrders();
    alert("Refund processed successfully");
  }

  if (orders.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="mt-4 text-gray-600">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">All Orders</h1>

      <Card>
        <CardContent className="p-0">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3">₦{order.total}</td>
                  <td className="p-3">{order.paymentStatus}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3">
                    {order.paymentStatus === "Paid" && (
                      <button
                        onClick={() => refundOrder(order.id)}
                        className="text-red-600 underline"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}