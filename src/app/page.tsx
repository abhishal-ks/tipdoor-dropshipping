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

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[var(--primary)] via-[var(--primary)] to-[#7b3cf5] py-16 md:py-24">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, var(--primary-muted) 0%, transparent 50%)`,
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Desired Products, Delivered
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Quality dropshipping store. Browse our latest collection and get it
            shipped to your doorstep.
          </p>
          <Link
            href="#products"
            className="inline-block bg-white text-[var(--primary)] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2">
          <span className="w-1 h-8 bg-[var(--primary)] rounded-full" />
          Latest Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              href={`/products/${product._id}`}
              key={product._id}
              className="card overflow-hidden group"
            >
              <div className="relative overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(to top, var(--primary-muted), transparent)`,
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[var(--primary)] font-bold mt-2">
                  ₹{product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
