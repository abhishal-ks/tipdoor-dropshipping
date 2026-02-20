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
        <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-[var(--primary)] font-medium hover:underline"
                    >
                        ← Back to store
                    </Link>
                    <span className="text-[var(--muted-foreground)]">|</span>
                    <h1 className="text-2xl font-bold text-[var(--foreground)] gradient-text">
                        Admin Dashboard
                    </h1>
                </div>
                <button
                    onClick={logout}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                    Logout
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/admin/orders"
                    className="card p-8 text-center group border-2 border-transparent hover:border-[var(--primary-muted)] transition-all duration-300 hover:scale-105"
                >
                    <span
                        className="inline-block w-16 h-16 rounded-xl mb-4 flex items-center justify-center mx-auto text-[var(--primary)] bg-[var(--primary-muted)] text-3xl group-hover:scale-110 transition-transform"
                    >
                        📦
                    </span>
                    <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                        Orders
                    </h2>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        View and manage orders
                    </p>
                </Link>

                <Link
                    href="/admin/products"
                    className="card p-8 text-center group border-2 border-transparent hover:border-[var(--primary-muted)] transition-all duration-300 hover:scale-105"
                >
                    <span
                        className="inline-block w-16 h-16 rounded-xl mb-4 flex items-center justify-center mx-auto text-[var(--primary)] bg-[var(--primary-muted)] text-3xl group-hover:scale-110 transition-transform"
                    >
                        🛍️
                    </span>
                    <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                        Products
                    </h2>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Add and manage products
                    </p>
                </Link>
            </div>
        </div>
    );
}
