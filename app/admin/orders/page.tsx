"use client";

import { useOrders } from "@/app/context/OrdersContext";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrders();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Order Control</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded p-4 bg-white shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    Order #{order.id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.userEmail}
                  </p>
                  <p className="text-sm">
                    Total: ₦{order.total}
                  </p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(
                      order.id,
                      e.target.value as any
                    )
                  }
                  className="border rounded px-3 py-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
