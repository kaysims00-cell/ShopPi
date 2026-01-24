"use client"

import {
  ShoppingBag,
  Search,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CartProvider, useCart } from "./context/CartContext"
import CartDrawer from "@/app/components/CartDrawer"

/* ============================
   PI PAYMENT (CHECKLIST 10)
============================ */
async function checkoutWithPi(amount: number) {
  if (typeof window === "undefined") return

  const Pi = (window as any).Pi
  if (!Pi) {
    alert("Pi Browser not detected")
    return
  }

  try {
    // ✅ Correct init (TypeScript-safe)
    await Pi.init({ version: "2.0" })

    // ✅ Cast once to bypass outdated typings
    ;(Pi as any).createPayment(
      {
        amount,
        memo: "ShopPi Checklist 10 Test",
        metadata: {
          app: "ShopPi",
          checklist: 10,
        },
      },
      {
        onReadyForServerApproval(paymentId: string) {
          console.log("Ready for approval:", paymentId)
        },
        onReadyForServerCompletion(paymentId: string, txid: string) {
          console.log("Payment completed:", paymentId, txid)
          alert("Payment successful 🎉")
        },
        onCancel(paymentId: string) {
          alert("Payment cancelled")
        },
        onError(error: any) {
          console.error(error)
          alert("Payment failed")
        },
      }
    )
  } catch (err) {
    console.error("Pi SDK error", err)
    alert("Pi SDK not ready. Try again.")
  }
}

const categories = [
  { name: "Electronics", icon: "📱" },
  { name: "Fashion", icon: "👕" },
  { name: "Home", icon: "🏠" },
  { name: "Beauty", icon: "💄" },
  { name: "Sports", icon: "⚽" },
  { name: "Toys", icon: "🧸" },
  { name: "Books", icon: "📚" },
  { name: "Food", icon: "🍕" },
]

type Product = {
  id: number
  name: string
  price: number
  image?: string
  rating: number
  sold: number
}

const products: Product[] = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    price: 1,
    image: "/placeholder.svg",
    rating: 4.8,
    sold: 1234,
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    price: 1,
    image: "/placeholder.svg",
    rating: 4.9,
    sold: 890,
  },
]

export default function HomePage() {
  return (
    <CartProvider>
      <PageContent />
    </CartProvider>
  )
}

function PageContent() {
  const { cart, clearCart } = useCart()

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>

          <h1 className="text-xl font-bold">ShopPi</h1>

          {/* CART */}
          <CartDrawer
            onCheckout={() => {
              if (cart.length === 0) return
              checkoutWithPi(cart.length)
              clearCart()
            }}
          >
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-6 w-6" />
              {cart.length > 0 && (
                <Badge className="absolute -top-1 -right-1">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </CartDrawer>
        </div>

        {/* SEARCH */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input placeholder="Search products..." className="pl-10" />
          </div>
        </div>
      </header>

      {/* CATEGORIES */}
      <section className="px-4 py-4 flex gap-3 overflow-x-auto">
        {categories.map((cat) => (
          <div key={cat.name} className="text-center min-w-[70px]">
            <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center text-2xl">
              {cat.icon}
            </div>
            <p className="text-xs mt-1">{cat.name}</p>
          </div>
        ))}
      </section>

      {/* PRODUCTS */}
      <section className="px-4">
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />

              <h4 className="mt-2 text-sm font-semibold">
                {product.name}
              </h4>

              <p className="text-sm text-muted-foreground">
                {product.price} π
              </p>

              <AddToCartButton product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ADD TO CART */
function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <Button
      className="mt-2 w-full"
      onClick={() =>
        addToCart({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          quantity: 1,
        })
      }
    >
      Add to Cart
    </Button>
  )
}