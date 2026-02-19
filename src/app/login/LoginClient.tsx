"use client";

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
        <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
            <div
                className="card p-8 w-full max-w-md"
                style={{ maxWidth: "28rem" }}
            >
                <h1 className="text-2xl font-bold mb-6 text-gray-900">
                    Login
                </h1>

                <input
                    className="input-field mb-4"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="input-field mb-6"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="btn-primary w-full"
                >
                    Login
                </button>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-[var(--primary)] font-medium hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
