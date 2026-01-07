"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [notification, setNotification] = useState<string | null>(null);

  // ✅ Handle auth redirect SAFELY
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // ✅ Load success notification ONCE
  useEffect(() => {
    const note = localStorage.getItem("user_notification");
    if (note) {
      setNotification(note);
      localStorage.removeItem("user_notification"); // auto-clear
    }
  }, []);

  if (loading || !user) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* ✅ SUCCESS MESSAGE */}
      {notification && (
        <div className="bg-green-100 text-green-800 p-3 rounded">
          {notification}
        </div>
      )}

      <div className="space-y-1">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          {user.role === "admin" ? (
            <span className="text-red-600 font-semibold">ADMIN</span>
          ) : (
            "User"
          )}
        </p>
      </div>

      {user.role === "admin" && (
        <button
          onClick={() => router.push("/admin")}
          className="w-full bg-red-600 text-white py-2 rounded"
        >
          Go to Admin Dashboard
        </button>
      )}

      <button
        onClick={logout} // ✅ logout ONLY
        className="w-full bg-gray-800 text-white py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}