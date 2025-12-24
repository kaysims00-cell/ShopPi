"use client";

import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p>Please login first.</p>
        <Link href="/login" className="text-blue-600 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>

      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-black text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}