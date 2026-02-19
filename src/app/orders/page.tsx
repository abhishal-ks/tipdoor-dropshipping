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
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2">
                <span className="w-1 h-8 bg-[var(--primary)] rounded-full" />
                Your Orders
            </h1>

            {orders.length === 0 && (
                <div className="card p-12 text-center">
                    <p className="text-gray-600">No orders yet.</p>
                </div>
            )}

            {orders.map((order) => (
                <div key={order._id} className="card p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <p className="font-semibold text-gray-900">
                            Order #{order._id.slice(-6)}
                        </p>
                        <p className="text-lg font-bold text-[var(--primary)]">
                            ₹{order.amount}
                        </p>
                    </div>

                    <p className="text-sm text-gray-500 mb-6">
                        {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <div className="space-y-3">
                        {order.items.map((item, i) => (
                            <div
                                key={i}
                                className="flex gap-4 items-center py-2"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900">
                                        {item.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Qty: {item.quantity}
                                    </p>
                                </div>

                                <p className="font-medium">
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
