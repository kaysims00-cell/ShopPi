import React from "react";
import Link from "next/link";

type ProductProps = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
};

const ProductClient: React.FC<{ product: ProductProps }> = ({ product }) => {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border rounded-lg p-4 shadow-md hover:shadow-xl transition duration-200 cursor-pointer">
        <img
          src={product.images[0] || "/images/products/placeholder.png"}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="font-bold text-blue-600">${product.price}</p>
      </div>
    </Link>
  );
};

export default ProductClient;
