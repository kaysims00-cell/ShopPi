"use client"

import { useState } from "react"
import { ArrowLeft, ChevronRight, ChevronDown, ChevronUp, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const categories = [
  {
    name: "Electronics",
    icon: "📱",
    subcategories: ["Phones", "Laptops", "Tablets", "Cameras", "Audio"],
    count: 12543,
  },
  {
    name: "Fashion",
    icon: "👕",
    subcategories: ["Men", "Women", "Kids", "Accessories", "Shoes"],
    count: 8932,
  },
  {
    name: "Home & Garden",
    icon: "🏠",
    subcategories: ["Furniture", "Decor", "Kitchen", "Bedding", "Storage"],
    count: 6754,
  },
  {
    name: "Beauty & Health",
    icon: "💄",
    subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrance", "Tools"],
    count: 5621,
  },
  {
    name: "Sports & Outdoors",
    icon: "⚽",
    subcategories: ["Fitness", "Camping", "Cycling", "Water Sports", "Team Sports"],
    count: 4387,
  },
  {
    name: "Toys & Games",
    icon: "🧸",
    subcategories: ["Action Figures", "Puzzles", "Board Games", "Outdoor Toys", "Educational"],
    count: 3245,
  },
  {
    name: "Books & Media",
    icon: "📚",
    subcategories: ["Fiction", "Non-Fiction", "Comics", "Magazines", "Audiobooks"],
    count: 2876,
  },
  {
    name: "Food & Beverages",
    icon: "🍕",
    subcategories: ["Snacks", "Drinks", "Organic", "International", "Gourmet"],
    count: 1954,
  },
]

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.subcategories.some((sub) => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">All Categories</h1>
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Categories List */}
      <div className="divide-y divide-border">
        {filteredCategories.map((category) => (
          <div key={category.name} className="p-4 bg-card hover:bg-accent/5 transition-colors rounded-lg mb-2">
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => setExpanded(expanded === category.name ? null : category.name)}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl">
                {category.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {category.subcategories.slice(0, 3).join(" • ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{category.count}</span>
                {expanded === category.name ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Expandable Subcategories */}
            {expanded === category.name && (
              <div className="mt-2 px-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub}
                    href={`/products/${category.name.toLowerCase().replace(/\s+/g, "-")}?sub=${sub.toLowerCase()}`}
                    className="py-1 px-2 rounded-md hover:bg-accent/10 transition"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}