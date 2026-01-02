"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

type Order = {
  id: string;
  total: number;
  status: "Pending" | "Shipped" | "Delivered";
};

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  // 🔐 AUTH GUARD (SAFE)
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const stored = JSON.parse(localStorage.getItem("orders_db") || "[]");
    const userOrders = stored.filter(
      (o: any) => o.customerEmail === user.email
    );

    setOrders(userOrders);
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.length === 0 && (
        <p className="text-gray-600">You have no orders yet.</p>
      )}

      {orders.map(order => (
        <Card key={order.id}>
          <CardContent className="p-4 space-y-2">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Total:</strong> ₦{order.total}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="font-semibold">{order.status}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}