"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type Order = {
  id: string;
  total: number;
  status: "Pending" | "Shipped" | "Delivered";
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders_db") || "[]");
    setOrders(stored);
  }, []);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const pending = orders.filter(o => o.status === "Pending").length;
  const shipped = orders.filter(o => o.status === "Shipped").length;
  const delivered = orders.filter(o => o.status === "Delivered").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link
          href="/admin/orders"
          className="text-blue-600 underline"
        >
          Manage Orders →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-3xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold">₦{totalRevenue}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending Orders</p>
            <p className="text-3xl font-bold">{pending}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Shipped Orders</p>
            <p className="text-3xl font-bold">{shipped}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Delivered Orders</p>
            <p className="text-3xl font-bold">{delivered}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
