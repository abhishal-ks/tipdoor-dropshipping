"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
    _id: string;
    amount: number;
    status: string;
    createdAt: string;
    items: {
        name: string;
        price: number;
        image: string;
        quantity: number;
    }[];
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        const res = await fetch("/api/orders", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (Array.isArray(data)) setOrders(data);

        setLoading(false);
    };

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
                <span className="gradient-text">Your Orders</span>
            </h1>

            {orders.length === 0 && (
                <div className="card p-12 text-center">
                    <p className="text-[var(--muted-foreground)] text-lg">No orders yet.</p>
                </div>
            )}

            {orders.map((order, index) => (
                <div
                    key={order._id}
                    className="card p-6 mb-6 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-[var(--border)]">
                        <p className="font-semibold text-[var(--foreground)] text-lg">
                            Order #{order._id.slice(-6)}
                        </p>
                        <p className="text-2xl font-bold text-[var(--primary)]">
                            ₹{order.amount}
                        </p>
                    </div>

                    <p className="text-sm text-[var(--muted-foreground)] mb-6">
                        {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <div className="space-y-3">
                        {order.items.map((item, i) => (
                            <div
                                key={i}
                                className="flex gap-4 items-center py-3 border-b border-[var(--border)] last:border-0"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-[var(--foreground)]">
                                        {item.name}
                                    </p>
                                    <p className="text-sm text-[var(--muted-foreground)]">
                                        Qty: {item.quantity}
                                    </p>
                                </div>

                                <p className="font-medium text-[var(--foreground)]">
                                    ₹{item.price * item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
