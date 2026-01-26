"use client"

import { useEffect, useState } from "react"

export default function Page() {
  const [status, setStatus] = useState("Initializing...")

  useEffect(() => {
    if (typeof window === "undefined") return

    // @ts-ignore
    if (!window.Pi) {
      setStatus("Pi SDK not detected")
      return
    }

    // ✅ AUTHENTICATE FIRST (THIS FIXES YOUR ERROR)
    // @ts-ignore
    window.Pi.authenticate(
      ["username", "payments"],
      (auth: any) => {
        console.log("Authenticated:", auth)
        setStatus("Authenticated ✅")
      },
      (error: any) => {
        console.error("Auth failed:", error)
        setStatus("Authentication failed ❌")
      }
    )
  }, [])

  const handlePayment = async () => {
    // @ts-ignore
    if (!window.Pi) return

    try {
      // @ts-ignore
      await window.Pi.createPayment({
        amount: 1,
        memo: "Checklist 10 Test Payment",
        metadata: { app: "ShopPi" },
      })

      alert("Payment initiated 🎉")
    } catch (err) {
      console.error(err)
      alert("Payment cancelled or failed")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">ShopPi – Checklist 10</h1>

      <p>{status}</p>

      <button
        onClick={handlePayment}
        className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold"
      >
        Pay 1π (Test)
      </button>
    </main>
  )
}