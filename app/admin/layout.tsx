"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return <>{children}</>;
}