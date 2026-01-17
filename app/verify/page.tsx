"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async () => {
    setError("");
    setSuccess("");

    // Temporary client-side verification placeholder
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    // Simulate successful verification
    setSuccess("Email verified successfully!");
    setTimeout(() => {
      router.push("/profile");
    }, 1000);
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