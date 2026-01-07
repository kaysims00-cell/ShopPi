"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";

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
  total: number;
  items: OrderItem[];
  createdAt: string;
};

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

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
  }, [user, loading, router]);

  // 🔄 REAL-TIME AUTO REFRESH (10s)
  useEffect(() => {
    const load = () => {
      const stored = JSON.parse(localStorage.getItem("orders_db") || "[]");
      setOrders(stored);
      setLastUpdated(new Date());
    };

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !user || user.role !== "admin") return null;

  // ==========================
  // DAILY TREND
  // ==========================
  const dailyTrend = useMemo(() => {
    const map: any = {};
    orders.forEach(o => {
      const d = new Date(o.createdAt).toLocaleDateString();
      if (!map[d]) map[d] = { date: d, revenue: 0, orders: 0 };
      map[d].revenue += o.total;
      map[d].orders += 1;
    });
    return Object.values(map);
  }, [orders]);

  // ==========================
  // TOP CUSTOMERS
  // ==========================
  const topCustomers = useMemo(() => {
    const map: any = {};
    orders.forEach(o => {
      if (!map[o.customerEmail]) {
        map[o.customerEmail] = {
          name: o.customerName,
          orders: 0,
          spent: 0,
        };
      }
      map[o.customerEmail].orders += 1;
      map[o.customerEmail].spent += o.total;
    });
    return Object.values(map).sort((a: any, b: any) => b.spent - a.spent).slice(0, 5);
  }, [orders]);

  // ==========================
  // BEST PRODUCTS
  // ==========================
  const bestProducts = useMemo(() => {
    const map: any = {};
    orders.forEach(o =>
      o.items.forEach(i => {
        if (!map[i.id]) map[i.id] = { name: i.name, qty: 0, revenue: 0 };
        map[i.id].qty += i.quantity;
        map[i.id].revenue += i.quantity * i.price;
      })
    );
    return Object.values(map).sort((a: any, b: any) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  // ==========================
  // 📄 EXPORT PDF
  // ==========================
  function exportPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Admin Sales Analytics", 14, 20);

    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Orders: ${orders.length}`, 14, 38);
    doc.text(
      `Total Revenue: ₦${orders.reduce((s, o) => s + o.total, 0)}`,
      14,
      46
    );

    let y = 60;
    doc.setFontSize(14);
    doc.text("Top Customers", 14, y);
    y += 8;

    topCustomers.forEach((c: any) => {
      doc.setFontSize(11);
      doc.text(`${c.name} — ₦${c.spent} (${c.orders} orders)`, 14, y);
      y += 6;
    });

    y += 6;
    doc.setFontSize(14);
    doc.text("Best Selling Products", 14, y);
    y += 8;

    bestProducts.forEach((p: any) => {
      doc.setFontSize(11);
      doc.text(`${p.name} — ${p.qty} sold (₦${p.revenue})`, 14, y);
      y += 6;
    });

    doc.save("analytics-report.pdf");
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Analytics</h1>

        <button
          onClick={exportPDF}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Live data • Last updated: {lastUpdated.toLocaleTimeString()}
      </p>

      {/* DAILY TREND */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-4">Daily Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="revenue" />
              <Line dataKey="orders" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* TOP CUSTOMERS */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-4">Top Customers</h2>
          {topCustomers.map((c: any, i) => (
            <p key={i}>
              {c.name} — ₦{c.spent} ({c.orders} orders)
            </p>
          ))}
        </CardContent>
      </Card>

      {/* BEST PRODUCTS */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-4">Best Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestProducts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="qty" />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}