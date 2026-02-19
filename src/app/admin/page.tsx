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

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/");
        location.reload();
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-[var(--primary)] font-medium hover:underline"
                    >
                        ← Back to store
                    </Link>
                    <span className="text-gray-300">|</span>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Admin Dashboard
                    </h1>
                </div>
                <button
                    onClick={logout}
                    className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    Logout
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/admin/orders"
                    className="card p-8 text-center group border-2 border-transparent hover:border-[var(--primary-muted)]"
                >
                    <span
                        className="inline-block w-12 h-12 rounded-lg mb-4 flex items-center justify-center mx-auto text-[var(--primary)] bg-[var(--primary-muted)]"
                        style={{ fontSize: "1.5rem" }}
                    >
                        📦
                    </span>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Orders
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        View and manage orders
                    </p>
                </Link>

                <Link
                    href="/admin/products"
                    className="card p-8 text-center group border-2 border-transparent hover:border-[var(--primary-muted)]"
                >
                    <span
                        className="inline-block w-12 h-12 rounded-lg mb-4 flex items-center justify-center mx-auto text-[var(--primary)] bg-[var(--primary-muted)]"
                        style={{ fontSize: "1.5rem" }}
                    >
                        🛍️
                    </span>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Products
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Add and manage products
                    </p>
                </Link>
            </div>
        </div>
    );
}
