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

    return (
        <nav className="border-b">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-[#5e17eb]">
                    TipDoor
                </Link>

                <div className="flex gap-4 items-center">
                    <Link href="/cart">Cart ({cartCount})</Link>
                    <Link href="/orders">Orders</Link>

                    {loggedIn && (
                        <span className="text-sm text-gray-600">
                            Hi, {userName}
                        </span>
                    )}

                    {!loggedIn ? (
                        <Link href="/login">Login</Link>
                    ) : (
                        <button
                        onClick={logout}
                        className="cursor-pointer text-red-500 hover:bg-red-400 hover:text-white px-3 py-1.5 rounded-full">
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
