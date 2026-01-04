"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  customerEmail: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered";
  createdAt: string;
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

    const orders = JSON.parse(localStorage.getItem("orders_db") || "[]");
    const found = orders.find((o: Order) => o.id === id);

    if (!found || found.customerEmail !== user.email) {
      router.replace("/orders");
      return;
    }

    setOrder(found);
  }, [id, user, loading, router]);

  if (!order) {
    return <div className="p-6">Loading order...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Order Details</h1>

      {/* STATUS TIMELINE */}
      <StatusTimeline status={order.status} />

      {/* ORDER INFO */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₦{order.total}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </CardContent>
      </Card>

      {/* DELIVERY INFO */}
      <Card>
        <CardContent className="p-4 space-y-1">
          <h2 className="font-semibold">Delivery Details</h2>
          <p>{order.customerName}</p>
          <p>{order.phone}</p>
          <p>{order.address}</p>
        </CardContent>
      </Card>

      {/* ITEMS */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold">Items</h2>

          {order.items.map(item => (
            <div
              key={item.id}
              className="flex justify-between text-sm border-b pb-2"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₦{item.price * item.quantity}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* 🔵 STATUS TIMELINE COMPONENT */
function StatusTimeline({ status }: { status: Order["status"] }) {
  const steps: Order["status"][] = ["Pending", "Shipped", "Delivered"];

  return (
    <div className="flex justify-between items-center">
      {steps.map((step, index) => {
        const active =
          steps.indexOf(status) >= index;

        return (
          <div key={step} className="flex-1 text-center">
            <div
              className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-white ${
                active ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <p className={`mt-1 text-sm ${active ? "font-semibold" : ""}`}>
              {step}
            </p>
          </div>
        );
      })}
    </div>
  );
}