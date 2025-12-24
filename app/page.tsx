"use client"

import { ShoppingBag, Search, Menu, Home, User, Grid3x3, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CartProvider, useCart } from "./context/CartContext"

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

const products = [
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
  {
    id: 5,
    name: "Phone Case Premium",
    price: 19.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    sold: 3421,
  },
  {
    id: 6,
    name: "USB-C Cable 6ft",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    sold: 4532,
  },
  {
    id: 7,
    name: "Laptop Stand Aluminum",
    price: 44.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    sold: 876,
  },
  {
    id: 8,
    name: "Wireless Mouse",
    price: 29.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    sold: 1987,
  },
]

export default function HomePage() {
  return (
    <CartProvider>
      <PageContent />
    </CartProvider>
  )
}

// 🔹 Separate component to use CartContext
function PageContent() {
  const { cart } = useCart()

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-lg">π</span>
            </div>
            <h1 className="text-xl font-bold">ShopPi</h1>
          </div>
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ShoppingBag className="h-6 w-6" />
              {cart.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 bg-background text-foreground border-0 focus-visible:ring-accent"
            />
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((category) => (
            <button key={category.name} className="flex flex-col items-center gap-1 min-w-[70px]">
              <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center text-2xl hover:bg-secondary/80 transition-colors">
                {category.icon}
              </div>
              <span className="text-xs text-foreground">{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="px-4 py-2">
        <div className="rounded-lg bg-accent p-6 text-center">
          <h2 className="text-2xl font-bold text-accent-foreground mb-2">Welcome to ShopPi</h2>
          <p className="text-accent-foreground/80 mb-4">Shop globally with Pi Network</p>
          <div className="flex items-center justify-center gap-2 text-sm text-accent-foreground/70">
            <span>π</span>
            <span>Secure • Fast • Global</span>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Featured Products</h3>
          <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
            See All
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
                <div className="aspect-square relative bg-muted">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-card-foreground line-clamp-2 mb-2 leading-relaxed">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-xs text-muted-foreground">★</span>
                    <span className="text-xs text-muted-foreground">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">• {product.sold} sold</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-accent">π</span>
                    <span className="text-lg font-bold text-card-foreground">{product.price}</span>
                  </div>
                  {/* Add to Cart Button */}
                  <AddToCartButton product={product} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className="flex flex-col items-center gap-1 p-2">
            <Home className="h-5 w-5 text-primary" />
            <span className="text-xs text-primary font-medium">Home</span>
          </Link>
          <Link href="/categories" className="flex flex-col items-center gap-1 p-2">
            <Grid3x3 className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Categories</span>
          </Link>
          <Link href="/sell" className="flex flex-col items-center gap-1 p-2">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center -mt-6 shadow-lg">
              <Plus className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xs text-muted-foreground mt-1">Sell</span>
          </Link>
          <Link href="/orders" className="flex flex-col items-center gap-1 p-2">
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Orders</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 p-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Profile</span>
          </Link>
        </div>
      </nav>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

// 🔹 Add to Cart Button component
function AddToCartButton({ product }: { product: typeof products[0] }) {
  const { addToCart } = useCart()

  return (
    <Button
      variant="secondary"
      className="mt-2 w-full"
      onClick={(e) => {
        e.preventDefault() // Prevent navigating due to parent Link
        addToCart(product)
      }}
    >
      Add to Cart
    </Button>
  )
}
