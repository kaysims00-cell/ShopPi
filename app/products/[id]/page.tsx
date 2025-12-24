import React from "react";
import { products } from "@/app/data/products";
import ProductClient from "./ProductClient";
import ProductReviews from "@/app/components/ProductReviews";

export default async function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js App Router params are async
  const { id } = await params;

  if (!id) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">Invalid Product URL</h2>
        <p className="text-gray-600 mt-2">
          This product link is not structured correctly.
        </p>
      </div>
    );
  }

  const cleanId = id.replace(/\//g, "").trim();
  const product = products.find((p) => String(p.id) === cleanId);

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">Product not found</h2>
        <p className="text-gray-600 mt-2">
          The requested product does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Product details */}
      <ProductClient product={product} />

      {/* Reviews section */}
      <ProductReviews productId={product.id.toString()} />
    </div>
  );
}
