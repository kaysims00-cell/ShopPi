"use client";

import { useEffect, useMemo, useState } from "react";
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

type Order = {
  id: string;
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

  // ==========================
  // DATE HELPERS
  // ==========================
  const today = new Date();

  const last30Start = new Date();
  last30Start.setDate(today.getDate() - 30);

  const prev30Start = new Date();
  prev30Start.setDate(today.getDate() - 60);

  const prev30End = new Date();
  prev30End.setDate(today.getDate() - 30);

  // ==========================
  // FILTER PERIODS
  // ==========================
  const last30Orders = useMemo(
    () =>
      orders.filter(
        o => new Date(o.createdAt) >= last30Start
      ),
    [orders]
  );

  const prev30Orders = useMemo(
    () =>
      orders.filter(o => {
        const d = new Date(o.createdAt);
        return d >= prev30Start && d < prev30End;
      }),
    [orders]
  );

  // ==========================
  // METRICS
  // ==========================
  const last30Revenue = last30Orders.reduce((s, o) => s + o.total, 0);
  const prev30Revenue = prev30Orders.reduce((s, o) => s + o.total, 0);

  const last30Count = last30Orders.length;
  const prev30Count = prev30Orders.length;

  // ==========================
  // GROWTH CALCULATIONS
  // ==========================
  const calcGrowth = (current: number, prev: number) => {
    if (prev === 0) return 100;
    return ((current - prev) / prev) * 100;
  };

  const revenueGrowth = calcGrowth(last30Revenue, prev30Revenue);
  const orderGrowth = calcGrowth(last30Count, prev30Count);

  // ==========================
  // CHART DATA
  // ==========================
  const comparisonChart = [
    {
      name: "Previous 30 Days",
      revenue: prev30Revenue,
      orders: prev30Count,
    },
    {
      name: "Last 30 Days",
      revenue: last30Revenue,
      orders: last30Count,
    },
  ];

  const growthColor = (value: number) =>
    value >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Analytics</h1>

      {/* SUMMARY COMPARISON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">
              Revenue Comparison (30 days)
            </p>
            <p className="text-xl font-bold">
              ₦{last30Revenue} vs ₦{prev30Revenue}
            </p>
            <p className={`font-semibold ${growthColor(revenueGrowth)}`}>
              {revenueGrowth >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(revenueGrowth).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">
              Orders Comparison (30 days)
            </p>
            <p className="text-xl font-bold">
              {last30Count} vs {prev30Count}
            </p>
            <p className={`font-semibold ${growthColor(orderGrowth)}`}>
              {orderGrowth >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(orderGrowth).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* BAR CHART */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-4">
            Last 30 vs Previous 30 Days
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" />
              <Bar dataKey="orders" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}