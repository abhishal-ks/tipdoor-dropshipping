"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return router.push("/login");

        fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.user?.role !== "admin") router.push("/");
            });
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-2 gap-6">
                <Link
                    href="/admin/orders"
                    className="border rounded p-6 hover:shadow"
                >
                    Orders
                </Link>

                <Link
                    href="/admin/products"
                    className="border rounded p-6 hover:shadow"
                >
                    Products
                </Link>
            </div>
        </div>
    );
}
