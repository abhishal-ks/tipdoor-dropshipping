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

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

            {cart.length === 0 && (
                <p>
                    Cart empty.{" "}
                    <Link href="/" className="text-[#5e17eb] underline">
                        Continue shopping
                    </Link>
                </p>
            )}

            {cart.map((item) => (
                <div
                    key={item._id}
                    className="flex gap-4 items-center border-b py-4"
                >
                    <img
                        src={item.product.image}
                        className="w-20 h-20 object-cover rounded"
                    />

                    <div className="flex-1">
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                        </p>
                    </div>

                    <p>₹{item.product.price * item.quantity}</p>
                </div>
            ))}

            {cart.length > 0 && (
                <div className="mt-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Total: ₹{total}</h2>

                    <button
                        onClick={() => router.push("/checkout")}
                        className="bg-[#5e17eb] text-white px-6 py-3 rounded hover:bg-[#4b12c2]"
                    >
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}
