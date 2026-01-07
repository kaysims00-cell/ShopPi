"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered";
  createdAt: string;
};

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);

  // 🔐 ADMIN GUARD
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/profile");
      return;
    }

    const stored = JSON.parse(localStorage.getItem("orders_db") || "[]");
    setOrders(stored);
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") return null;

  // ======================
  // METRICS
  // ======================
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // ======================
  // CHART DATA
  // ======================

  // 1️⃣ Orders by Status
  const statusData = [
    {
      name: "Pending",
      value: orders.filter(o => o.status === "Pending").length,
    },
    {
      name: "Shipped",
      value: orders.filter(o => o.status === "Shipped").length,
    },
    {
      name: "Delivered",
      value: orders.filter(o => o.status === "Delivered").length,
    },
  ];

  // 2️⃣ Revenue Over Time (by date)
  const revenueMap: Record<string, number> = {};

  orders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleDateString();
    revenueMap[date] = (revenueMap[date] || 0) + order.total;
  });

  const revenueData = Object.entries(revenueMap).map(([date, total]) => ({
    date,
    total,
  }));

  // 3️⃣ Top Products
  const productMap: Record<string, number> = {};

  orders.forEach(order => {
    order.items.forEach(item => {
      productMap[item.name] =
        (productMap[item.name] || 0) + item.quantity;
    });
  });

  const productData = Object.entries(productMap).map(([name, qty]) => ({
    name,
    qty,
  }));

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Analytics</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Orders by Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Over Time */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Revenue Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-4">Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="qty" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}