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

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

            {orders.length === 0 && <p>No orders yet.</p>}

            {orders.map((order) => (
                <div key={order._id} className="border rounded p-4 mb-6">
                    <div className="flex justify-between mb-3">
                        <p className="font-semibold">
                            Order #{order._id.slice(-6)}
                        </p>
                        <p>₹{order.amount}</p>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                        {new Date(order.createdAt).toLocaleString()}
                    </p>

                    {order.items.map((item, i) => (
                        <div key={i} className="flex gap-4 mb-3">
                            <img
                                src={item.image}
                                className="w-16 h-16 object-cover rounded"
                            />

                            <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    Qty: {item.quantity}
                                </p>
                            </div>

                            <p>₹{item.price * item.quantity}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
