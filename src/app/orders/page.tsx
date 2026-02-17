"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
    _id: string;
    amount: number;
    razorpay_payment_id: string;
    status: string;
    createdAt: string;
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

        if (Array.isArray(data)) {
            setOrders(data);
        } else {
            setOrders([]);
        }

        setLoading(false);
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

            {orders.length === 0 && <p>No orders yet.</p>}

            {orders.map((order) => (
                <div
                    key={order._id}
                    className="border rounded p-4 mb-4"
                >
                    <p>
                        <strong>Order ID:</strong> {order._id}
                    </p>

                    <p>
                        <strong>Amount:</strong> ₹{order.amount}
                    </p>

                    <p>
                        <strong>Status:</strong> {order.status}
                    </p>

                    <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                        Payment ID: {order.razorpay_payment_id}
                    </p>
                </div>
            ))}
        </div>
    );
}
