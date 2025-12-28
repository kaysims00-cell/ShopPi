"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Seed demo products if none exist
    const stored = JSON.parse(localStorage.getItem("products_db") || "[]");

    if (stored.length === 0) {
      const demo: Product[] = [
        {
          id: "1",
          name: "ShopPi Hoodie",
          price: 15000,
          description: "Premium cotton hoodie",
        },
        {
          id: "2",
          name: "ShopPi Cap",
          price: 5000,
          description: "Stylish branded cap",
        },
        {
          id: "3",
          name: "ShopPi Mug",
          price: 3500,
          description: "Ceramic coffee mug",
        },
      ];
      localStorage.setItem("products_db", JSON.stringify(demo));
      setProducts(demo);
    } else {
      setProducts(stored);
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold text-lg">{p.name}</h2>
              <p className="text-sm text-muted-foreground">{p.description}</p>
              <p className="font-bold">₦{p.price}</p>

              <Button className="w-full">Add to Cart</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}