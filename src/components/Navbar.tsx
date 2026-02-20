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
        "text-[var(--foreground)] hover:text-[var(--primary)] font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-[var(--primary-muted)] relative group";

    return (
        <nav className="sticky top-0 z-50 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link
                    href="/"
                    className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                >
                    {/* Logo Image - Place your logo at public/logo.png or public/logo.svg */}
                    <img
                        src="/logo.png"
                        alt="TipDoor Logo"
                        className="h-12 md:h-14 w-auto"
                        onError={(e) => {
                            // Fallback to text if logo not found
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector(".logo-text")) {
                                const text = document.createElement("span");
                                text.className = "logo-text text-2xl font-bold gradient-text";
                                text.textContent = "TipDoor";
                                parent.appendChild(text);
                            }
                        }}
                    />
                    <span className="text-2xl font-bold gradient-text hidden logo-text">
                        TipDoor
                    </span>
                </Link>

                <div className="flex gap-2 items-center">
                    <Link href="/cart" className={navLink}>
                        <span className="relative">
                            Cart ({cartCount})
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[var(--primary)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </span>
                    </Link>
                    <Link href="/orders" className={navLink}>
                        Orders
                    </Link>

                    {loggedIn && (
                        <span className="text-sm text-[var(--muted-foreground)] ml-2 px-4 py-2 bg-[var(--surface-elevated)] rounded-full border border-[var(--border)]">
                            Hi, {userName}
                        </span>
                    )}

                    {!loggedIn ? (
                        <Link
                            href="/login"
                            className="ml-2 btn-primary"
                        >
                            Login
                        </Link>
                    ) : (
                        <button
                            onClick={logout}
                            className="ml-2 cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
