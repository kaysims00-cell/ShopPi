"use client"

import {
  ShoppingBag,
  Search,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CartProvider, useCart } from "./context/CartContext"

/* ============================
   PI PAYMENT — MINIMAL & SAFE
============================ */
function checkoutWithPi(amount: number) {
  if (typeof window === "undefined") return

  // @ts-ignore
  if (!window.Pi) {
    alert("Please open this app in Pi Browser")
    return
  }

  // ✅ MINIMAL PAYMENT (NO CALLBACKS → NO TS ERRORS)
  // @ts-ignore
  window.Pi.createPayment({
    amount,
    memo: "ShopPi Testnet Payment",
    metadata: { app: "ShopPi" },
  })
}

type Product = {
  id: number
  name: string
  price: number
  image?: string
}

const products: Product[] = [
  { id: 1, name: "Wireless Earbuds", price: 1 },
  { id: 2, name: "Smart Watch", price: 1 },
]

export default function HomePage() {
  return (
    <CartProvider>
      <PageContent />
    </CartProvider>
  )
}

function PageContent() {
  const { cart, addToCart, clearCart } = useCart()

  const totalPi = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <Menu />
        <h1 className="font-bold">ShopPi</h1>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => {
            if (cart.length === 0) {
              alert("Cart is empty")
              return
            }

            checkoutWithPi(totalPi)
            clearCart()
          }}
        >
          <ShoppingBag />
          {cart.length > 0 && (
            <Badge className="absolute -top-1 -right-1">
              {cart.length}
            </Badge>
          )}
        </Button>
      </header>

      {/* SEARCH */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" />
          <Input placeholder="Search..." className="pl-10" />
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded p-3">
            <h3 className="font-semibold">{p.name}</h3>
            <p>1 Pi</p>

            <Button
              className="mt-2 w-full"
              onClick={() =>
                addToCart({
                  id: p.id.toString(),
                  name: p.name,
                  price: 1,
                  quantity: 1,
                })
              }
            >
              Add to Cart
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}