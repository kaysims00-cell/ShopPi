"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function AuthHeader() {
  const { user, logout } = useAuth();

  if (!user)
    return <Link href="/login">Login</Link>;

  return (
    <button onClick={logout} style={{ color: "red" }}>
      Logout
    </button>
  );
}
