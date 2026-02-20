"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Product = {
    _id: string;
    name: string;
    price: number;
    description?: string;
    image: string;
};

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        setProduct(data);
        setLoading(false);
    };

    const addToCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push(`/login?next=/products/${id}`);
            return;
        }

        await fetch("/api/cart/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ product_id: product?._id }),
        });

        router.push("/cart");
    };

    if (loading)
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="loading-spinner" />
            </div>
        );
    if (!product)
        return (
            <div className="max-w-5xl mx-auto p-6 text-center">
                <p className="text-[var(--muted-foreground)] mb-4">Product not found</p>
                <Link
                    href="/"
                    className="text-[var(--primary)] font-medium hover:underline"
                >
                    Back to shop
                </Link>
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
            <div className="card overflow-hidden grid md:grid-cols-2 gap-0">
                <div className="bg-gray-100 dark:bg-gray-800 relative group overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-8 md:p-10 flex flex-col bg-[var(--surface)]">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--foreground)]">
                        {product.name}
                    </h1>
                    <p className="text-3xl font-bold text-[var(--primary)] mb-6">
                        ₹{product.price}
                    </p>

                    <p className="text-[var(--muted-foreground)] mb-8 flex-1 leading-relaxed">
                        {product.description || "No description available."}
                    </p>

                    <button
                        onClick={addToCart}
                        className="btn-primary w-full md:w-auto text-lg py-4"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
