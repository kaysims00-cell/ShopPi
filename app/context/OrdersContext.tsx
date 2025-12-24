"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Order = {
  id: string;
  userEmail: string;
  items: any[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered";
  createdAt: string;
};

type OrdersContextType = {
  orders: Order[];
  updateOrderStatus: (id: string, status: Order["status"]) => void;
};

const OrdersContext = createContext<OrdersContextType | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders_db") || "[]");
    setOrders(stored);
  }, []);

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    setOrders(updated);
    localStorage.setItem("orders_db", JSON.stringify(updated));
  };

  return (
    <OrdersContext.Provider value={{ orders, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error("useOrders must be used within OrdersProvider");
  }
  return ctx;
};