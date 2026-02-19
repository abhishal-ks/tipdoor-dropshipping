"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CartItem = {
    _id: string;
    quantity: number;
    product: {
        name: string;
        price: number;
        image: string;
    };
};

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/cart", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (Array.isArray(data)) {
            setCart(data);
        } else {
            setCart([]);
        }

        setLoading(false);
    };

    const total = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    if (loading)
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="loading-spinner" />
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2">
                <span className="w-1 h-8 bg-[var(--primary)] rounded-full" />
                Your Cart
            </h1>

            {cart.length === 0 && (
                <div className="card p-12 text-center">
                    <p className="text-gray-600 mb-4">Your cart is empty.</p>
                    <Link
                        href="/"
                        className="inline-block text-[var(--primary)] font-medium hover:underline"
                    >
                        Continue shopping
                    </Link>
                </div>
            )}

            {cart.map((item) => (
                <div
                    key={item._id}
                    className="card flex gap-6 items-center p-4 mb-4"
                >
                    <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">
                            {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                        </p>
                    </div>

                    <p className="font-semibold text-[var(--primary)]">
                        ₹{item.product.price * item.quantity}
                    </p>
                </div>
            ))}

            {cart.length > 0 && (
                <div className="card mt-6 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold">Total: ₹{total}</h2>

                    <button
                        onClick={() => router.push("/checkout")}
                        className="btn-primary"
                    >
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}
