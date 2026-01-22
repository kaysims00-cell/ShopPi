"use client"

import {
  ShoppingBag,
  Search,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CartProvider, useCart } from "./context/CartContext"
import CartDrawer from "@/app/components/CartDrawer"
import { useEffect } from "react"

/* ============================
   PI PAYMENT FUNCTION
============================ */
function checkoutWithPi(amount: number) {
  if (typeof window === "undefined") return

  // @ts-ignore
  if (!window.Pi) {
    alert("Please open this app in Pi Browser")
    return
  }

  // @ts-ignore
  window.Pi.createPayment(
    {
      amount,
      memo: "ShopPi Test Purchase",
      metadata: { app: "ShopPi" },
    },
    {
      onReadyForServerApproval(paymentId: string) {
        console.log("Ready for approval", paymentId)
      },
      onReadyForServerCompletion(paymentId: string, txid: string) {
        console.log("Payment completed", paymentId, txid)
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
    price: 89.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    sold: 1234,
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    price: 199.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    sold: 890,
  },
  {
    id: 3,
    name: "Portable Charger 20000mAh",
    price: 34.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    sold: 2456,
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: 59.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    sold: 567,
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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>

          <h1 className="text-xl font-bold">ShopPi</h1>

          {/* ✅ CART DRAWER */}
          <CartDrawer
            onCheckout={() => {
              if (cart.length === 0) return
              checkoutWithPi(cart.length) // 1 Pi per item (Testnet)
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

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input placeholder="Search products..." className="pl-10" />
          </div>
        </div>
      </header>

      {/* Categories */}
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

      {/* Products */}
      <section className="px-4">
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="border rounded-lg p-3">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded"
                />

                <h4 className="mt-2 text-sm font-semibold">
                  {product.name}
                </h4>

                <p className="text-sm text-muted-foreground">
                  ₦{product.price}
                </p>

                <AddToCartButton product={product} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ✅ ADD TO CART */
function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <Button
      className="mt-2 w-full"
      onClick={(e) => {
        e.preventDefault()

        addToCart({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        })
      }}
    >
      Add to Cart
    </Button>
  )
}