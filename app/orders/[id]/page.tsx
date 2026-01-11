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
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
  paymentStatus?: "Paid" | "Pending" | "Refunded" | "Failed";
  paymentRef?: string;
  paymentMethod?: "pi" | "web";
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

  function cancelOrder() {
    if (!order) return;

    const orders = JSON.parse(localStorage.getItem("orders_db") || "[]");

    const updated = orders.map((o: Order) =>
      o.id === order.id
        ? {
            ...o,
            status:
              o.paymentStatus === "Paid" ? "Refunded" : "Cancelled",
            paymentStatus:
              o.paymentStatus === "Paid" ? "Refunded" : o.paymentStatus,
          }
        : o
    );

    localStorage.setItem("orders_db", JSON.stringify(updated));
    alert("Order cancelled successfully");
    router.replace("/orders");
  }

  function retryPiPayment() {
    alert(
      "Retry Pi Payment:\n\nYou will be redirected to checkout to complete payment."
    );
    router.push("/checkout");
  }

  if (!order) return <div className="p-6">Loading order...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Order Receipt</h1>

      <StatusTimeline status={order.status} />

      {/* ORDER INFO */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> {order.status}</p>

          <p>
            <strong>Payment Status:</strong>{" "}
            {order.paymentStatus || "Pending"}
          </p>

          {order.paymentMethod && (
            <p>
              <strong>Payment Method:</strong>{" "}
              {order.paymentMethod === "pi" ? "Pi Network" : "Web"}
            </p>
          )}

          {order.paymentRef && (
            <p><strong>Payment Ref:</strong> {order.paymentRef}</p>
          )}

          {/* 🟣 PI RECEIPT */}
          {order.paymentMethod === "pi" && order.paymentStatus === "Paid" && (
            <div className="mt-3 p-3 rounded bg-purple-50 border border-purple-200 text-sm">
              <p className="font-semibold text-purple-700">
                🟣 Pi Network Payment Confirmed
              </p>
              <p>This order was successfully paid using Pi Network.</p>
            </div>
          )}

          {/* 🔁 RETRY FAILED PI */}
          {order.paymentMethod === "pi" &&
            order.paymentStatus === "Failed" && (
              <div className="mt-3 p-3 rounded bg-red-50 border border-red-200 text-sm">
                <p className="font-semibold text-red-600">
                  Pi Payment Failed
                </p>
                <button
                  onClick={retryPiPayment}
                  className="mt-2 bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Retry Pi Payment
                </button>
              </div>
            )}
        </CardContent>
      </Card>

      {/* DELIVERY */}
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
              <span>{item.name} × {item.quantity}</span>
              <span>₦{item.price * item.quantity}</span>
            </div>
          ))}

          <hr />
          <p className="font-bold">Total: ₦{order.total}</p>
        </CardContent>
      </Card>

      {/* ACTIONS */}
      <div className="flex gap-4">
        {/* ✅ SERVER PDF DOWNLOAD */}
        <a
          href={`/api/invoice/${order.id}`}
          className="bg-black text-white px-4 py-2 rounded inline-block"
        >
          Download PDF Invoice
        </a>

        {order.status === "Pending" && (
          <button
            onClick={cancelOrder}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}

/* STATUS TIMELINE */
function StatusTimeline({ status }: { status: Order["status"] }) {
  const steps: Order["status"][] = [
    "Pending",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Refunded",
  ];

  return (
    <div className="flex justify-between items-center">
      {steps.map((step, index) => {
        const active = steps.indexOf(status) >= index;

        return (
          <div key={step} className="flex-1 text-center">
            <div
              className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-white ${
                active ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <p className={`mt-1 text-xs ${active ? "font-semibold" : ""}`}>
              {step}
            </p>
          </div>
        );
      })}
    </div>
  );
}