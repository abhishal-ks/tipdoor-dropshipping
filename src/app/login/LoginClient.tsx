'use client';

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const redirect = searchParams.get("redirect") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);

            const me = await fetch("/api/auth/me", {
                headers: { Authorization: `Bearer ${data.token}` },
            });

            const user = await me.json();

            if (user.user?.role === "admin") {
                router.push("/admin");
            } else {
                router.push(redirect);
            }
        }

    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

            <input
                className="border p-2 mb-2 w-full"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="border p-2 mb-4 w-full"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={handleLogin}
                className="bg-[#5e17eb] text-white w-full py-2 rounded"
            >
                Login
            </button>

            <p className="mt-4 text-center text-sm text-gray-500">
                Don't have an account? <Link href="/register" className="text-[#5e17eb]">Register</Link>
            </p>
        </div>
    );
}