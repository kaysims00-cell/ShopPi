"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/app/context/AuthContext";

type Order = {
  id: string;
  total: number;
  status: "Pending" | "Shipped" | "Delivered";
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [hasNewOrders, setHasNewOrders] = useState(false);

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

  // 📦 LOAD ORDERS + CHECK BADGE
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders_db") || "[]");
    setOrders(storedOrders);

    const adminNote = localStorage.getItem("admin_notification");
    setHasNewOrders(!!adminNote);
  }, []);

  if (loading || !user || user.role !== "admin") return null;

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {/* 🔴 BADGE FIXED */}
        <div className="relative inline-block">
          <Link href="/admin/orders" className="text-blue-600 underline">
            Manage Orders →
          </Link>

          {hasNewOrders && (
            <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
        </div>
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
      </div>
    </div>
  );
}