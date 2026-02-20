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
        <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-10 flex items-center gap-3">
                <span className="w-2 h-10 bg-gradient-to-b from-[var(--primary)] to-[var(--primary-light)] rounded-full" />
                <span className="gradient-text">Your Cart</span>
            </h1>

            {cart.length === 0 && (
                <div className="card p-12 text-center">
                    <p className="text-[var(--muted-foreground)] mb-4 text-lg">Your cart is empty.</p>
                    <Link
                        href="/"
                        className="inline-block text-[var(--primary)] font-medium hover:underline"
                    >
                        Continue shopping
                    </Link>
                </div>
            )}

            {cart.map((item, index) => (
                <div
                    key={item._id}
                    className="card flex gap-6 items-center p-5 mb-4 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--foreground)] text-lg">
                            {item.product.name}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">
                            Qty: {item.quantity}
                        </p>
                    </div>

                    <p className="font-bold text-[var(--primary)] text-xl">
                        ₹{item.product.price * item.quantity}
                    </p>
                </div>
            ))}

            {cart.length > 0 && (
                <div className="card mt-8 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 glow">
                    <h2 className="text-2xl font-bold text-[var(--foreground)]">Total: ₹{total}</h2>

                    <button
                        onClick={() => router.push("/checkout")}
                        className="btn-primary text-lg px-8"
                    >
                        Checkout →
                    </button>
                </div>
            )}
        </div>
    );
}
