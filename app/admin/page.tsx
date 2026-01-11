"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/app/context/AuthContext";

type Order = {
  id: string;
  total: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [newCount, setNewCount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

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

  // 📦 LOAD DATA + REAL-TIME LISTENER
  useEffect(() => {
    loadOrders();
    loadBadge();

    const handler = (e: StorageEvent) => {
      // Orders or badge changed
      if (
        e.key === "orders_db" ||
        e.key === "admin_new_orders_count"
      ) {
        loadOrders();
        loadBadge();
      }

      // 🔔 Toast message
      if (e.key === "admin_toast_message" && e.newValue) {
        setToast(e.newValue);

        setTimeout(() => {
          setToast(null);
          localStorage.removeItem("admin_toast_message");
        }, 4000);
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  function loadOrders() {
    const stored = JSON.parse(
      localStorage.getItem("orders_db") || "[]"
    );
    setOrders(stored);
  }

  function loadBadge() {
    setNewCount(
      Number(localStorage.getItem("admin_new_orders_count") || 0)
    );
  }

  if (loading || !user || user.role !== "admin") return null;

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.total,
    0
  );

  return (
    <div className="p-6 space-y-6 relative">
      {/* 🔔 TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-black text-white px-5 py-3 rounded shadow-lg z-50">
          {toast}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <Link
          href="/admin/orders"
          className="relative text-blue-600 underline"
        >
          Manage Orders →
          {newCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              NEW {newCount}
            </span>
          )}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Total Orders
            </p>
            <p className="text-3xl font-bold">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Total Revenue
            </p>
            <p className="text-3xl font-bold">
              ₦{totalRevenue}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}