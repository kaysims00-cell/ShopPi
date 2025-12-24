"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const { verifyEmail } = useAuth();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async () => {
    try {
      await verifyEmail(code);
      setSuccess("Email verified successfully!");
      router.push("/profile");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Verify Your Email</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <input
        type="text"
        placeholder="Enter 6-digit code"
        className="border p-2 w-full mb-2"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={handleVerify}
        className="bg-purple-600 text-white px-4 py-2 rounded w-full"
      >
        Verify Email
      </button>
    </div>
  );
}
