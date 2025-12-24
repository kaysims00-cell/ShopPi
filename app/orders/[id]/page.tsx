"use client";

import { useOrders } from "@/app/context/OrdersContext";

export default function OrderDetailPage({ params }: any) {
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === params.id);

  if (!order)
    return <p className="p-6 text-red-500">Order not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Order Details</h1>

      <p className="mt-3">Order ID: {order.id}</p>
      <p>Status: {order.status}</p>
      <p>Date: {new Date(order.date).toLocaleString()}</p>

      <h2 className="text-xl font-semibold mt-6">Items</h2>
      {order.items.map((item) => (
        <div key={item.id} className="border p-3 rounded mt-2">
          <p className="font-bold">{item.name}</p>
          <p>Qty: {item.quantity}</p>
          <p>${item.price * item.quantity}</p>
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-6">
        Total: ${order.total}
      </h2>

      <h2 className="text-xl font-semibold mt-6">Delivery Info</h2>
      <p>{order.name}</p>
      <p>{order.phone}</p>
      <p>{order.address}</p>
    </div>
  );
}
