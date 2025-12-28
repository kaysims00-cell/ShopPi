"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Not logged in → go to login
    if (!user) {
      router.replace("/login");
      return;
    }

    // Logged in but NOT admin → go to profile (NOT "/")
    if (user.role !== "admin") {
      router.replace("/profile");
      return;
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}