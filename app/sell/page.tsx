"use client"

import { ArrowLeft, Plus, Package, TrendingUp, DollarSign, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const stats = [
  { label: "Total Sales", value: "π 12,450", change: "+12%", icon: DollarSign },
  { label: "Products", value: "48", change: "+3", icon: Package },
  { label: "Views", value: "8,234", change: "+18%", icon: Eye },
  { label: "Rating", value: "4.9", change: "+0.1", icon: TrendingUp },
]

const products = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    price: 89.99,
    stock: 45,
    sold: 234,
    image: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    price: 199.99,
    stock: 12,
    sold: 156,
    image: "/placeholder.svg?height=80&width=80",
    status: "active",
  },
  {
    id: 3,
    name: "Portable Charger",
    price: 34.99,
    stock: 0,
    sold: 567,
    image: "/placeholder.svg?height=80&width=80",
    status: "out-of-stock",
  },
]

const orders = [
  {
    id: "ORD-2024-001",
    customer: "Sarah M.",
    product: "Wireless Earbuds Pro",
    amount: 89.99,
    status: "pending",
    date: "2 hours ago",
  },
  {
    id: "ORD-2024-002",
    customer: "John D.",
    product: "Smart Watch Series 5",
    amount: 199.99,
    status: "shipped",
    date: "5 hours ago",
  },
  {
    id: "ORD-2024-003",
    customer: "Emily R.",
    product: "Portable Charger",
    amount: 69.98,
    status: "delivered",
    date: "1 day ago",
  },
]

export default function SellPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-foreground">Seller Dashboard</h1>
          </div>
          <Link href="/sell/add-product">
            <Button size="sm" className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" />
              Add Product
            </Button>
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <stat.icon className="h-5 w-5 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-4 space-y-3">
            {products.map((product) => (
              <Card key={product.id} className="p-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm font-medium text-foreground line-clamp-1">{product.name}</h3>
                      <Badge variant={product.status === "active" ? "default" : "secondary"} className="ml-2">
                        {product.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-lg font-bold text-accent">π</span>
                      <span className="text-lg font-bold text-foreground">{product.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Stock: {product.stock}</span>
                      <span>Sold: {product.sold}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="orders" className="mt-4 space-y-3">
            {orders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                  </div>
                  <Badge
                    variant={
                      order.status === "delivered" ? "default" : order.status === "shipped" ? "secondary" : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-foreground mb-2">{order.product}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-accent">π</span>
                    <span className="text-sm font-bold text-foreground">{order.amount}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{order.date}</span>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
