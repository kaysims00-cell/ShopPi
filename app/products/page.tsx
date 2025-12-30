"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products_db") || "[]");

    if (stored.length === 0) {
      const demo: Product[] = [
        { id: "1", name: "ShopPi Hoodie", price: 15000, description: "Premium cotton hoodie" },
        { id: "2", name: "ShopPi Cap", price: 5000, description: "Stylish branded cap" },
        { id: "3", name: "ShopPi Mug", price: 3500, description: "Ceramic coffee mug" },
      ];
      localStorage.setItem("products_db", JSON.stringify(demo));
      setProducts(demo);
    } else {
      setProducts(stored);
    }
  }, []);

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((item: any) => item.id === product.id);

    let updated;
    if (existing) {
      updated = cart.map((item: any) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [...cart, { ...product, quantity: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updated));
    setMessage(`${product.name} added to cart`);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/cart" className="text-blue-600 underline">
          View Cart →
        </Link>
      </div>

      {message && (
        <p className="mb-4 text-green-600 font-medium">{message}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold text-lg">{p.name}</h2>
              <p className="text-sm text-muted-foreground">{p.description}</p>
              <p className="font-bold">₦{p.price}</p>

              <Button className="w-full" onClick={() => addToCart(p)}>
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}