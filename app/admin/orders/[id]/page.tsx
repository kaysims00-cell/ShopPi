"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered";
};

export default function AdminOrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orders: Order[] = JSON.parse(
      localStorage.getItem("orders_db") || "[]"
    );
    const found = orders.find(o => o.id === id);
    setOrder(found || null);
  }, [id]);

  const updateStatus = (status: Order["status"]) => {
    const orders: Order[] = JSON.parse(
      localStorage.getItem("orders_db") || "[]"
    );

    const updated = orders.map(o =>
      o.id === id ? { ...o, status } : o
    );

    localStorage.setItem("orders_db", JSON.stringify(updated));
    setOrder(prev => (prev ? { ...prev, status } : prev));
  };

  if (!order) {
    return <div className="p-6">Order not found.</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Order #{order.id}</h1>

      <Card>
        <CardContent className="p-4 space-y-2">
          <p><strong>Name:</strong> {order.customerName}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold">Items</h2>

          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₦{item.price * item.quantity}</span>
            </div>
          ))}

          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span>₦{order.total}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={() => updateStatus("Pending")} variant="outline">
          Pending
        </Button>
        <Button onClick={() => updateStatus("Shipped")} variant="outline">
          Shipped
        </Button>
        <Button onClick={() => updateStatus("Delivered")}>
          Delivered
        </Button>
      </div>

      <Button variant="ghost" onClick={() => router.back()}>
        ← Back to Orders
      </Button>
    </div>
  );
}