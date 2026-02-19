"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/admin/orders", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.status === 401) {
            router.push("/");
            return;
        }

        const data = await res.json();
        setOrders(data);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="text-[var(--primary)] font-medium hover:underline"
                    >
                        ← Dashboard
                    </Link>
                    <span className="text-gray-300">|</span>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Admin Orders
                    </h1>
                </div>
            </header>

            {orders.map((order) => (
                <div key={order._id} className="card p-6 mb-6">
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm font-semibold text-[var(--primary)] mb-1">
                            Customer
                        </p>
                        <p className="text-gray-900">
                            {order.user?.name} ({order.user?.email})
                        </p>
                    </div>

                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm font-semibold text-[var(--primary)] mb-1">
                            Phone
                        </p>
                        <p className="text-gray-700">
                            {order.shippingAddress?.phone}
                        </p>
                    </div>

                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm font-semibold text-[var(--primary)] mb-1">
                            Address
                        </p>
                        <p className="text-gray-700">
                            {order.shippingAddress?.address},{" "}
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.state} -{" "}
                            {order.shippingAddress?.pincode}
                        </p>
                    </div>

                    <p className="text-sm font-semibold text-[var(--primary)] mb-3">
                        Items
                    </p>

                    {order.items.map((item: any, i: number) => (
                        <div
                            key={i}
                            className="flex gap-4 items-center py-3 mb-2"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-14 object-cover rounded-lg"
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

                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleString()}
                        </span>
                        <span className="text-lg font-bold text-[var(--primary)]">
                            Total: ₹{order.amount}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
