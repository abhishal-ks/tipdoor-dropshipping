"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel";

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

  // Carousel images - update these paths to match your images
  const carouselImages = [
    "/carousel/banner1.jpg",
    "/carousel/banner2.jpg",
    "/carousel/banner3.jpg",
    "/carousel/banner4.jpg",
    "/carousel/banner5.jpg",
  ];

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );

  return (
    <div>
      {/* Image Carousel Section */}
      <section className="relative w-full mb-4 md:mb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-2">
          <ImageCarousel images={carouselImages} autoPlayInterval={5000} />
        </div>
      </section>

      {/* Enhanced Hero Section - Reduced Height */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] via-[#7b3cf5] to-[#9d5ff5] py-6 md:py-12 lg:py-16">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "1s" }}
          />
        </div>
        
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}
        />
        
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 text-center animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 md:mb-4 leading-tight">
            Your Desired Products,
            <br />
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Delivered
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto mb-4 md:mb-6 leading-relaxed">
            Quality dropshipping store. Browse our latest collection and get it
            shipped to your doorstep.
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              const productsSection = document.getElementById("products");
              if (productsSection) {
                productsSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
            className="inline-block bg-white text-[var(--primary)] font-bold px-6 py-2 md:px-8 md:py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105 transform text-sm md:text-base"
          >
            Shop Now →
          </button>
        </div>
      </section>

      {/* Products Section - Negative margin to make it partially visible */}
      <section id="products" className="max-w-6xl mx-auto px-4 md:px-6 -mt-4 md:-mt-8 lg:-mt-12 py-8 md:py-12 lg:py-16 relative z-10">
        <div className="mb-6 md:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 flex items-center justify-center gap-2 md:gap-3">
            <span className="w-1 md:w-2 h-6 md:h-10 bg-gradient-to-b from-[var(--primary)] to-[var(--primary-light)] rounded-full" />
            <span className="gradient-text">Latest Products</span>
            <span className="w-1 md:w-2 h-6 md:h-10 bg-gradient-to-b from-[var(--primary-light)] to-[var(--primary)] rounded-full" />
          </h2>
          <p className="text-sm md:text-base text-[var(--muted-foreground)] mt-1 md:mt-2">
            Discover our handpicked collection
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Link
              href={`/products/${product._id}`}
              key={product._id}
              className="card overflow-hidden group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 right-2 bg-[var(--primary)] text-white px-2 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-[var(--foreground)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors mb-2">
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-[var(--primary)]">
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
