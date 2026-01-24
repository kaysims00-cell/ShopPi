"use client"

import { useEffect } from "react"

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      console.log("window.Pi =", window.Pi)

      // @ts-ignore
      alert("window.Pi = " + (window.Pi ? "DETECTED" : "UNDEFINED"))
    }
  }, [])

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>ShopPi – SDK Detection Test</h1>

      <p>
        This page checks whether the Pi SDK is injected.
      </p>

      <p>
        Open this page ONLY inside <strong>Pi Browser</strong>.
      </p>
    </main>
  )
}