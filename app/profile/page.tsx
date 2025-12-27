"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="p-6">Loading profile...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <div className="space-y-2 text-sm">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          <span className="capitalize">{user.role}</span>
        </p>
      </div>

      {user.role === "admin" && (
        <div className="mt-4 p-3 bg-yellow-100 border rounded">
          <p className="font-semibold">Admin Access</p>
          <p className="text-sm text-gray-700">
            You have administrative privileges.
          </p>
        </div>
      )}

      <button
        onClick={() => {
          logout();
          router.push("/login");
        }}
        className="mt-6 w-full bg-red-600 text-white py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}