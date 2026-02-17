"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();

    if (Array.isArray(data)) {
      setProducts(data);
    }

    setLoading(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Latest Products</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            href={`/products/${product._id}`}
            key={product._id}
            className="border rounded-lg p-4 hover:shadow"
          >
            <img
              src={product.image}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-[#5e17eb] font-bold">₹{product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
