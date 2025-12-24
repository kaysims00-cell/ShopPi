// app/products/page.tsx
import Link from "next/link";
import { products } from "../data/products";

export default function ProductsPage() {
  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/products/${p.id}`}
          className="border p-4 rounded-lg shadow-sm hover:shadow-lg transition"
        >
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-40 object-cover rounded"
          />
          <h2 className="font-bold text-lg mt-3">{p.name}</h2>
          <p className="text-gray-600">${p.price}</p>
        </Link>
      ))}
    </div>
  );
}
