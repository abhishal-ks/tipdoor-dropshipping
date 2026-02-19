"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [userName, setUserName] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setLoggedIn(!!token);

        if (token) {
            fetchCart();
            fetchUser();
        }
    }, []);

    const fetchUser = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.user) setUserName(data.user.name);
    };

    const fetchCart = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setCartCount(data.items?.length || 0);
    };

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/");
        location.reload();
    };

    const navLink =
        "text-gray-700 hover:text-[var(--primary)] font-medium transition-colors px-3 py-2 rounded-lg hover:bg-[var(--primary-muted)]";

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link
                    href="/"
                    className="text-xl font-bold text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors"
                >
                    TipDoor
                </Link>

                <div className="flex gap-1 items-center">
                    <Link href="/cart" className={navLink}>
                        Cart ({cartCount})
                    </Link>
                    <Link href="/orders" className={navLink}>
                        Orders
                    </Link>

                    {loggedIn && (
                        <span className="text-sm text-gray-600 ml-2 px-3 py-1.5 bg-gray-100 rounded-full">
                            Hi, {userName}
                        </span>
                    )}

                    {!loggedIn ? (
                        <Link
                            href="/login"
                            className="ml-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors"
                        >
                            Login
                        </Link>
                    ) : (
                        <button
                            onClick={logout}
                            className="ml-2 cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
