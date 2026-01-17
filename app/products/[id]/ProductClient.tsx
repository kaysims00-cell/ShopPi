"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import ProductReviews from "@/app/components/ProductReviews";

type Product = {
  id: string | number;
  name: string;
  category?: string;
  image?: string;
  description?: string;
  price?: number;
  stock?: number;
};

export default function ProductClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, cart } = useCart();

  const existingItem = cart.find((item) => item.id === product.id);
  const quantityInCart = existingItem ? existingItem.quantity : 0;

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addToCart({
      id: product.id.toString(),
      name: product.name || "",
      price: product.price || 0,
      image: product.image,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border flex items-center px-4 py-3 gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">{product.name}</h1>
      </header>

      {/* Product Details */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="rounded-lg shadow-md"
            />
          ) : (
            <div className="w-[400px] h-[400px] rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {product.category && (
            <p className="text-sm text-muted-foreground">{product.category}</p>
          )}
          <h2 className="text-2xl font-bold">{product.name}</h2>
          {product.description && (
            <p className="text-base text-muted-foreground">
              {product.description}
            </p>
          )}
          {typeof product.price !== "undefined" && (
            <p className="text-xl font-semibold">₦{product.price}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {typeof product.stock !== "undefined"
              ? product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"
              : "Stock unknown"}
          </p>

          <Button
            className="flex items-center gap-2 mt-2"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
            {quantityInCart > 0 && ` (${quantityInCart})`}
          </Button>
        </div>
      </div>

      {/* ⭐ Product Reviews */}
<div className="px-4 mt-12 border-t pt-8">
  <ProductReviews productId={String(product.id)} />
</div>
<ProductReviews productId={String(product.id)} />
      {/* Related Products */}
      <div className="px-4 mt-12">
        <h3 className="text-lg font-semibold mb-4">Related Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 text-muted-foreground">
            Related products will appear here.
          </div>
        </div>
      </div>
    </div>
  );
}