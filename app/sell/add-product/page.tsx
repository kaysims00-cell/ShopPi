"use client"

import type React from "react"

import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddProductPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/sell")
  }

  const addImage = () => {
    setImages([...images, "/placeholder.svg?height=200&width=200"])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/sell">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Add New Product</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Product Images */}
        <div className="space-y-3">
          <Label>Product Images</Label>
          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {images.length < 6 && (
              <button
                type="button"
                onClick={addImage}
                className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center gap-2 hover:bg-muted transition-colors"
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add Photo</span>
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Add up to 6 images</p>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="Enter product name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="beauty">Beauty & Health</SelectItem>
                <SelectItem value="sports">Sports & Outdoors</SelectItem>
                <SelectItem value="toys">Toys & Games</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your product..." rows={4} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (π)</Label>
              <Input id="price" type="number" step="0.01" placeholder="0.00" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input id="stock" type="number" placeholder="0" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipping">Shipping Options</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select shipping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free Worldwide Shipping</SelectItem>
                <SelectItem value="standard">Standard Shipping</SelectItem>
                <SelectItem value="express">Express Shipping</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Link href="/sell" className="flex-1">
            <Button type="button" variant="outline" className="w-full bg-transparent">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="flex-1 bg-primary text-primary-foreground">
            List Product
          </Button>
        </div>
      </form>
    </div>
  )
}
