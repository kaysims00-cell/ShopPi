"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

type Order = {
  id: string;
  customerName: string;
  total: number;
  status: "Pending" | "Shipped" | "Delivered";
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // 🔕 CLEAR ADMIN BADGE COUNTER WHEN VIEWING ORDERS
    localStorage.removeItem("admin_new_orders_count");

    const stored = JSON.parse(localStorage.getItem("orders_db") || "[]");
    setOrders(stored);
  }, []);

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
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3">₦{order.total}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-600 underline"
                    >
                      View
                    </Link>
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