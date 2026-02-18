"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Orders</h1>

            {orders.map((order) => (
                <div key={order._id} className="border rounded p-4 mb-6">
                    <div className="mb-2">
                        <strong>Customer:</strong> {order.user?.name} ({order.user?.email})
                    </div>

                    <div className="mb-2">
                        <strong>Phone:</strong> {order.shippingAddress?.phone}
                    </div>

                    <div className="mb-2">
                        <strong>Address:</strong>{" "}
                        {order.shippingAddress?.address},{" "}
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state} -{" "}
                        {order.shippingAddress?.pincode}
                    </div>

                    <p className="mb-2 font-semibold">Items:</p>

                    {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 mb-2">
                            <img
                                src={item.image}
                                className="w-14 h-14 object-cover rounded"
                            />
                            <div className="flex-1">
                                <p>{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    Qty: {item.quantity}
                                </p>
                            </div>
                            <p>₹{item.price * item.quantity}</p>
                        </div>
                    ))}

                    <div className="mt-2 font-bold">
                        Total: ₹{order.amount}
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
