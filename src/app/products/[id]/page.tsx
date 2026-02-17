"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

    if (loading) return <div className="p-6">Loading...</div>;
    if (!product) return <div className="p-6">Product not found</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
            <img
                src={product.image}
                className="w-full h-[400px] object-cover rounded"
            />

            <div>
                <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
                <p className="text-2xl text-[#5e17eb] font-semibold mb-4">
                    ₹{product.price}
                </p>

                <p className="text-gray-600 mb-6">{product.description}</p>

                <button
                    onClick={addToCart}
                    className="bg-[#5e17eb] text-white px-6 py-3 rounded hover:bg-[#4b12c2]"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
